from sqlalchemy import Column, Integer, LargeBinary, String, Boolean, ForeignKey, Text, func, TIMESTAMP, DateTime
from sqlalchemy.orm import Relationship, DeclarativeBase, Mapped, mapped_column, relationship, registry
from datetime import datetime
from typing import List
import uuid

mapper_registry = registry()

class Base(DeclarativeBase):
    pass

class Note(Base):
    __tablename__ = "notes"

    __mapper_args__ = {
        "polymorphic_identity": "notes_internal",
    }

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    vault_name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    file_path: Mapped[str] = mapped_column(String, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    
    content: Mapped[str | None] = mapped_column(Text)
    blob_data: Mapped[bytes | None] = mapped_column(LargeBinary)
    mime_type: Mapped[str | None] = mapped_column(String)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow, 
        nullable=False
    )

    links_out: Mapped[List["Link"]] = relationship(
        "Link",
        foreign_keys="Link.source_note_id",
        back_populates="source_note",
        cascade="all, delete-orphan"
    )
    links_in: Mapped[List["Link"]] = relationship(
        "Link",
        foreign_keys="Link.target_note_id",
        back_populates="target_note",
        cascade="all, delete-orphan"
    )
    attachments: Mapped[List["Attachment"]] = relationship(
        "Attachment",
        back_populates="note",
        cascade="all, delete-orphan"
    )

class Link(Base):
    __tablename__ = "links"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    source_note_id: Mapped[str] = mapped_column(String, ForeignKey("notes.id"), nullable=False)
    target_note_id: Mapped[str] = mapped_column(String, ForeignKey("notes.id"), nullable=False)
    link_type: Mapped[str] = mapped_column(String, nullable=False, default="wikilink")

    source_note: Mapped["Note"] = relationship(
        "Note",
        foreign_keys=[source_note_id],
        back_populates="links_out"
    )
    target_note: Mapped["Note"] = relationship(
        "Note",
        foreign_keys=[target_note_id],
        back_populates="links_in"
    )

class Attachment(Base):
    __tablename__ = "attachments"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    note_id: Mapped[str | None] = mapped_column(String, ForeignKey("notes.id"))
    file_name: Mapped[str] = mapped_column(String, nullable=False)
    mime_type: Mapped[str] = mapped_column(String, nullable=False)
    data: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)

    note: Mapped["Note"] = relationship("Note", back_populates="attachments")
