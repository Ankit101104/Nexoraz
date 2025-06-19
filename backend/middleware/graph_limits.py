from datetime import datetime
from functools import wraps
from flask import jsonify, current_app
from flask_jwt_extended import get_jwt_identity
from bson import ObjectId

FREE_PLAN_DAILY_LIMIT = 10

def check_graph_limit():
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Get db from app context
                db = current_app.config['DATABASE']
                
                current_user_id = get_jwt_identity()
                user = db.users.find_one({'_id': ObjectId(current_user_id)})
                
                if not user:
                    return jsonify({'error': 'User not found'}), 404

                # Reset counter if it's a new day
                today = datetime.utcnow().date()
                last_graph_date = user.get('last_graph_date', datetime.min).date()
                
                if today > last_graph_date:
                    db.users.update_one(
                        {'_id': ObjectId(current_user_id)},
                        {
                            '$set': {
                                'graphs_created_today': 0,
                                'last_graph_date': datetime.utcnow()
                            }
                        }
                    )
                    user['graphs_created_today'] = 0

                # Check limits for free users
                if not user.get('is_premium', False):
                    if user.get('graphs_created_today', 0) >= FREE_PLAN_DAILY_LIMIT:
                        return jsonify({
                            'error': 'Daily graph limit reached',
                            'message': 'You have reached your daily limit of 10 graphs. Upgrade to Premium for unlimited graphs!',
                            'limit_reached': True
                        }), 403

                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        return decorated_function
    return decorator 