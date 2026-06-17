# GettuDurakGame - Telegram Mini App 🎮

Multiplayer Durak card game for Telegram Mini App with currency system, daily rewards, chat, and referral system.

## Features

✅ **Multiplayer Gameplay**
- Create and join game tables
- Real-time multiplayer using WebSockets
- Durak card game rules implementation

✅ **User System**
- Player profiles with stats
- Daily login rewards
- Experience and level system

✅ **Currency System**
- In-game currency for betting
- Winning/losing rewards
- Daily bonuses

✅ **Social Features**
- In-game chat
- Referral system with rewards
- Player profiles and statistics

✅ **Telegram Integration**
- Mini App support
- Telegram authentication
- Share and invite functionality

## Project Structure

```
GettuDurakGame/
├── server/              # Node.js + Express backend
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── sockets/        # WebSocket handlers
│   ├── controllers/    # Business logic
│   └── index.js        # Server entry point
├── client/             # React frontend
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom hooks
│   ├── services/      # API services
│   └── App.jsx        # Main component
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This will start both the backend server and frontend dev server.

## Environment Variables

Create `.env` file based on `.env.example`:

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gettu-durak-game
JWT_SECRET=your_secret_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + Socket.io
- **Database**: MongoDB
- **Authentication**: JWT + Telegram
- **Real-time**: Socket.io WebSockets

## License

MIT
