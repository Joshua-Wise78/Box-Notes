from sqlalchemy import Column, Integer, LargeBinary, String, Boolean, ForeignKey, Text, func, TIMESTAMP, DateTime
from sqlalchemy.orm import Relationship, DeclarativeBase, Mapped, mapped_column, relationship
from datetime import datetime, date
from typing import List
import uuid

class Base(DeclarativeBase):
    pass

class Notes(Base):
    __tablename__ = "notes"

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

class Link(Base):
    __tablename__ = "links"
