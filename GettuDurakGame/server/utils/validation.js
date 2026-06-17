// Validation utilities

const validateBet = (bet, playerCoins, minBet, maxBet) => {
  return bet >= minBet && bet <= maxBet && bet <= playerCoins;
};

const validateCard = (card) => {
  const SUITS = ['♠', '♥', '♦', '♣'];
  const RANKS = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
  const suit = card.slice(-1);
  const rank = card.slice(0, -1);
  
  return RANKS.includes(rank) && SUITS.includes(suit);
};

const sanitizeMessage = (message) => {
  return message
    .trim()
    .substring(0, 300)
    .replace(/[<>]/g, '');
};

const validateUsername = (username) => {
  return username && username.trim().length > 0 && username.length <= 50;
};

module.exports = {
  validateBet,
  validateCard,
  sanitizeMessage,
  validateUsername
};