const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { username, password, uniqueId } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ username }, { uniqueId }] });
    if (userExists) {
      return res.status(400).json({ message: 'Username or uniqueId is already in use.' });
    }
    const newUser = new User({
      username,
      password,
      uniqueId
    });
    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        uniqueId: savedUser.uniqueId
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error. Could not register user.' });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        uniqueId: user.uniqueId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const user = await User.findOne({ uniqueId }).select('username uniqueId');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};