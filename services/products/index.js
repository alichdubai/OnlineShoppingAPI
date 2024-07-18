// services/products/index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  stock_quantity: Number,
  images: [String],
  reviews: [mongoose.Schema.Types.ObjectId],
});

const Product = mongoose.model('Product', productSchema);

app.post('/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).send(product);
});

app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.send(product);
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Products service running on port ${PORT}`);
});
