from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "message": "Obsidian Backend is running"}

@app.get("/vaults")
def get_vaults():
    vault_root = os.getenv("VAULT_ROOT", "/data/vaults")
    try:
        vaults = [d for d in os.listdir(vault_root) if os.path.isdir(os.path.join(vault_root, d))]
        return {"vaults": vaults}
    except Exception as e:
        return {"error": str(e)}
