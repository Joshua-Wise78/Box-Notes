import os
from faker import Faker
import random
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Notes, Link, Attachment
import uuid

fake = Faker()

# Database connection
DB_USER = os.getenv("POSTGRES_USER", "box-user")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
DB_NAME = os.getenv("POSTGRES_DB", "box-db")
DB_HOST = os.getenv("DB_HOST", "db")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:5432/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def generate_markdown_content():
    """Generate random markdown content"""
    content = f"# {fake.catch_phrase()}\n\n"
    
    # Add some paragraphs
    for _ in range(random.randint(2, 5)):
        content += f"{fake.paragraph(nb_sentences=random.randint(3, 7))}\n\n"
    
    # Maybe add a list
    if random.choice([True, False]):
        content += "## Key Points\n\n"
        for _ in range(random.randint(3, 6)):
            content += f"- {fake.sentence()}\n"
        content += "\n"
    
    # Maybe add a code block
    if random.choice([True, False]):
        content += "```python\n"
        content += f"def {fake.word()}():\n"
        content += f"    return '{fake.word()}'\n"
        content += "```\n\n"
    
    # Add some bold/italic text
    content += f"**{fake.sentence()}** and *{fake.sentence()}*\n\n"
    
    return content

def create_test_notes(num_notes=20, vault_name="test-vault"):
    """Create test notes in the database"""
    session = SessionLocal()
    
    try:
        created_notes = []
        
        print(f"Creating {num_notes} test notes...")
        
        for i in range(num_notes):
            note = Notes(
                id=str(uuid.uuid4()),
                vault_name=vault_name,
                file_path=f"/notes/{fake.file_name(extension='md')}",
                title=fake.catch_phrase(),
                content=generate_markdown_content(),
                created_at=fake.date_time_between(start_date='-30d', end_date='now'),
                updated_at=datetime.utcnow()
            )
            session.add(note)
            created_notes.append(note)
            
            if (i + 1) % 5 == 0:
                print(f"  Created {i + 1} notes...")
        
        session.commit()
        print(f"✓ Successfully created {num_notes} notes!")
        
        # Create some random links between notes
        print("\nCreating links between notes...")
        num_links = random.randint(10, 30)
        
        for _ in range(num_links):
            source = random.choice(created_notes)
            target = random.choice(created_notes)
            
            if source.id != target.id:  # Don't link to self
                link = Link(
                    id=str(uuid.uuid4()),
                    source_note_id=source.id,
                    target_note_id=target.id,
                    link_type=random.choice(["wikilink", "embed", None])
                )
                session.add(link)
        
        session.commit()
        print(f"✓ Successfully created {num_links} links!")
        
    except Exception as e:
        print(f"Error: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    create_test_notes(num_notes=20, vault_name="test-vault")