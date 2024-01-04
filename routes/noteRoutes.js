const express = require('express');
const { getAllNotes, getNoteById, createNote, updateNoteById, deleteNoteById, shareNote } = require('../controllers/noteController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all note routes
router.use(authMiddleware);

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNoteById);
router.delete('/:id', deleteNoteById);
router.post('/:id/share', shareNote);

module.exports = router;
