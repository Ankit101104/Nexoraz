from flask import Blueprint, request, jsonify
from razorpay import Client
from functools import wraps
import os
import hmac
import hashlib
from models.user import User
from middleware.auth import token_required

payment_routes = Blueprint('payment_routes', __name__)

# Initialize Razorpay client
razorpay_client = Client(
    auth=(os.getenv('RAZORPAY_KEY_ID'), os.getenv('RAZORPAY_KEY_SECRET'))
)

@payment_routes.route('/api/payment/create-order', methods=['POST'])
@token_required
def create_order(current_user):
    try:
        data = request.get_json()
        amount = data.get('amount', 99900)  # Default to ₹999 if not specified
        currency = data.get('currency', 'INR')

        # Create Razorpay Order
        payment_data = {
            'amount': amount,
            'currency': currency,
            'receipt': f'order_rcptid_{current_user.id}',
            'notes': {
                'user_id': str(current_user.id)
            }
        }
        
        order = razorpay_client.order.create(data=payment_data)
        return jsonify(order)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_routes.route('/api/payment/verify', methods=['POST'])
@token_required
def verify_payment(current_user):
    try:
        # Get payment verification data
        payment_data = request.get_json()
        razorpay_payment_id = payment_data.get('razorpay_payment_id')
        razorpay_order_id = payment_data.get('razorpay_order_id')
        razorpay_signature = payment_data.get('razorpay_signature')

        # Verify signature
        expected_signature = hmac.new(
            os.getenv('RAZORPAY_KEY_SECRET').encode(),
            f'{razorpay_order_id}|{razorpay_payment_id}'.encode(),
            hashlib.sha256
        ).hexdigest()

        if expected_signature == razorpay_signature:
            # Update user to premium status
            User.update_premium_status(current_user.id, True)
            return jsonify({
                'success': True,
                'message': 'Payment verified successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Invalid signature'
            }), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 