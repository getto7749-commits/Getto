const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

exports.authenticate = async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName, photoUrl } = req.body;

    let user = await User.findOne({ telegramId });

    if (!user) {
      // Create new user
      const referralCode = uuidv4().substring(0, 8);
      user = new User({
        telegramId,
        username,
        firstName,
        lastName,
        photoUrl,
        referralCode,
        coins: 1000 // Starting coins
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, telegramId: user.telegramId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        coins: user.coins,
        diamonds: user.diamonds,
        level: user.level
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      coins: user.coins,
      diamonds: user.diamonds,
      level: user.level,
      experience: user.experience,
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
      totalWinnings: user.totalWinnings,
      referralCode: user.referralCode
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};