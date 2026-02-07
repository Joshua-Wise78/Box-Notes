import os
from sqlalchemy import create_engine, text
from models import Base

DB_USER = os.getenv("POSTGRES_USER", "box-user")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
DB_NAME = os.getenv("POSTGRES_DB", "box-db")
DB_HOST = os.getenv("DB_HOST", "db")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:5432/{DB_NAME}"

def reset_database():
    print(f"Connecting to {DB_HOST} to reset database '{DB_NAME}'...")
    engine = create_engine(DATABASE_URL)
    
    try:
        print("Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        
        print("Recreating tables from models.py...")
        Base.metadata.create_all(bind=engine)
        
        print("Database reset complete. Your schema is now up to date.")
    except Exception as e:
        print(f"Error resetting database: {e}")

if __name__ == "__main__":
    confirm = input("This will DELETE ALL DATA in the database. Are you sure? (y/N): ")
    if confirm.lower() == 'y':
        reset_database()
    else:
        print("Reset aborted.")
