from pymongo import MongoClient
import os
import certifi
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection URI
uri = "mongodb+srv://rohitkumarprajapat0:graph123%40@graph.4so8e.mongodb.net/?retryWrites=true&w=majority"

# Create MongoDB client
client = MongoClient(
    uri,
    tlsCAFile=certifi.where()
)

# Get database instance
db = client['knowledge_graph_db']

def get_db():
    return db 