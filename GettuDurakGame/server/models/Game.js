const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  tableId: {
    type: String,
    required: true,
    unique: true
  },
  tableName: String,
  
  // Players
  players: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    cards: [String],
    coins: Number,
    bet: Number,
    isAttacker: Boolean,
    isDefender: Boolean,
    status: {
      type: String,
      enum: ['waiting', 'playing', 'left'],
      default: 'waiting'
    }
  }],
  
  // Game State
  status: {
    type: String,
    enum: ['waiting', 'playing', 'finished'],
    default: 'waiting'
  },
  currentRound: {
    type: Number,
    default: 0
  },
  deck: [String],
  table: [String],
  
  // Settings
  minBet: {
    type: Number,
    default: 10
  },
  maxPlayers: {
    type: Number,
    default: 6
  },
  
  // Winners
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  prizePool: Number,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  finishedAt: Date
});

module.exports = mongoose.model('Game', GameSchema);