from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime, date


class NoteBase(BaseModel):
    title: str
    vault_name: str
    file_path: str
    content: str | None = None
    mime_type: str | None = "text/markdown"

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    file_path: str | None = None
    mime_type: str | None = None
    

class Note(NoteBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime
    links_out: List["Link"] = []
    links_in: List["Link"] = []

class LinkBase(BaseModel):
    target_note_id: str
    link_type: str = "wikilink"

class LinkCreate(LinkBase):
    source_note_id: str

class Link(LinkBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    source_note_id: str

class NoteBlob(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    blob_data: bytes | None
    mime_type: str | None

Note.model_rebuild()
