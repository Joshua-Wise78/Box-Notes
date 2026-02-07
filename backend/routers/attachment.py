from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import Response
from sqlalchemy.orm import Session
import models, database
import uuid

router = APIRouter()

@router.post("/{note_id}")
async def upload_attachment(
    note_id: str, 
    file: UploadFile = File(...), 
    db: Session = Depends(database.get_db)
):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    file_content = await file.read()
    
    db_attachment = models.Attachment(
        id=str(uuid.uuid4()),
        note_id=note_id,
        file_name=file.filename,
        mime_type=file.content_type,
        data=file_content
    )
    
    db.add(db_attachment)
    db.commit()
    return {"id": db_attachment.id, "filename": file.filename}

@router.get("/{attachment_id}")
def get_attachment(attachment_id: str, db: Session = Depends(database.get_db)):
    attachment = db.query(models.Attachment).filter(models.Attachment.id == attachment_id).first()
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")
    
    return Response(content=attachment.data, media_type=attachment.mime_type)
