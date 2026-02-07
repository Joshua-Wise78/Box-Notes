from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database

router = APIRouter(
    prefix="/notes",
    tags=["notes"]
)

@router.get("/", response_model=List[schemas.Note])
def read_notes(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    notes = db.query(models.Note).offset(skip).limit(limit).all()
    return notes

@router.post("/", response_model=schemas.Note)
def create_note(note: schemas.NoteCreate, db: Session = Depends(database.get_db)):
    db_note = models.Note(**note.model_dump())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@router.patch("/{note_id}", response_model=schemas.Note)
def update_note(note_id: str, note_update: schemas.NoteUpdate, db: Session = Depends(database.get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Not is not found 404.")

    update_data = note_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_note, key, value)

    db.commit()
    db.refresh(db_note)
    return db_note

@router.delete("/{note_id}")
def delete_note(note_id: str, db: Session = Depends(database.get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Not is not found 404.")

    db.delete(db_note)
    db.commit()
    return {"Message": "Note has been deleted"}

@router.get("/graph", response_model=schemas.GraphData)
def get_graph_data(db: Session = Depends(database.get_db)):
    all_notes = db.query(models.Note).all()
    all_links = db.query(models.Link).all()

    nodes = [
        schemas.GraphNode(id=n.id, title=n.title, vault_name=n.vault_name)
        for n in all_notes
    ]

    links = [
        schemas.GraphEdge(
            id=l.id,
            source=l.source_note_id,
            target=l.target_note_id,
            link_type=l.link_type
        ) for l in all_links
    ]

    return schemas.GraphData(nodes=nodes, links=links)

