import { useState, useEffect } from 'react'

function Home({ user, socket, onSelectTable, onOpenProfile, onLogout }) {
  const [tables, setTables] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [tableName, setTableName] = useState('')
  const [minBet, setMinBet] = useState(10)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTables()
    const interval = setInterval(fetchTables, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/games/tables')
      if (response.ok) {
        const data = await response.json()
        setTables(data)
      }
    } catch (error) {
      console.error('Fetch tables error:', error)
    }
  }

  const handleCreateTable = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/games/create-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tableName,
          minBet,
          maxPlayers: 6
        })
      })

      if (response.ok) {
        const data = await response.json()
        setShowCreateModal(false)
        setTableName('')
        setMinBet(10)
        onSelectTable(data.game)
      }
    } catch (error) {
      console.error('Create table error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎴 GettuDurakGame</h1>
        <div className="user-info">
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', marginBottom: '4px' }}>Welcome</p>
            <strong>{user.username}</strong>
          </div>
          <button className="btn btn-secondary" onClick={onOpenProfile}>
            👤 Profile
          </button>
          <button className="btn btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div className="currency">
            <span>🪙 Coins: <strong>{user.coins}</strong></span>
            <span>💎 Diamonds: <strong>{user.diamonds}</strong></span>
            <span>📊 Level: <strong>{user.level}</strong></span>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Create Table
          </button>
        </div>
      </div>

      <h2 style={{ marginBottom: '20px' }}>Available Tables ({tables.length})</h2>
      <div className="grid">
        {tables.map((table) => (
          <div
            key={table.tableId}
            className="table-item"
            onClick={() => onSelectTable(table)}
          >
            <h3>{table.tableName}</h3>
            <p>👥 Players: {table.players.length}/{table.maxPlayers}</p>
            <p>💰 Min Bet: {table.minBet} coins</p>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Join Table →
            </button>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Table</h2>
            <form onSubmit={handleCreateTable}>
              <div className="form-group">
                <label>Table Name</label>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  placeholder="Enter table name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Minimum Bet</label>
                <input
                  type="number"
                  value={minBet}
                  onChange={(e) => setMinBet(Number(e.target.value))}
                  min="10"
                  max="1000"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                  {loading ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home