import os
from sqlalchemy import create_engine
from models import Base  # Assumes your models are in models.py

# Get database connection details from environment variables
# These match the 'db' service in your docker-compose.yml
DB_USER = os.getenv("POSTGRES_USER", "box-user")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
DB_NAME = os.getenv("POSTGRES_DB", "box-db")
DB_HOST = os.getenv("DB_HOST", "db") # 'db' is the service name in docker-compose

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:5432/{DB_NAME}"

def run_init():
    print(f"Connecting to database at {DB_HOST}...")
    try:
        engine = create_engine(DATABASE_URL)
        
        # Create all tables defined in models.py
        Base.metadata.create_all(bind=engine, checkfirst=True)
        
        print("Successfully generated database tables!")
    except Exception as e:
        print(f"Error generating database: {e}")

if __name__ == "__main__":
    run_init()
