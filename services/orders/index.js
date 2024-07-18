// services/orders/index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const orderSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  order_date: Date,
  shipping_address: String,
  billing_address: String,
  order_items: [{
    product_id: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    price: Number,
  }],
  total_price: Number,
  status: String,
});

const Order = mongoose.model('Order', orderSchema);

app.post('/orders', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.status(201).send(order);
});

app.get('/orders/user/:userId', async (req, res) => {
  const orders = await Order.find({ user_id: req.params.userId });
  res.send(orders);
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Orders service running on port ${PORT}`);
});
