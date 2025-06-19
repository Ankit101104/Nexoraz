import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { updatePremiumStatus } from '../../redux/slices/authSlice';
import './Pricing.css';

const Pricing = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  
  const RAZORPAY_KEY_ID = 'rzp_test_RI9v9NWO3vqA8l'; // Your test key ID

  const pricingPlans = [
    {
      name: 'Free',
      price: 0,
      features: [
        'Basic Knowledge Graph',
        'Limited Queries per Day',
        'Standard Support'
      ]
    },
    {
      name: 'Premium',
      price: 750, // Price in INR
      features: [
        'Advanced Knowledge Graph',
        'Unlimited Queries',
        'Priority Support',
        'Custom Visualizations',
        'API Access'
      ]
    }
  ];

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan) => {
    const res = await loadRazorpay();

    if (!res) {
      alert('Razorpay SDK failed to load');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          amount: plan.price,
          planName: plan.name 
        }),
      });
      
      const order = await response.json();
      
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: plan.price * 100,
        currency: 'INR',
        name: 'NEXORAZ',
        description: `${plan.name} Plan Subscription`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const result = await fetch('http://localhost:5000/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const data = await result.json();
            if (data.success) {
              dispatch(updatePremiumStatus(true));
              alert('Payment Successful! You are now a premium member.');
              window.location.reload();
            }
          } catch (err) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user?.username,
          email: user?.email,
        },
        theme: {
          color: '#64ffda'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="pricing-container">
      <h1>Choose Your Plan</h1>
      <div className="pricing-plans">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className="pricing-card">
            <h2>{plan.name}</h2>
            <div className="price">
              ₹{plan.price}<span>/month</span>
            </div>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            {plan.price > 0 && !user?.isPremium && (
              <button 
                onClick={() => handleSubscribe(plan)}
                className="subscribe-button"
              >
                Subscribe Now
              </button>
            )}
            {user?.isPremium && plan.price > 0 && (
              <button disabled className="subscribed-button">
                Current Plan
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing; 