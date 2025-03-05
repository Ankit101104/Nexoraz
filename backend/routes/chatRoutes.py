from flask import Blueprint, request, jsonify
import google.generativeai as genai
from flask_jwt_extended import jwt_required, current_user, get_jwt_identity
import logging
import os
import razorpay
from flask import current_app
from middleware.graph_limits import check_graph_limit
from datetime import datetime
from bson import ObjectId
from models.user import create_user_document
import json

logger = logging.getLogger(__name__)
chat_bp = Blueprint('chat', __name__)

# Configure Gemini
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(os.getenv('RAZORPAY_KEY_ID'), os.getenv('RAZORPAY_KEY_SECRET'))
)

# Define the free plan limit
FREE_PLAN_DAILY_LIMIT = 10

SYSTEM_PROMPT = """You are NEXORAZ Assistant, an AI helper for the NEXORAZ knowledge graph platform. 
NEXORAZ was founded by Mr. Rohit Prajapat with the vision of revolutionizing knowledge visualization and management.

Company Information:
- Founder & CEO: Mr. Rohit Prajapat
- Founded: 2023
- Location: Vadodara, India
- Website: nexoraz.com
- Contact: contactnexoraz@gmail.com

Key features to recommend:
1. Graph Creation and Management
2. Node Types and Relationships
3. AI-Powered Analysis
4. Visualization Options
5. Collaboration Tools

Domain-Specific Recommendations:
- Academic: Research mapping, citation networks
- Business: Process flows, org structures
- Technical: System architectures, dependencies
- Personal: Knowledge management, learning maps

When making recommendations:
- Be specific to knowledge graph use cases
- Suggest practical applications
- Provide step-by-step guidance
- Focus on user's domain/context
- Maintain a helpful and friendly tone
- Include examples and use cases
- Suggest optimal layouts and visualizations
- Recommend relevant templates

Current user context: {user_context}
"""

ANALYSIS_PROMPT = """Analyze this knowledge graph in detail:
Graph Overview:
- Nodes: {node_count}
- Edges: {edge_count}
- Type: {graph_type}
- Domain: {domain}

Provide comprehensive analysis covering:
1. Structure Analysis:
   - Connectivity patterns
   - Central nodes
   - Clustering coefficient
   - Path analysis

2. Quality Assessment:
   - Completeness
   - Consistency
   - Balance
   - Clarity

3. Improvement Suggestions:
   - Missing connections
   - Node grouping
   - Relationship types
   - Additional context

4. Visualization Recommendations:
   - Layout optimization
   - Color schemes
   - Node sizing
   - Edge styling

5. Domain-Specific Insights:
   - Best practices
   - Common patterns
   - Industry standards
   - Similar examples

Provide actionable recommendations with clear steps for implementation.
"""

# Add to predefinedAnswers in ChatBot.js
COMPANY_INFO = {
    'about company': "NEXORAZ is a cutting-edge knowledge graph platform founded by Mr. Rohit Prajapat. We're dedicated to revolutionizing how people visualize and manage complex information.",
    
    'founder': "NEXORAZ was founded by Mr. Rohit Prajapat, a visionary in knowledge graph technology and AI integration. He leads our mission to transform information visualization.",
    
    'contact founder': "You can reach out to Mr. Rohit Prajapat through:\nEmail: contactnexoraz@gmail.com\nLinkedIn: linkedin.com/in/rohit-prajapat-878bb2255\nTwitter: @nexoraz_",
    
    'company mission': "Under Mr. Rohit Prajapat's leadership, NEXORAZ aims to revolutionize knowledge management through innovative graph visualization and AI-powered insights.",
    
    'company vision': "Our founder, Mr. Rohit Prajapat, envisions NEXORAZ as the future of knowledge visualization, where complex information becomes easily understandable and actionable.",
}

@chat_bp.route('/api/chat', methods=['POST'])
@jwt_required()
def chat():
    try:
        message = request.json.get('message')
        if not message:
            return jsonify({'error': 'Message is required'}), 400

        # Generate response
        response = model.generate_content(message)
        
        return jsonify({
            'reply': response.text
        })

    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/api/chat/recommend', methods=['POST'])
@jwt_required()
def get_recommendations():
    try:
        data = request.json
        user_query = data.get('query', '')
        user_context = data.get('context', {})
        
        # Format the context for the AI
        context_str = f"""
        User's current activity: {user_context.get('activity', 'browsing')}
        Graph type: {user_context.get('graphType', 'general')}
        Domain: {user_context.get('domain', 'general')}
        Experience level: {user_context.get('experience', 'beginner')}
        """
        
        # Prepare the prompt
        prompt = SYSTEM_PROMPT.format(user_context=context_str) + f"\n\nUser query: {user_query}\n\nProvide relevant recommendations:"
        
        # Generate recommendations
        response = model.generate_content(prompt)
        
        # Process and format the response
        recommendations = {
            'general': response.text,
            'specific_features': [
                'Graph visualization options',
                'Node type suggestions',
                'Relationship patterns',
                'Analysis tools'
            ],
            'next_steps': [
                'Create a sample graph',
                'Explore templates',
                'Try AI analysis',
                'Share with team'
            ]
        }
        
        return jsonify(recommendations)

    except Exception as e:
        logger.error(f"Recommendation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/api/chat/analyze', methods=['POST'])
@jwt_required()
def analyze_graph():
    try:
        data = request.json
        graph_data = data.get('graph', {})
        
        # Enhanced analysis with more context
        analysis_prompt = ANALYSIS_PROMPT.format(
            node_count=len(graph_data.get('nodes', [])),
            edge_count=len(graph_data.get('edges', [])),
            graph_type=graph_data.get('type', 'general'),
            domain=graph_data.get('domain', 'general')
        )
        
        response = model.generate_content(analysis_prompt)
        
        # Enhanced response with structured insights
        return jsonify({
            'analysis': response.text,
            'metrics': {
                'density': calculate_graph_density(graph_data),
                'centrality': find_central_nodes(graph_data),
                'clusters': identify_clusters(graph_data)
            },
            'suggestions': {
                'structure': [
                    'Consider adding more cross-connections',
                    'Group related nodes together',
                    'Balance node distribution'
                ],
                'organization': [
                    'Create hierarchical structure',
                    'Add category nodes',
                    'Label relationship types'
                ],
                'visualization': [
                    'Use hierarchical layout',
                    'Color-code node types',
                    'Size nodes by importance'
                ],
                'expansion': [
                    'Add detailed descriptions',
                    'Include reference links',
                    'Connect to related graphs'
                ]
            },
            'templates': recommend_templates(graph_data),
            'best_practices': get_domain_best_practices(graph_data.get('domain'))
        })

    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def calculate_graph_density(graph_data):
    nodes = len(graph_data.get('nodes', []))
    edges = len(graph_data.get('edges', []))
    if nodes <= 1:
        return 0
    return (2.0 * edges) / (nodes * (nodes - 1))

def find_central_nodes(graph_data):
    # Implement centrality analysis
    nodes = graph_data.get('nodes', [])
    edges = graph_data.get('edges', [])
    # Add your centrality calculation logic here
    return [node for node in nodes if is_central(node, edges)]

def identify_clusters(graph_data):
    # Implement clustering analysis
    nodes = graph_data.get('nodes', [])
    edges = graph_data.get('edges', [])
    # Add your clustering logic here
    return get_node_clusters(nodes, edges)

def recommend_templates(graph_data):
    domain = graph_data.get('domain', 'general')
    type = graph_data.get('type', 'general')
    
    templates = {
        'academic': [
            'Research Map',
            'Literature Review',
            'Concept Hierarchy'
        ],
        'business': [
            'Process Flow',
            'Organization Chart',
            'Project Dependencies'
        ],
        'technical': [
            'System Architecture',
            'Code Dependencies',
            'API Relationships'
        ],
        'personal': [
            'Knowledge Map',
            'Learning Path',
            'Goal Tracker'
        ]
    }
    
    return templates.get(domain, templates['general'])

def get_domain_best_practices(domain):
    best_practices = {
        'academic': [
            'Include citation links',
            'Use hierarchical structure',
            'Add methodology nodes'
        ],
        'business': [
            'Clear process flows',
            'Role-based access',
            'Timeline integration'
        ],
        'technical': [
            'Version control',
            'Component isolation',
            'Error handling'
        ],
        'personal': [
            'Regular updates',
            'Priority marking',
            'Progress tracking'
        ]
    }
    
    return best_practices.get(domain, [
        'Clear node labels',
        'Consistent relationships',
        'Regular backups'
    ])

def is_central(node, edges):
    # Implement centrality check
    connections = sum(1 for edge in edges if edge['source'] == node['id'] or edge['target'] == node['id'])
    return connections > len(edges) / len(set(edge['source'] for edge in edges))

def get_node_clusters(nodes, edges):
    # Implement basic clustering
    clusters = {}
    for node in nodes:
        connected_nodes = [
            edge['target'] if edge['source'] == node['id'] else edge['source']
            for edge in edges
            if edge['source'] == node['id'] or edge['target'] == node['id']
        ]
        if connected_nodes:
            cluster_id = min(connected_nodes)
            clusters[cluster_id] = clusters.get(cluster_id, []) + [node['id']]
    return clusters

@chat_bp.route('/api/graphs', methods=['POST'])
@jwt_required()
@check_graph_limit()
def create_graph():
    try:
        current_user_id = get_jwt_identity()
        data = request.json

        # Validate required fields
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400

        # Create new graph document
        new_graph = {
            'title': data['title'],
            'description': data.get('description', ''),
            'type': data.get('type', 'concept'),
            'nodes': data.get('nodes', []),
            'edges': data.get('edges', []),
            'user_id': ObjectId(current_user_id),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        # Insert into database
        result = db.graphs.insert_one(new_graph)
        
        # Update the user's graph count
        db.users.update_one(
            {'_id': ObjectId(current_user_id)},
            {
                '$inc': {'graphs_created_today': 1},
                '$set': {'last_graph_date': datetime.utcnow()}
            }
        )

        # Return the created graph
        new_graph['_id'] = str(result.inserted_id)
        return jsonify(new_graph), 201

    except Exception as e:
        logger.error(f"Error creating graph: {e}")
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/api/user/graph-usage', methods=['GET'])
@jwt_required()
def get_graph_usage():
    try:
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

        return jsonify({
            'graphs_created_today': user.get('graphs_created_today', 0),
            'daily_limit': None if user.get('is_premium', False) else FREE_PLAN_DAILY_LIMIT,
            'is_premium': user.get('is_premium', False)
        })

    except Exception as e:
        logger.error(f"Error fetching graph usage: {e}")
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/api/create-order', methods=['POST'])
@jwt_required()
def create_order():
    try:
        data = request.json
        amount = data.get('amount')
        
        # Create Razorpay Order
        order_data = {
            'amount': amount * 100,  # Convert to paise
            'currency': 'INR',
            'receipt': f'order_rcptid_{str(current_user.id)}',
            'payment_capture': 1  # Auto capture payment
        }
        
        # Create order
        order = razorpay_client.order.create(data=order_data)
        
        if not order:
            return jsonify({'error': 'Failed to create order'}), 500

        return jsonify({
            'id': order['id'],
            'amount': order['amount'],
            'currency': order['currency']
        })
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/api/verify-payment', methods=['POST'])
@jwt_required()
def verify_payment():
    try:
        data = request.json
        current_user_id = get_jwt_identity()
        
        # Verify payment signature
        params_dict = {
            'razorpay_payment_id': data.get('razorpay_payment_id'),
            'razorpay_order_id': data.get('razorpay_order_id'),
            'razorpay_signature': data.get('razorpay_signature')
        }
        
        # Verify signature
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # Update user's premium status
        db.users.update_one(
            {'_id': ObjectId(current_user_id)},
            {'$set': {'is_premium': True}}
        )
        
        return jsonify({'success': True})
    except Exception as e:
        logger.error(f"Payment verification error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        users = db.users
        
        # Check if user already exists
        if users.find_one({'email': data['email']}):
            return jsonify({'error': 'User already exists'}), 400
        
        # Hash password
        hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Create user with graph limit fields
        user = create_user_document(
            username=data['username'],
            email=data['email'],
            hashed_password=hashed
        )
        
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
                'email': user['email'],
                'is_premium': user['is_premium'],
                'graphs_created_today': user['graphs_created_today']
            }
        }), 201
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({'error': 'Registration failed'}), 500

@chat_bp.route('/api/generate-graph-data', methods=['POST'])
@jwt_required()
def generate_graph_data():
    try:
        data = request.json
        title = data.get('title')
        description = data.get('description')

        # More structured and cleaner prompt
        prompt = f"""
        Create a clean and organized knowledge graph for:
        Title: {title}
        Description: {description}

        Rules for graph structure:
        1. Create exactly one main node for the central concept
        2. Generate 3-5 primary concept nodes directly connected to the main node
        3. For each primary node, add 2-3 related secondary nodes
        4. Keep relationships simple and clear
        5. Use concise labels (max 3 words)
        6. Ensure hierarchical organization

        Node types to use:
        - "main" for central concept
        - "concept" for primary nodes
        - "feature" for secondary nodes

        Return a JSON with this exact structure:
        {{
            "nodes": [
                {{
                    "id": "n0",
                    "label": "Main Concept",
                    "type": "main",
                    "description": "Clear description"
                }},
                // More nodes...
            ],
            "edges": [
                {{
                    "source": "n0",
                    "target": "n1",
                    "label": "simple relationship"
                }},
                // More edges...
            ]
        }}

        Keep the graph clean and organized with these limits:
        - Maximum 12 total nodes
        - Maximum 15 edges
        - No crossing edges when possible
        - Clear hierarchy from main concept
        """

        # Get AI response
        response = model.generate_content(prompt)
        graph_data = json.loads(response.text)

        # Process and enhance the graph data
        processed_data = process_graph_data(graph_data)
        
        return jsonify(processed_data)
    except Exception as e:
        logger.error(f"Error generating graph data: {e}")
        return jsonify({'error': str(e)}), 500

def process_graph_data(data):
    """Enhance and validate the graph data"""
    try:
        # Ensure we have nodes and edges
        if 'nodes' not in data or 'edges' not in data:
            raise ValueError("Invalid graph data structure")

        # Limit number of nodes and edges
        nodes = data['nodes'][:12]  # Maximum 12 nodes
        edges = data['edges'][:15]  # Maximum 15 edges

        # Process nodes
        processed_nodes = []
        node_ids = set()
        
        for i, node in enumerate(nodes):
            new_node = {
                'id': f'n{i}',
                'label': node['label'][:30],  # Limit label length
                'type': node['type'] if node['type'] in ['main', 'concept', 'feature'] else 'concept',
                'description': node['description'][:200]  # Limit description length
            }
            processed_nodes.append(new_node)
            node_ids.add(new_node['id'])

        # Process edges
        processed_edges = []
        seen_edges = set()  # To prevent duplicate edges
        
        for edge in edges:
            if edge['source'] in node_ids and edge['target'] in node_ids:
                edge_key = f"{edge['source']}-{edge['target']}"
                if edge_key not in seen_edges:
                    new_edge = {
                        'source': edge['source'],
                        'target': edge['target'],
                        'label': edge['label'][:20]  # Limit relationship label length
                    }
                    processed_edges.append(new_edge)
                    seen_edges.add(edge_key)

        return {
            'nodes': processed_nodes,
            'edges': processed_edges
        }
    except Exception as e:
        logger.error(f"Error processing graph data: {e}")
        raise 
