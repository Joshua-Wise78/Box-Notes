import uuid
import random
from datetime import datetime
from faker import Faker
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Note, Link

fake = Faker()

def create_note_obj(title, vault, folder):
    return Note(
        id=str(uuid.uuid4()),
        title=title,
        vault_name=vault,
        file_path=f"/{folder}/{title.lower().replace(' ', '_')}.md",
        content=f"# {title}\n\n{fake.paragraph(nb_sentences=5)}",
        mime_type="text/markdown",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

def seed_notes():
    db: Session = SessionLocal()
    
    try:
        print("Cleaning old data for a fresh graph...")
        db.query(Link).delete()
        db.query(Note).delete()
        
        print("Building 'University' cluster...")
        uni_root = create_note_obj("CS Senior Project", "University", "Thesis")
        db.add(uni_root)
        
        uni_notes = [
            create_note_obj("Database Schema", "University", "Thesis"),
            create_note_obj("API Documentation", "University", "Thesis"),
            create_note_obj("Frontend Design", "University", "Thesis"),
            create_note_obj("User Authentication", "University", "Thesis")
        ]
        for n in uni_notes:
            db.add(n)
            db.add(Link(id=str(uuid.uuid4()), source_note_id=uni_root.id, target_note_id=n.id, link_type="parent"))
            db.add(Link(id=str(uuid.uuid4()), source_note_id=n.id, target_note_id=uni_notes[0].id, link_type="reference"))

        print("Building 'Personal' cluster...")
        pkb_root = create_note_obj("Daily Journal", "Personal", "Logs")
        db.add(pkb_root)
        
        for i in range(5):
            entry = create_note_obj(f"Log {fake.date()}", "Personal", "Logs")
            db.add(entry)
            db.add(Link(id=str(uuid.uuid4()), source_note_id=pkb_root.id, target_note_id=entry.id, link_type="wikilink"))

        print("Adding random notes...")
        random_notes = []
        for _ in range(15):
            n = create_note_obj(fake.catch_phrase(), "Archive", "Random")
            db.add(n)
            random_notes.append(n)
        
        db.flush()

        for _ in range(10):
            s, t = random.sample(random_notes, 2)
            db.add(Link(id=str(uuid.uuid4()), source_note_id=s.id, target_note_id=t.id, link_type="wikilink"))

        db.commit()
        print("Seeding complete! Your graph now has structure.")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_notes()
