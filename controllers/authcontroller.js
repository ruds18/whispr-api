const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const secretKey = 'your-secret-key';

const registerUser = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({
      firstName,
      lastName,
      username,
      password,
      secret: "you haven't posted any secret, yet...",
    });

    await newUser.save();

    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    return res.json({ message: 'Signup successful', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && user.password === password) {
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      return res.json({ message: 'Login successful', token });
    }

    res.status(401).json({ message: 'Invalid credentials' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllSecrets = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.json({ allUsers });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const setSecret = async (req, res) => {
  const { secret } = req.body;
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.secret = secret;
    await user.save();

    res.json({ message: 'Secret set successfully', secret: user.secret });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const currentUser = await User.findOne({ username: req.query.username });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: currentUser.username,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    res.json({ message: 'Password reset successfully', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllSecrets,
  setSecret,
  getCurrentUser,
  resetPassword,
};
