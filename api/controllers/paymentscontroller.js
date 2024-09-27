// @ts-nocheck
const paypal = require('paypal-rest-sdk');
require('dotenv').config();
const stripeApiKey = process.env.STRIPE_API_KEY;
const stripe = require('stripe')(stripeApiKey);
paypal.configure({
  mode: 'sandbox', // sandbox version of paypal for payment integration
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

function createPayPalPayment(req, res) {
  const { price, currency } = req.body;

  const paymentData = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'Sample Item', // Static name
              price: price, // Get price from the frontend
              currency: currency, // Get currency from the frontend
              quantity: 1, // Static quantity 
            },
          ],
        },
        amount: {
          total: price, // Get price from the frontend
          currency: currency, // Get currency from the frontend
        },
        description: 'Sample Description',
      },
    ],
  };

  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      console.error('PayPal API Error:', error.response); // Log the entire response
      res.status(500).json({ error: 'Failed to create PayPal payment' });
    } else {
      res.json({ paymentLink: payment.links[1].href });
    }
  });
}






const createPaymentIntent = async (req, res) => {
  const { amount, payment_method_id } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects the amount in cents
      currency: 'usd', // Replace with your currency code
      payment_method: payment_method_id, // Add the payment method
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating payment intent' });
  }
};

module.exports = { createPaymentIntent, createPayPalPayment };
