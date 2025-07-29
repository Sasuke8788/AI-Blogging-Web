const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const verifyToken = require('../middleware/auth');
const User = require('../models/User');

router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'AI Blog Premium Subscription',
          },
          unit_amount: 500,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/stripe/mark-premium
router.post('/mark-premium', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.isPremium = true;
    await user.save();
    res.json({ msg: 'User upgraded to premium.' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
