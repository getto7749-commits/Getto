// Game logic for Durak card game

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const RANK_VALUES = { '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

class DurakGame {
  constructor(tableId, players, minBet = 10) {
    this.tableId = tableId;
    this.players = players.map(p => ({
      ...p,
      hand: [],
      bet: minBet,
      passed: false
    }));
    this.minBet = minBet;
    this.deck = this.createDeck();
    this.table = [];
    this.discardPile = [];
    this.currentAttackerIdx = 0;
    this.currentDefenderIdx = 1;
    this.trump = this.deck[this.deck.length - 1];
    this.round = 0;
    this.gameOver = false;
    this.winner = null;
  }

  createDeck() {
    const deck = [];
    for (let suit of SUITS) {
      for (let rank of RANKS) {
        deck.push(`${rank}${suit}`);
      }
    }
    return this.shuffle(deck);
  }

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  dealCards() {
    const cardsPerPlayer = 6;
    for (let player of this.players) {
      while (player.hand.length < cardsPerPlayer && this.deck.length > 0) {
        player.hand.push(this.deck.pop());
      }
    }
  }

  getAttacker() {
    return this.players[this.currentAttackerIdx];
  }

  getDefender() {
    return this.players[this.currentDefenderIdx];
  }

  canBeat(defendCard, attackCard) {
    const defendRank = defendCard.slice(0, -1);
    const defendSuit = defendCard.slice(-1);
    const attackRank = attackCard.slice(0, -1);
    const attackSuit = attackCard.slice(-1);

    // Can beat with higher rank of same suit
    if (defendSuit === attackSuit) {
      return RANK_VALUES[defendRank] > RANK_VALUES[attackRank];
    }

    // Can beat with trump
    if (defendSuit === this.trump.slice(-1)) {
      return true;
    }

    return false;
  }

  playAttackCard(card) {
    const attacker = this.getAttacker();
    const idx = attacker.hand.indexOf(card);
    if (idx !== -1) {
      this.table.push({
        attack: card,
        defense: null
      });
      attacker.hand.splice(idx, 1);
      return true;
    }
    return false;
  }

  playDefenseCard(attackPairIdx, defenseCard) {
    const defender = this.getDefender();
    const idx = defender.hand.indexOf(defenseCard);
    
    if (idx === -1) return false;

    const attackCard = this.table[attackPairIdx].attack;
    if (this.canBeat(defenseCard, attackCard)) {
      this.table[attackPairIdx].defense = defenseCard;
      defender.hand.splice(idx, 1);
      return true;
    }
    return false;
  }

  defendersPass() {
    const defender = this.getDefender();
    if (this.table.every(pair => pair.defense !== null)) {
      // Defender successfully defended
      this.discardPile.push(...this.table.map(pair => pair.attack));
      this.discardPile.push(...this.table.map(pair => pair.defense).filter(c => c));
      this.table = [];
      return 'defended';
    } else {
      // Defender failed
      return 'lost';
    }
  }

  nextRound() {
    this.round++;
    this.dealCards();
    
    // Rotate players
    this.currentAttackerIdx = (this.currentAttackerIdx + 1) % this.players.length;
    this.currentDefenderIdx = (this.currentDefenderIdx + 1) % this.players.length;

    // Check if game is over
    if (this.deck.length === 0 && this.players.filter(p => p.hand.length > 0).length === 1) {
      this.gameOver = true;
      this.winner = this.players.find(p => p.hand.length > 0);
    }
  }

  getGameState() {
    return {
      tableId: this.tableId,
      round: this.round,
      gameOver: this.gameOver,
      winner: this.winner,
      players: this.players.map(p => ({
        userId: p.userId,
        username: p.username,
        handSize: p.hand.length,
        coins: p.coins,
        bet: p.bet
      })),
      table: this.table,
      currentAttacker: this.getAttacker().username,
      currentDefender: this.getDefender().username,
      trump: this.trump,
      deckSize: this.deck.length
    };
  }
}

module.exports = DurakGame;