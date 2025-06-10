const express = require('express');
const stripe = require('stripe')('Add-Own-Security-Key');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('Received request to create checkout session:', req.body);
    
    if (!req.body.priceId) {
      console.error('Missing priceId in request');
      return res.status(400).json({ error: 'priceId is required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: req.body.priceId, quantity: 1 }],
      mode: 'payment',
      success_url: 'http://localhost:4200/success',
      cancel_url: 'http://localhost:4200/cancel',
    });

    console.log('Checkout session created successfully:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Backend läuft auf Port 3000'));
