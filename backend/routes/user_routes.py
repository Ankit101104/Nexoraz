from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from db import get_db

user_routes = Blueprint('user_routes', __name__)
db = get_db()

@user_routes.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        current_user_id = get_jwt_identity()
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email'],
            'is_premium': user.get('is_premium', False)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_routes.route('/api/user/graph-usage', methods=['GET'])
@jwt_required()
def get_graph_usage():
    try:
        current_user_id = get_jwt_identity()
        try:
            user = db.users.find_one({'_id': ObjectId(current_user_id)})
        except Exception as db_error:
            print(f"Database error: {str(db_error)}")
            return jsonify({
                'graphs_created_today': 0,
                'daily_limit': 10,
                'is_premium': False,
                'error': f"Database error: {str(db_error)}"
            }), 500
        
        if not user:
            return jsonify({
                'graphs_created_today': 0,
                'daily_limit': 10,
                'is_premium': False
            })
            
        # Reset daily count if it's a new day
        last_graph_date = user.get('last_graph_date')
        current_date = datetime.utcnow()
        
        graphs_created_today = user.get('graphs_created_today', 0)
        is_premium = user.get('is_premium', False)
        
        if (not last_graph_date or 
            last_graph_date.date() != current_date.date()):
            try:
                db.users.update_one(
                    {'_id': ObjectId(current_user_id)},
                    {
                        '$set': {
                            'graphs_created_today': 0,
                            'last_graph_date': current_date
                        }
                    }
                )
                graphs_created_today = 0
            except Exception as update_error:
                print(f"Error updating graph count: {str(update_error)}")
            
        return jsonify({
            'graphs_created_today': graphs_created_today,
            'daily_limit': float('inf') if is_premium else 10,
            'is_premium': is_premium
        })
        
    except Exception as e:
        print(f"Error in get_graph_usage: {str(e)}")
        return jsonify({
            'graphs_created_today': 0,
            'daily_limit': 10,
            'is_premium': False,
            'error': str(e)
        }), 500

@user_routes.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    try:
        current_user_id = get_jwt_identity()
        data = request.json
        
        # Find user
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        # Update fields
        update_data = {}
        if 'username' in data:
            update_data['username'] = data['username']
        if 'email' in data:
            update_data['email'] = data['email']
            
        if update_data:
            db.users.update_one(
                {'_id': ObjectId(current_user_id)},
                {'$set': update_data}
            )
            
        # Get updated user
        updated_user = db.users.find_one({'_id': ObjectId(current_user_id)})
        return jsonify({
            'id': str(updated_user['_id']),
            'username': updated_user['username'],
            'email': updated_user['email'],
            'is_premium': updated_user.get('is_premium', False)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500 