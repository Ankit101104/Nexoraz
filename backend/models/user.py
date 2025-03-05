from datetime import datetime
from bson import ObjectId
from db import get_db

def create_user_document(username, email, hashed_password):
    return {
        'username': username,
        'email': email,
        'password': hashed_password,
        'is_premium': False,  # Explicitly set to False for new users
        'graphs_created_today': 0,
        'last_graph_date': datetime.utcnow(),
        'created_at': datetime.utcnow()
    }

class User:
    def __init__(self, email, password_hash, name=None, is_premium=False):
        self.email = email
        self.password_hash = password_hash
        self.name = name
        self.is_premium = is_premium
        self.created_at = datetime.utcnow()
        self.graphs_created_today = 0
        self.last_graph_date = None

    @staticmethod
    def update_premium_status(user_id, is_premium):
        db = get_db()
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$set': {
                    'is_premium': is_premium,
                    'updated_at': datetime.utcnow()
                }
            }
        )
        return True 