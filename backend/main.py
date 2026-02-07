from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from typing import List
from pydantic import BaseModel
from datetime import datetime
import uuid
import os
from models import Notes, Link, Attachment

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_USER = os.getenv("POSTGRES_USER", "box-user")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
DB_NAME = os.getenv("POSTGRES_DB", "box-db")
DB_HOST = os.getenv("DB_HOST", "db")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:5432/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

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

@app.get("/notes", response_model=List[NoteResponse])
def get_notes(vault_name: str | None = None, db: Session = Depends(get_db)):
    """Get all notes, optionally filtered by vault_name"""
    query = db.query(Notes)
    
    if vault_name:
        query = query.filter(Notes.vault_name == vault_name)
    
    notes = query.all()
    return notes

@app.get("/notes/{note_id}", response_model=NoteResponse)
def get_note(note_id: str, db: Session = Depends(get_db)):
    """Get a specific note by ID"""
    note = db.query(Notes).filter(Notes.id == note_id).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return note

@app.post("/notes", response_model=NoteResponse, status_code=201)
def create_note(note_data: NoteCreate, db: Session = Depends(get_db)):
    """Create a new note"""
    new_note = Notes(
        id=str(uuid.uuid4()),
        vault_name=note_data.vault_name,
        file_path=note_data.file_path,
        title=note_data.title,
        content=note_data.content,
        blob_data=note_data.blob_data,
        mime_type=note_data.mime_type,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    
    return new_note