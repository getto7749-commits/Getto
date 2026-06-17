const User = require('../models/User');
const Referral = require('../models/Referral');

exports.getReferralCode = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      referralCode: user.referralCode,
      referrals: user.referrals.length,
      earnings: user.referralEarnings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching referral info' });
  }
};

exports.claimReferral = async (req, res) => {
  try {
    const { referralCode } = req.body;
    const userId = req.user.id;

    // Find referrer
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    // Get current user
    const user = await User.findById(userId);
    if (user.referredBy) {
      return res.status(400).json({ message: 'Already referred' });
    }

    // Update users
    user.referredBy = referrer._id;
    referrer.referrals.push(user._id);
    referrer.referralEarnings += 100;
    referrer.coins += 100;

    await user.save();
    await referrer.save();

    res.json({
      success: true,
      message: 'Referral claimed',
      reward: 100
    });
  } catch (error) {
    res.status(500).json({ message: 'Error claiming referral' });
  }
};