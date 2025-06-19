from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from db import get_db

graph_routes = Blueprint('graph_routes', __name__)
db = get_db()

@graph_routes.route('/api/graphs', methods=['POST'])
@jwt_required()
def create_graph():
    try:
        current_user_id = get_jwt_identity()
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        
        # Check if user has reached their daily limit
        if not user.get('is_premium', False):
            graphs_today = user.get('graphs_created_today', 0)
            current_date = datetime.utcnow()
            last_graph_date = user.get('last_graph_date')

            # Reset counter if it's a new day
            if not last_graph_date or last_graph_date.date() != current_date.date():
                graphs_today = 0
            
            if graphs_today >= 10:  # Free user limit
                return jsonify({
                    'error': 'Daily graph limit reached. Please upgrade to premium for unlimited graphs.'
                }), 403

        data = request.json
        title = data.get('title')
        description = data.get('description')

        if not title or not description:
            return jsonify({'error': 'Title and description are required'}), 400

        # Create the graph
        graph = {
            'title': title,
            'description': description,
            'user_id': current_user_id,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'type': data.get('type', 'concept'),
            'nodes': data.get('nodes', []),
            'edges': data.get('edges', [])
        }

        # Insert the graph
        result = db.graphs.insert_one(graph)
        graph['_id'] = str(result.inserted_id)

        # Update user's graph count
        current_date = datetime.utcnow()
        
        # If it's a new day, reset the counter
        if not user.get('last_graph_date') or user['last_graph_date'].date() != current_date.date():
            update_result = db.users.update_one(
                {'_id': ObjectId(current_user_id)},
                {
                    '$set': {
                        'graphs_created_today': 1,
                        'last_graph_date': current_date
                    }
                }
            )
        else:
            # Increment the counter
            update_result = db.users.update_one(
                {'_id': ObjectId(current_user_id)},
                {
                    '$inc': {'graphs_created_today': 1},
                    '$set': {'last_graph_date': current_date}
                }
            )

        # Return updated graph count along with the graph
        updated_user = db.users.find_one({'_id': ObjectId(current_user_id)})
        graph['graphs_created_today'] = updated_user.get('graphs_created_today', 0)

        return jsonify(graph), 201

    except Exception as e:
        print(f"Error creating graph: {str(e)}")
        return jsonify({'error': str(e)}), 500

@graph_routes.route('/api/graphs', methods=['GET'])
@jwt_required()
def get_graphs():
    try:
        current_user_id = get_jwt_identity()
        graphs = list(db.graphs.find({'user_id': current_user_id}))
        for graph in graphs:
            graph['_id'] = str(graph['_id'])
        return jsonify({'graphs': graphs})
    except Exception as e:
        return jsonify({'graphs': [], 'error': str(e)}), 500

@graph_routes.route('/api/graphs/<graph_id>', methods=['GET'])
@jwt_required()
def get_graph(graph_id):
    try:
        current_user_id = get_jwt_identity()
        graph = db.graphs.find_one({
            '_id': ObjectId(graph_id),
            'user_id': current_user_id
        })
        if graph:
            graph['_id'] = str(graph['_id'])
            return jsonify(graph)
        return jsonify({'error': 'Graph not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@graph_routes.route('/api/graphs/<graph_id>', methods=['DELETE'])
@jwt_required()
def delete_graph(graph_id):
    try:
        current_user_id = get_jwt_identity()
        result = db.graphs.delete_one({
            '_id': ObjectId(graph_id),
            'user_id': current_user_id
        })
        if result.deleted_count:
            return jsonify({'message': 'Graph deleted successfully'}), 200
        return jsonify({'error': 'Graph not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500 