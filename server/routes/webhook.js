const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { email } = req.body; // Optional: capture user email to associate payment

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI Blog Premium Subscription',
            },
            unit_amount: 500, // $5.00/month
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      customer_email: email, // Optional - for tracking user
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
