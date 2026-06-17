const Game = require('../models/Game');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

exports.createTable = async (req, res) => {
  try {
    const { tableName, minBet, maxPlayers } = req.body;
    const tableId = uuidv4();

    const game = new Game({
      tableId,
      tableName: tableName || `Table ${tableId.substring(0, 4)}`,
      minBet: minBet || 10,
      maxPlayers: maxPlayers || 6,
      players: []
    });

    await game.save();

    res.json({
      success: true,
      game: {
        tableId: game.tableId,
        tableName: game.tableName,
        minBet: game.minBet,
        maxPlayers: game.maxPlayers,
        players: game.players
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating table' });
  }
};

exports.getTables = async (req, res) => {
  try {
    const games = await Game.find({ status: 'waiting' })
      .select('tableId tableName players minBet maxPlayers')
      .limit(20);

    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tables' });
  }
};

exports.getGameDetails = async (req, res) => {
  try {
    const { tableId } = req.params;
    const game = await Game.findOne({ tableId }).populate('players.userId', 'username photoUrl level');

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game details' });
  }
};