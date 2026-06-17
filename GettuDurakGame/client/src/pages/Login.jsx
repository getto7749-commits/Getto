import { useState, useEffect } from 'react'

function Login({ onLogin }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Try to get Telegram user data
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const tgUser = window.Telegram.WebApp.initDataUnsafe.user
      handleLogin(tgUser)
    }
  }, [])

  const handleLogin = async (tgUser) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: tgUser.id,
          username: tgUser.username || `User${tgUser.id}`,
          firstName: tgUser.first_name,
          lastName: tgUser.last_name,
          photoUrl: tgUser.photo_url
        })
      })

      if (response.ok) {
        const data = await response.json()
        onLogin(data.user, data.token)
      } else {
        setError('Login failed')
      }
    } catch (err) {
      setError('Connection error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div className="card" style={{
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🎴 GettuDurakGame</h1>
        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          Play Durak with friends in Telegram!
        </p>
        
        {error && (
          <div style={{
            background: 'rgba(255, 0, 0, 0.2)',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#ff6b6b'
          }}>
            {error}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={() => handleLogin(window.Telegram?.WebApp?.initDataUnsafe?.user || {
            id: Math.random(),
            username: 'TestUser'
          })}
          disabled={loading}
          style={{ width: '100%', fontSize: '18px' }}
        >
          {loading ? 'Logging in...' : 'Login with Telegram'}
        </button>
      </div>
    </div>
  )
}

export default Login