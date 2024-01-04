const express = require('express');
const { searchNotes } = require('../controllers/searchController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply authentication middleware to the search route
router.use(authMiddleware);

router.get('/', searchNotes);

module.exports = router;
