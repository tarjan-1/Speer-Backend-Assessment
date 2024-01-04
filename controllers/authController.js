const { z } = require('zod');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Zod schemas for input validation
const signUpSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signUp = async (req, res) => {
  try {
    // Validate input using Zod
    const { username, email, password } = signUpSchema.parse(req.body);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate JWT token
    const token = generateAuthToken(newUser);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    // Validate input using Zod
    const { email, password } = loginSchema.parse(req.body);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateAuthToken(user);

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Helper function to generate JWT token
const generateAuthToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { signUp, login };
