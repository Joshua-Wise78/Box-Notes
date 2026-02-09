from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class LinkBase(BaseModel):
    target_note_id: str
    link_type: str = "wikilink"

class LinkCreate(LinkBase):
    source_note_id: str

class Link(LinkBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    source_note_id: str

class NoteBase(BaseModel):
    title: str
    vault_name: str
    file_path: str
    content: Optional[str] = None
    mime_type: Optional[str] = "text/markdown"

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    file_path: Optional[str] = None
    mime_type: Optional[str] = None

class Note(NoteBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime
    updated_at: datetime
    links_out: List[Link] = []
    links_in: List[Link] = []

class GraphNode(BaseModel):
    id: str
    title: str
    vault_name: str

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    link_type: str

class GraphData(BaseModel):
    nodes: List[GraphNode]
    links: List[GraphEdge]
