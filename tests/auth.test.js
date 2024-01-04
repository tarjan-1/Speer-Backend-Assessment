const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const User = require('../models/user');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Authentication Endpoints', () => {
  before(async () => {
    // Add setup tasks, e.g., clearing the database, creating test users
  });

  after(async () => {
    // Add teardown tasks, e.g., removing test data from the database
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user account', async () => {
      const res = await chai
        .request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('user');
      expect(res.body).to.have.property('token');
    });

    it('should return 400 for duplicate email during signup', async () => {
      // Create a user with the same email first
      await User.create({
        username: 'existinguser',
        email: 'existinguser@example.com',
        password: 'password456',
      });

      // Try to create a new user with the same email
      const res = await chai
        .request(app)
        .post('/api/auth/signup')
        .send({
          username: 'newuser',
          email: 'existinguser@example.com',
          password: 'newpassword',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message').equal('User with this email already exists.');
    });

    // Add more signup test cases as needed
  });

  describe('POST /api/auth/login', () => {
    it('should log in to an existing user account and receive an access token', async () => {
      // Create a user for testing login
      await User.create({
        username: 'testuser',
        email: 'testuser@example.com',
        password: '$2b$10$pmVk/xXz.9fPGHo.j3wAKeW.D0YwLss62iHsyYFfwmELeKdN1D99i', // bcrypt hash for 'password123'
      });

      const res = await chai
        .request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('user');
      expect(res.body).to.have.property('token');
    });

    it('should return 401 for invalid credentials during login', async () => {
      const res = await chai
        .request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistentuser@example.com',
          password: 'invalidpassword',
        });

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message').equal('Invalid credentials');
    });

    // Add more login test cases as needed
  });
});
