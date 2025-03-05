from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

class DatabaseConfig:
    def __init__(self):
        self.client = None
        self.db = None
        self.MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        self.DB_NAME = os.getenv("DB_NAME", "knowledge_graph_db")

    async def connect_to_database(self):
        try:
            self.client = AsyncIOMotorClient(
                self.MONGODB_URL,
                server_api=ServerApi('1')
            )
            self.db = self.client[self.DB_NAME]
            print("Connected to MongoDB!")
            # Verify the connection
            await self.client.admin.command('ping')
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            raise e

    async def close_database_connection(self):
        if self.client:
            self.client.close()
            print("MongoDB connection closed.")

# Create a database instance
db = DatabaseConfig()