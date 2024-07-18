// gateway/index.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

const services = {
  users: 'http://localhost:4001',
  products: 'http://localhost:4002',
  orders: 'http://localhost:4003',
  cart: 'http://localhost:4004',
};

const proxy = async (req, res, service, path) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${services[service]}${path}`,
      data: req.body,
    });
    res.send(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
};

// User routes
app.post('/users/register', (req, res) => proxy(req, res, 'users', '/users/register'));
app.post('/users/login', (req, res) => proxy(req, res, 'users', '/users/login'));
app.get('/users/:id', (req, res) => proxy(req, res, 'users', `/users/${req.params.id}`));

// Product routes
app.post('/products', (req, res) => proxy(req, res, 'products', '/products'));
app.get('/products', (req, res) => proxy(req, res, 'products', '/products'));
app.get('/products/:id', (req, res) => proxy(req, res, 'products', `/products/${req.params.id}`));

// Order routes
app.post('/orders', (req, res) => proxy(req, res, 'orders', '/orders'));
app.get('/orders/user/:userId', (req, res) => proxy(req, res, 'orders', `/orders/user/${req.params.userId}`));

// Cart routes
app.post('/cart', (req, res) => proxy(req, res, 'cart', '/cart'));
app.get('/cart/:userId', (req, res) => proxy(req, res, 'cart', `/cart/${req.params.userId}`));
app.put('/cart/:userId', (req, res) => proxy(req, res, 'cart', `/cart/${req.params.userId}`));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gateway API running on port ${PORT}`);
});
