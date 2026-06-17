const User = require('../models/User');

exports.getDailyReward = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const lastReward = user.lastDailyReward || new Date(0);
    const daysDiff = Math.floor((now - lastReward) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 1) {
      const streak = daysDiff === 1 ? user.dailyRewardStreak + 1 : 1;
      const reward = 100 + (streak * 10); // Bonus based on streak

      user.coins += reward;
      user.dailyRewardStreak = streak;
      user.lastDailyReward = now;
      await user.save();

      res.json({
        success: true,
        reward,
        streak,
        coins: user.coins
      });
    } else {
      res.json({
        success: false,
        message: 'Daily reward already claimed',
        nextReward: new Date(lastReward.getTime() + 24 * 60 * 60 * 1000)
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error claiming daily reward' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ totalWinnings: -1 })
      .limit(100)
      .select('username level totalWinnings gamesWon photoUrl');

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};