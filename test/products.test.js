// test/products.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../services/products/index'); // Adjust the path as needed
const mongoose = require('mongoose');
const Product = require('../services/products/models/product'); // Adjust the path as needed

chai.use(chaiHttp);
const expect = chai.expect;

describe('Products Service', () => {
  before((done) => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      console.log('Connected to MongoDB for testing');
      done();
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });

  describe('/POST products', () => {
    it('it should create a new product', (done) => {
      const product = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        category: 'Test Category',
        stock_quantity: 10,
        images: ['test-image.jpg'],
      };
      chai.request(server)
        .post('/products')
        .send(product)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('name').eql(product.name);
          done();
        });
    });
  });

  describe('/GET products', () => {
    it('it should get all products', (done) => {
      chai.request(server)
        .get('/products')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('/GET products/:id', () => {
    it('it should get a product by id', (done) => {
      const product = new Product({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        category: 'Test Category',
        stock_quantity: 10,
        images: ['test-image.jpg'],
      });
      product.save((err, product) => {
        chai.request(server)
          .get(`/products/${product.id}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('name').eql(product.name);
            done();
          });
      });
    });
  });
});
