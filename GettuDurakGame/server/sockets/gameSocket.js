const Game = require('../models/Game');
const User = require('../models/User');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join game table
    socket.on('joinGame', async (data) => {
      try {
        const { tableId, userId, username } = data;
        const game = await Game.findOne({ tableId });

        if (!game) {
          socket.emit('error', 'Game not found');
          return;
        }

        if (game.players.length >= game.maxPlayers) {
          socket.emit('error', 'Table is full');
          return;
        }

        // Add player to game
        game.players.push({
          userId,
          username,
          coins: 1000,
          bet: 0,
          status: 'waiting'
        });

        await game.save();
        socket.join(tableId);
        io.to(tableId).emit('playerJoined', {
          username,
          playersCount: game.players.length
        });
      } catch (error) {
        console.error('Join game error:', error);
        socket.emit('error', 'Failed to join game');
      }
    });

    // Leave game
    socket.on('leaveGame', async (data) => {
      try {
        const { tableId, userId } = data;
        const game = await Game.findOne({ tableId });

        if (game) {
          game.players = game.players.filter(p => p.userId.toString() !== userId);
          await game.save();
          io.to(tableId).emit('playerLeft', {
            playersCount: game.players.length
          });
        }
      } catch (error) {
        console.error('Leave game error:', error);
      }
    });

    // Place bet
    socket.on('placeBet', async (data) => {
      try {
        const { tableId, userId, bet } = data;
        const game = await Game.findOne({ tableId });

        if (game) {
          const player = game.players.find(p => p.userId.toString() === userId);
          if (player) {
            player.bet = bet;
            await game.save();
            io.to(tableId).emit('betPlaced', {
              username: player.username,
              bet
            });
          }
        }
      } catch (error) {
        console.error('Bet error:', error);
      }
    });

    // Start game
    socket.on('startGame', async (data) => {
      try {
        const { tableId } = data;
        const game = await Game.findOne({ tableId });

        if (game && game.players.length >= 2) {
          game.status = 'playing';
          game.currentRound = 1;
          await game.save();
          io.to(tableId).emit('gameStarted', {
            status: 'playing'
          });
        }
      } catch (error) {
        console.error('Start game error:', error);
      }
    });

    // Handle card play
    socket.on('playCard', async (data) => {
      try {
        const { tableId, userId, card } = data;
        io.to(tableId).emit('cardPlayed', {
          username: data.username,
          card
        });
      } catch (error) {
        console.error('Card play error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};