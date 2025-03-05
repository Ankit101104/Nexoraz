from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import bcrypt
from flask_jwt_extended import create_access_token
from models.user import create_user_document
from db import get_db

auth_routes = Blueprint('auth_routes', __name__)
db = get_db()

@auth_routes.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        users = db.users
        
        # Check if user already exists
        if users.find_one({'email': data['email']}):
            return jsonify({'error': 'User already exists'}), 400
        
        # Hash password
        hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Create user document
        user = create_user_document(
            username=data['username'],
            email=data['email'],
            hashed_password=hashed
        )
        
        # Insert user into database
        result = users.insert_one(user)
        user['_id'] = str(result.inserted_id)
        
        # Create access token
        access_token = create_access_token(identity=str(result.inserted_id))
        
        return jsonify({
            'message': 'User registered successfully',
            'token': access_token,
            'user': {
                'id': str(result.inserted_id),
                'username': user['username'],
                'email': user['email']
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_routes.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        user = db.users.find_one({'email': data['email']})
        
        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
            access_token = create_access_token(
                identity=str(user['_id']),
                expires_delta=timedelta(days=1)
            )
            
            return jsonify({
                'token': access_token,
                'user': {
                    'id': str(user['_id']),
                    'username': user['username'],
                    'email': user['email'],
                    'is_premium': user.get('is_premium', False)
                }
            })
            
        return jsonify({'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 