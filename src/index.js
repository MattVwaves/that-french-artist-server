// require('dotenv').config;
const env = require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const app = express();
app.disable('x-powered-by');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const itemRouter = require('./routers/Item');
app.use('/item', itemRouter);

const basketRouter = require('./routers/Basket');
app.use('/basket', basketRouter);

app.get('/config', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'eur',
      amount: 1999,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log(paymentIntent);
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`\n Server is running on http://localhost:${port}\n`);
});
