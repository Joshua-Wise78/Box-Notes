import time
import models
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import notes, links, attachment
from contextlib import asynccontextmanager
from database import engine
from sqlalchemy.exc import OperationalError
from pydantic import BaseModel

@asynccontextmanager
async def lifespan(app: FastAPI):
    retries = 0
    max_retries = 10
    
    while retries < max_retries:
        try:
            print(f"Attempting to connect to database (Try {retries + 1})...")
            # Try to create tables
            models.Base.metadata.create_all(bind=engine)
            print("--- Database Connected & Tables Created! ---")
            break
        except OperationalError as e:
            retries += 1
            print(f"Database not ready yet. Waiting 3 seconds... (Error: {e})")
            time.sleep(3)
    
    if retries == max_retries:
        print("Could not connect to database after multiple attempts.")
    
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes.router, prefix="/notes", tags=["notes"])
app.include_router(links.router, prefix="/links", tags=["links"])
app.include_router(attachment.router, prefix="/attachments", tags=["attachments"])

class VaultCreate(BaseModel):
    name: str

@app.post("/vaults/")
def create_vault(vault: VaultCreate):
    vault_root = os.getenv("VAULT_ROOT", "/data/vaults")
    vault_path = os.path.join(vault_root, vault.name)
    
    if os.path.exists(vault_path):
        raise HTTPException(status_code=400, detail="Vault already exists")
    
    try:
        os.makedirs(vault_path)
        return {"message": f"Vault '{vault.name}' created", "path": vault_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "online", "message": "Obsidian Backend is running"}

@app.get("/vaults")
def get_vaults():
    vault_root = os.getenv("VAULT_ROOT", "/data/vaults")
    try:
        if not os.path.exists(vault_root):
            return {"vaults": [], "warning": "Vault root not found"}
            
        vaults = [d for d in os.listdir(vault_root) if os.path.isdir(os.path.join(vault_root, d))]
        return {"vaults": vaults}
    except Exception as e:
        return {"error": str(e)}
