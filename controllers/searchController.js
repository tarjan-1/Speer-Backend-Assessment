const { z } = require('zod');
const Note = require('../models/note');

const searchNotes = async (req, res) => {
  try {
    // Validate input using Zod
    const { query } = searchNotesSchema.parse(req.query);

    // Build the query criteria for the search
    const searchCriteria = {
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: 'i' } }, // Case-insensitive title search
            { content: { $regex: query, $options: 'i' } }, // Case-insensitive content search
          ],
        },
        {
          $or: [
            { user: req.user._id }, // Search notes owned by the authenticated user
            { sharedWith: req.user._id }, // Search notes shared with the authenticated user
          ],
        },
      ],
    };

    // Search for notes based on the criteria
    const searchResults = await Note.find(searchCriteria); 

    res.status(200).json({ results: searchResults });
  } catch (error) {
    console.error(error);

    if (error.name === 'ValidationError') {
      // Handle validation errors
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }

    // Handle authentication errors
    if (error.name === 'UnauthorizedError') {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }

    // Handle other errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Zod schema for input validation
const searchNotesSchema = z.object({
  query: z.string().min(1),
});

module.exports = { searchNotes };
