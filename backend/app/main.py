"""
Main FastAPI Application for Pelangi Frame Receipt Intelligence System.
Configured for production deployment on Render, Koyeb, or VPS.
"""

import os
import uuid
import logging
from pathlib import Path
from typing import Optional, List

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from app.schemas.receipt import ReceiptSchema
from app.services.gemini_service import get_gemini_service
from app.services.google_service import get_google_service

# Logging Setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("pelangi_backend")

# Inisialisasi Direktori Temporary Uploads
BASE_DIR = Path(__file__).resolve().parent.parent
TEMP_DIR = BASE_DIR / "temp_uploads"
TEMP_DIR.mkdir(parents=True, exist_ok=True)

# Inisialisasi FastAPI App
app = FastAPI(
    title="Pelangi Frame Receipt Intelligence System API",
    description="Sistem AI Ekstraksi dan Rekonsiliasi Nota Fisik Bengkel Pelangi Frame",
    version="1.0.0"
)

# ---------------------------------------------------------------------------
# Konfigurasi CORS Middleware (Production Ready)
# ---------------------------------------------------------------------------
# Origins default untuk development lokal
allowed_origins: List[str] = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Tambahkan origin kustom dari environment variable (misal domain Vercel / domain kustom)
env_origins = os.getenv("ALLOWED_ORIGINS", "")
if env_origins:
    for origin in env_origins.split(","):
        cleaned = origin.strip()
        if cleaned and cleaned not in allowed_origins:
            allowed_origins.append(cleaned)

# allow_origin_regex mendukung semua subdomain Vercel preview (https://*.vercel.app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SaveReceiptRequest(BaseModel):
    receipt: ReceiptSchema
    temp_file_id: Optional[str] = None
    upload_to_drive: bool = True


@app.get("/")
def root():
    return {
        "app": "Pelangi Frame Receipt Intelligence System",
        "status": "online",
        "docs": "/docs"
    }


@app.get("/api/health")
def health_check():
    gemini_ok = bool(os.getenv("GEMINI_API_KEY"))
    sheets_ok = bool(os.getenv("SPREADSHEET_ID"))
    drive_ok = bool(os.getenv("DRIVE_FOLDER_ID"))
    creds_ok = bool(os.getenv("GOOGLE_CREDENTIALS_BASE64") or os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))

    return {
        "status": "ok",
        "configuration": {
            "gemini_api_key_set": gemini_ok,
            "spreadsheet_id_set": sheets_ok,
            "drive_folder_id_set": drive_ok,
            "google_credentials_set": creds_ok,
        }
    }


@app.get("/api/temp-image/{file_name}")
def get_temp_image(file_name: str):
    """
    Melayani file foto nota yang disimpan sementara untuk keperluan preview di frontend.
    """
    file_path = TEMP_DIR / file_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File foto tidak ditemukan.")
    
    ext = file_path.suffix.lower()
    media_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp"
    }
    return FileResponse(path=str(file_path), media_type=media_types.get(ext, "image/jpeg"))


@app.post("/api/extract")
async def extract_receipt(file: UploadFile = File(...)):
    """
    1. Menerima file foto nota.
    2. Menyimpan foto ke folder temporary.
    3. Mengirimkan byte foto ke Gemini 2.5 Flash / Flash-lite dengan format Pydantic Structured Output.
    4. Mengembalikan schema JSON hasil ekstraksi & URL preview.
    """
    try:
        valid_extensions = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".bmp"]
        original_ext = Path(file.filename or "receipt.jpg").suffix.lower()
        if original_ext not in valid_extensions:
            original_ext = ".jpg"

        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="File yang diunggah kosong.")

        unique_file_id = f"{uuid.uuid4().hex[:10]}_{file.filename or 'nota.jpg'}"
        temp_file_path = TEMP_DIR / unique_file_id
        with open(temp_file_path, "wb") as f:
            f.write(file_bytes)

        gemini_service = get_gemini_service()
        mime_type = file.content_type or "image/jpeg"
        receipt_data: ReceiptSchema = gemini_service.extract_receipt(file_bytes, mime_type=mime_type)

        return {
            "success": True,
            "data": receipt_data.model_dump(),
            "temp_file_id": unique_file_id,
            "preview_url": f"/api/temp-image/{unique_file_id}"
        }

    except Exception as e:
        logger.error(f"Gagal mengekstrak nota: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": f"Gagal mengekstrak nota: {str(e)}"}
        )


@app.post("/api/reconcile")
def reconcile_receipt(receipt: ReceiptSchema):
    """
    Menghitung ulang dan mencocokkan formula keuangan sesuai aturan akuntansi Pelangi Frame.
    """
    try:
        receipt.reconcile()
        return {"success": True, "data": receipt.model_dump()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal rekonsiliasi data: {str(e)}")


@app.post("/api/save")
def save_receipt(payload: SaveReceiptRequest):
    """
    1. Menerima data nota yang telah diverifikasi/diedit kasir di frontend.
    2. Unggah foto asli ke Google Drive (jika ada file temp dan upload_to_drive True).
    3. Simpan data transaksi ke Google Sheets:
       - Transaksi_Header
       - Detail_Barang
       - Buku_Piutang_Reseller (jika relevan)
    4. Kembalikan respons sukses & URL file Drive.
    """
    try:
        receipt = payload.receipt
        receipt.reconcile()

        drive_url = receipt.url_foto_nota

        if payload.upload_to_drive and payload.temp_file_id:
            temp_path = TEMP_DIR / payload.temp_file_id
            if temp_path.exists():
                try:
                    with open(temp_path, "rb") as f:
                        file_bytes = f.read()

                    clean_faktur = (receipt.nomor_faktur or "UNKNOWN").replace("/", "-").replace(" ", "_")
                    clean_nama = (receipt.nama_pelanggan or "Pelanggan").replace(" ", "_")
                    drive_filename = f"Nota_{clean_faktur}_{clean_nama}_{uuid.uuid4().hex[:6]}.jpg"

                    google_service = get_google_service()
                    drive_url = google_service.upload_nota_to_drive(
                        file_bytes=file_bytes,
                        filename=drive_filename,
                        mime_type="image/jpeg"
                    )
                    receipt.url_foto_nota = drive_url
                except Exception as upload_err:
                    logger.error(f"Gagal upload ke Drive tapi melanjutkan penyimpanan Sheets: {upload_err}")
            else:
                logger.warning(f"File temporary tidak ditemukan di {temp_path}")

        google_service = get_google_service()
        save_results = google_service.save_to_sheets(receipt, drive_url=drive_url)

        return {
            "success": True,
            "message": "Transaksi berhasil disimpan ke Google Sheets & Google Drive",
            "drive_url": drive_url,
            "details": save_results
        }

    except Exception as e:
        logger.error(f"Gagal menyimpan transaksi: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": f"Gagal menyimpan transaksi: {str(e)}"}
        )
