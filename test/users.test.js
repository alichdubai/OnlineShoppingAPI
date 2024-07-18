// test/users.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../services/users/index'); // Adjust the path as needed
const mongoose = require('mongoose');
const User = require('../services/users/models/user'); // Adjust the path as needed

chai.use(chaiHttp);
const expect = chai.expect;

describe('Users Service', () => {
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

  describe('/POST register', () => {
    it('it should register a new user', (done) => {
      const user = {
        username: 'testuser',
        password: 'testpassword',
        email: 'testuser@example.com',
        address: '123 Test St',
        phone_number: '1234567890',
      };
      chai.request(server)
        .post('/users/register')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('username').eql(user.username);
          done();
        });
    });
  });

  describe('/POST login', () => {
    it('it should login a user', (done) => {
      const user = new User({
        username: 'testuser',
        password: 'testpassword',
        email: 'testuser@example.com',
        address: '123 Test St',
        phone_number: '1234567890',
      });
      user.save((err, user) => {
        chai.request(server)
          .post('/users/login')
          .send({ email: 'testuser@example.com', password: 'testpassword' })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('email').eql(user.email);
            done();
          });
      });
    });

    it('it should not login a user with wrong password', (done) => {
      chai.request(server)
        .post('/users/login')
        .send({ email: 'testuser@example.com', password: 'wrongpassword' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  describe('/GET users/:id', () => {
    it('it should get a user by id', (done) => {
      const user = new User({
        username: 'testuser',
        password: 'testpassword',
        email: 'testuser@example.com',
        address: '123 Test St',
        phone_number: '1234567890',
      });
      user.save((err, user) => {
        chai.request(server)
          .get(`/users/${user.id}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('email').eql(user.email);
            done();
          });
      });
    });
  });
});
