from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import openai
from datetime import datetime
import os
from db import get_db

# Create blueprint with a unique name
chat_routes = Blueprint('chat_ai', __name__)
db = get_db()

# Initialize OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

SYSTEM_PROMPT = """You are NEXORAZ Assistant, an AI expert in knowledge graphs and the NEXORAZ platform. 
Your role is to help users with:
1. Creating and managing knowledge graphs
2. Understanding graph concepts and best practices
3. Using NEXORAZ features effectively
4. Troubleshooting issues
5. Providing personalized recommendations

Always be helpful, clear, and concise. Use emojis appropriately to make responses engaging."""

@chat_routes.route('/api/chat/process', methods=['POST'])
@jwt_required()
def process_chat():
    try:
        data = request.json
        user_input = data.get('input')
        history = data.get('history', [])
        context = data.get('context', {})

        # Prepare messages for OpenAI
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            *[{"role": msg["role"], "content": msg["content"]} for msg in history],
            {"role": "user", "content": f"""Context: {context}
Query: {user_input}"""}
        ]

        # Get response from OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )

        ai_response = response.choices[0].message.content

        # Log the interaction
        db.chat_logs.insert_one({
            'user_id': get_jwt_identity(),
            'timestamp': datetime.utcnow(),
            'input': user_input,
            'response': ai_response,
            'context': context
        })

        return jsonify({
            'response': ai_response,
            'status': 'success'
        })

    except Exception as e:
        print(f"Error in chat processing: {str(e)}")
        return jsonify({
            'error': 'Failed to process chat message',
            'message': str(e)
        }), 500

@chat_routes.route('/api/chat/suggestions', methods=['POST'])
@jwt_required()
def generate_suggestions():
    try:
        data = request.json
        input_text = data.get('input')
        last_response = data.get('lastResponse')
        context = data.get('context', {})

        # Prepare prompt for suggestions
        prompt = f"""Based on the following conversation and context, generate 3-4 relevant follow-up questions that the user might want to ask.
        
Previous message: {input_text}
Bot response: {last_response}
Current context: {context}

Generate questions that would help the user better understand or use NEXORAZ's knowledge graph features."""

        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant generating relevant follow-up questions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=200
        )

        # Parse the response into a list of questions
        suggestions = response.choices[0].message.content.strip().split('\n')
        suggestions = [q.strip('1234567890. -') for q in suggestions if q.strip()]

        return jsonify({
            'suggestions': suggestions[:4],  # Limit to 4 suggestions
            'status': 'success'
        })

    except Exception as e:
        print(f"Error generating suggestions: {str(e)}")
        return jsonify({
            'suggestions': [
                'How do I create a new graph?',
                'What are the different node types?',
                'How can I share my graph?'
            ],
            'status': 'fallback'
        }) 