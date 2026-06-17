const User = require('../models/User');

class ReferralManager {
  static async processReferral(referrerCode, newUserId) {
    try {
      const referrer = await User.findOne({ referralCode: referrerCode });
      if (!referrer) return null;

      const newUser = await User.findById(newUserId);
      if (!newUser || newUser.referredBy) return null;

      // Update referral
      newUser.referredBy = referrer._id;
      referrer.referrals.push(newUser._id);
      referrer.referralEarnings += 100;
      referrer.coins += 100;

      await newUser.save();
      await referrer.save();

      return {
        referrer: referrer._id,
        reward: 100
      };
    } catch (error) {
      console.error('Referral processing error:', error);
      return null;
    }
  }

  static async getReferralStats(userId) {
    try {
      const user = await User.findById(userId);
      if (user) {
        return {
          referralCode: user.referralCode,
          totalReferrals: user.referrals.length,
          totalEarnings: user.referralEarnings,
          referrals: user.referrals
        };
      }
    } catch (error) {
      console.error('Get referral stats error:', error);
    }
  }
}

module.exports = ReferralManager;