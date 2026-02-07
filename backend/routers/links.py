from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database

router = APIRouter(
    prefix="/links",
    tags=["links"]
)

@router.post("/", response_model=schemas.Link)
def create_link(link: schemas.LinkCreate, db: Session = Depends(database.get_db)):
    source_exists = db.query(models.Note).filter(models.Note.id == link.source_note_id).first()
    target_exists = db.query(models.Note).filter(models.Note.id == link.target_note_id).first()

    if not source_exists or not target_exists:
        raise HTTPException(status_code=400, detail="Source or Target note does not exist.")

    db_link = models.Link(**link.model_dump())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

@router.delete("/{link_id}")
def delete_link(link_id: str, db: Session = Depends(database.get_db)):
    db_link = db.query(models.Link).filter(models.Link.id == link_id).first()
    if db_link is None:
        raise HTTPException(status_code=404, detail="Link not found 404.")

    db.delete(db_link)
    db.commit()
    return {"message": "Link removed"}
