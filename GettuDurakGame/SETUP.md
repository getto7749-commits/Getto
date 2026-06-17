# Installation & Setup Guide

## Backend Setup

1. **Install Dependencies**
   ```bash
   cd GettuDurakGame
   npm install
   ```

2. **MongoDB Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `.env` with your MongoDB URI

3. **Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Start Server**
   ```bash
   npm run server:dev
   ```
   Server will run on `http://localhost:3000`

## Frontend Setup

1. **Install Dependencies** (if not already done)
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run client:dev
   ```
   Frontend will run on `http://localhost:5173`

## Running Together

```bash
npm run dev
```

This will start both backend and frontend servers concurrently.

## Docker Setup (Optional)

1. **Build Docker Image**
   ```bash
   docker build -t gettu-durak-game .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 -p 5173:5173 gettu-durak-game
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with Telegram
- `GET /api/auth/profile` - Get user profile

### Users
- `GET /api/users/daily-reward` - Claim daily reward
- `GET /api/users/leaderboard` - Get top players

### Games
- `POST /api/games/create-table` - Create new game table
- `GET /api/games/tables` - List available tables
- `GET /api/games/table/:tableId` - Get game details

### Referral
- `GET /api/referral/code` - Get referral code
- `POST /api/referral/claim` - Claim referral

### Chat
- `GET /api/chat/messages` - Get messages
- `POST /api/chat/send` - Send message

## WebSocket Events

### Game Events
- `joinGame` - Join a game table
- `leaveGame` - Leave game table
- `placeBet` - Place a bet
- `startGame` - Start the game
- `playCard` - Play a card
- `playerJoined` - Player joined event
- `gameStarted` - Game started event
- `cardPlayed` - Card played event

### Chat Events
- `sendMessage` - Send chat message
- `messageReceived` - New message received
- `getMessages` - Get recent messages
- `messagesLoaded` - Messages loaded event

## Game Rules (Durak)

1. Players take turns being the **Attacker** and **Defender**
2. Attacker plays cards, Defender must beat them with higher cards of same suit or trump
3. After all cards are beaten, Attacker can add more cards
4. If Defender can't beat all cards, they lose and take all cards
5. Winner is the last player with cards in hand
6. Game rewards based on performance and bet amounts

## Features

✅ **Multiplayer Gaming**
- Real-time card game
- 2-6 players per table
- WebSocket-based communication

✅ **Currency System**
- Coins for in-game currency
- Diamonds for premium rewards
- Betting system

✅ **Daily Rewards**
- Daily login bonus
- Streak bonuses
- Special events

✅ **Social Features**
- In-game chat
- Referral system
- Leaderboards
- User profiles

✅ **Telegram Integration**
- Mini App support
- Telegram authentication
- Share functionality

## Troubleshooting

### Connection Issues
- Check if both backend and frontend are running
- Verify MongoDB connection
- Check firewall settings

### Game Crashes
- Check browser console for errors
- Verify all dependencies are installed
- Restart the development server

### Chat Not Working
- Ensure Socket.io is properly connected
- Check network tab in browser DevTools
- Verify CORS settings

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License