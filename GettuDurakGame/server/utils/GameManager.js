// Utility functions for game management

const activeGames = new Map();

class GameManager {
  static createGame(tableId, players, minBet) {
    const DurakGame = require('./DurakGame');
    const game = new DurakGame(tableId, players, minBet);
    game.dealCards();
    activeGames.set(tableId, game);
    return game;
  }

  static getGame(tableId) {
    return activeGames.get(tableId);
  }

  static removeGame(tableId) {
    return activeGames.delete(tableId);
  }

  static getAllGames() {
    return Array.from(activeGames.values());
  }
}

module.exports = GameManager;