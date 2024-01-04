const { z } = require('zod');
const Note = require('../models/note');

const getAllNotes = async (req, res) => {
  try {
    // Fetch all notes for the authenticated user
    const userNotes = await Note.find({ user: req.user });
    res.status(200).json({ notes: userNotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;

    // Ensure that the note belongs to the authenticated user
    const note = await Note.findOne({ _id: noteId, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const createNote = async (req, res) => {
  try {
    // Validate input using Zod
    const { title, content } = createNoteSchema.parse(req.body);

    // Create a new note for the authenticated user
    const newNote = new Note({ title, content, user: req.user });
    await newNote.save();

    res.status(201).json({ note: newNote });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;

    // Validate input using Zod
    const { title, content } = updateNoteSchema.parse(req.body);

    // Update an existing note by ID for the authenticated user
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: req.user._id },
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ note: updatedNote });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;

    // Delete a note by ID for the authenticated user
    const deletedNote = await Note.findOneAndDelete({ _id: noteId, user: req.user._id });

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ note: deletedNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const shareNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    // Validate input using Zod
    const { userId } = shareNoteSchema.parse(req.body);

    // Share a note with another user for the authenticated user
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: req.user._id },
      { $addToSet: { sharedWith: userId } },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ note: updatedNote });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Zod schemas for input validation
const createNoteSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(5),
});

const updateNoteSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(5),
});

const shareNoteSchema = z.object({
  userId: z.string(), // You might want to validate this further based on your user ID format
});

module.exports = { getAllNotes, getNoteById, createNote, updateNoteById, deleteNoteById, shareNote };
