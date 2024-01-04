const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Note = require('../models/note');
const User = require('../models/user');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Search Endpoint', () => {
  let authenticatedUser;

  before(async () => {
    // Create a test user for authentication
    authenticatedUser = await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: '$2b$10$pmVk/xXz.9fPGHo.j3wAKeW.D0YwLss62iHsyYFfwmELeKdN1D99i', // bcrypt hash for 'password123'
    });

    // Add setup tasks, e.g., create test notes associated with the authenticated user
    await Note.create([
      { title: 'Searchable Note 1', content: 'Keyword in content', user: authenticatedUser._id },
      { title: 'Searchable Note 2', content: 'Keyword in title', user: authenticatedUser._id },
    ]);
  });

  after(async () => {
    // Add teardown tasks, e.g., removing test data from the database
    await User.deleteMany({ username: 'testuser' });
    await Note.deleteMany({ user: authenticatedUser._id });
  });

  describe('GET /api/search?q=:query', () => {
    it('should search for notes based on keywords for the authenticated user', async () => {
      const res = await chai
        .request(app)
        .get('/api/search')
        .set('Authorization', `Bearer ${authenticatedUser.token}`)
        .query({ q: 'Keyword' });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('results').to.be.an('array');
      expect(res.body.results).to.have.lengthOf.at.least(2); // At least the notes created in the before hook
    });

    // Add more search test cases as needed
  });
});
