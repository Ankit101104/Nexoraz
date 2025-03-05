from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from db import get_db

db = get_db()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            
            # Check if user exists
            user = db.users.find_one({'_id': current_user_id})
            if not user:
                return jsonify({'error': 'User not found'}), 401
                
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401
    return decorated 