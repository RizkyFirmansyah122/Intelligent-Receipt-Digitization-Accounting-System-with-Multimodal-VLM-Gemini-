import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

for m in ["gemini-2.5-flash-lite", "gemini-flash-lite-latest", "gemini-2.5-flash"]:
    try:
        print(f"Mencoba {m}...")
        res = client.models.generate_content(
            model=m,
            contents="Tes satu kata: OK"
        )
        print(f" Berhasil dengan {m}: {res.text.strip()}")
        break
    except Exception as e:
        print(f" Gagal {m}: {e}\n")