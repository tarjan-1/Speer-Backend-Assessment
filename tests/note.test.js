const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Replace with the actual path to your server file
const Note = require('../models/note');
const User = require('../models/user');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Note Endpoints', () => {
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
      { title: 'Note 1', content: 'Content 1', user: authenticatedUser._id },
      { title: 'Note 2', content: 'Content 2', user: authenticatedUser._id },
    ]);
  });

  after(async () => {
    // Add teardown tasks, e.g., removing test data from the database
    await User.deleteMany({ username: 'testuser' });
    await Note.deleteMany({ user: authenticatedUser._id });
  });

  describe('GET /api/notes', () => {
    it('should get a list of all notes for the authenticated user', async () => {
      const res = await chai
        .request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authenticatedUser.token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('notes').to.be.an('array');
      expect(res.body.notes).to.have.lengthOf.at.least(2); // At least the notes created in the before hook
    });

    // Add more test cases for other note endpoints
  });
});
