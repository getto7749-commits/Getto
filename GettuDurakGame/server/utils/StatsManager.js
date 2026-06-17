// Statistics and achievements tracking

const User = require('../models/User');

class StatsManager {
  static async updateGameResult(userId, won, earnings, gamesPlayed = 1) {
    try {
      const user = await User.findById(userId);
      if (user) {
        user.gamesPlayed += gamesPlayed;
        if (won) {
          user.gamesWon += 1;
          user.totalWinnings += earnings;
          user.coins += earnings;
          user.experience += 100;
        } else {
          user.coins -= earnings;
          user.experience += 50;
        }

        // Level up every 1000 experience
        if (user.experience >= user.level * 1000) {
          user.level += 1;
          user.coins += 500; // Bonus for level up
        }

        await user.save();
        return user;
      }
    } catch (error) {
      console.error('Stats update error:', error);
    }
  }

  static async getPlayerStats(userId) {
    try {
      const user = await User.findById(userId);
      if (user) {
        return {
          level: user.level,
          experience: user.experience,
          gamesPlayed: user.gamesPlayed,
          gamesWon: user.gamesWon,
          winRate: user.gamesPlayed > 0 ? ((user.gamesWon / user.gamesPlayed) * 100).toFixed(2) : 0,
          totalWinnings: user.totalWinnings,
          coins: user.coins
        };
      }
    } catch (error) {
      console.error('Get stats error:', error);
    }
  }
}

module.exports = StatsManager;