// services/cart/index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const cartSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  cart_items: [{
    product_id: mongoose.Schema.Types.ObjectId,
    quantity: Number,
  }],
});

const Cart = mongoose.model('Cart', cartSchema);

app.post('/cart', async (req, res) => {
  const cart = new Cart(req.body);
  await cart.save();
  res.status(201).send(cart);
});

app.get('/cart/:userId', async (req, res) => {
  const cart = await Cart.findOne({ user_id: req.params.userId });
  res.send(cart);
});

app.put('/cart/:userId', async (req, res) => {
  const cart = await Cart.findOneAndUpdate({ user_id: req.params.userId }, req.body, { new: true });
  res.send(cart);
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Cart service running on port ${PORT}`);
});
