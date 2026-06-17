import { useState, useEffect } from 'react'

function GameTable({ table, user, socket, onBack }) {
  const [gameState, setGameState] = useState('waiting')
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [players, setPlayers] = useState(table?.players || [])
  const [tableCards, setTableCards] = useState([])
  const [yourCards, setYourCards] = useState([])

  useEffect(() => {
    if (socket) {
      socket.emit('joinGame', {
        tableId: table.tableId,
        userId: user.id,
        username: user.username
      })

      socket.on('playerJoined', (data) => {
        console.log('Player joined:', data)
      })

      socket.on('gameStarted', (data) => {
        setGameState('playing')
      })

      socket.on('messageReceived', (data) => {
        setMessages(prev => [...prev, data])
      })

      socket.on('cardPlayed', (data) => {
        console.log('Card played:', data)
      })

      socket.emit('getMessages', { tableId: table.tableId })
      socket.on('messagesLoaded', (data) => {
        setMessages(data.messages)
      })

      return () => {
        socket.emit('leaveGame', {
          tableId: table.tableId,
          userId: user.id
        })
        socket.off('playerJoined')
        socket.off('gameStarted')
        socket.off('messageReceived')
        socket.off('cardPlayed')
        socket.off('messagesLoaded')
      }
    }
  }, [socket, table, user])

  const handleSendMessage = () => {
    if (messageInput.trim() && socket) {
      socket.emit('sendMessage', {
        userId: user.id,
        username: user.username,
        message: messageInput,
        tableId: table.tableId
      })
      setMessageInput('')
    }
  }

  const handleStartGame = () => {
    if (socket) {
      socket.emit('startGame', { tableId: table.tableId })
    }
  }

  const handlePlayCard = (card) => {
    if (socket) {
      socket.emit('playCard', {
        tableId: table.tableId,
        userId: user.id,
        username: user.username,
        card
      })
    }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>{table.tableName}</h1>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          {/* Game Area */}
          <div className="card">
            <h2>Game Table</h2>
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '20px',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                {gameState === 'waiting' ? '⏳ Waiting for players to join...' : '🎮 Game in Progress'}
              </p>
              {gameState === 'waiting' && (
                <button
                  className="btn btn-primary"
                  onClick={handleStartGame}
                  disabled={players.length < 2}
                >
                  {players.length < 2 ? 'Need more players' : 'Start Game'}
                </button>
              )}
            </div>

            {/* Your Cards */}
            <div>
              <h3 style={{ marginBottom: '10px' }}>Your Cards:</h3>
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {yourCards.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => handlePlayCard(card)}
                    style={{
                      background: '#667eea',
                      padding: '15px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      border: '2px solid transparent',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.borderColor = '#ffd700'}
                    onMouseOut={(e) => e.target.style.borderColor = 'transparent'}
                  >
                    {card}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Players & Chat */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3>Players ({players.length})</h3>
            <ul style={{ listStyle: 'none' }}>
              {players.map((player, idx) => (
                <li key={idx} style={{
                  padding: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '6px',
                  marginBottom: '5px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>{player.username}</span>
                  <span style={{ color: '#ffd700' }}>💰 {player.coins}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat */}
          <div className="card">
            <h3 style={{ marginBottom: '10px' }}>Chat</h3>
            <div className="chat-container">
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className="chat-message">
                    <span className="username">{msg.username}:</span>
                    <span>{msg.message}</span>
                  </div>
                ))}
              </div>
              <div className="chat-input-area">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type message..."
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameTable