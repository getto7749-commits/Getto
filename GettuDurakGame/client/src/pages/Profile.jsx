import { useState, useEffect } from 'react'

function Profile({ user, onBack }) {
  const [referralCode, setReferralCode] = useState('')
  const [referrals, setReferrals] = useState(0)
  const [earnings, setEarnings] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [dailyClaimTime, setDailyClaimTime] = useState(null)

  useEffect(() => {
    fetchProfile()
    fetchLeaderboard()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/users/daily-reward', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.referralCode) {
          setReferralCode(data.referralCode)
          setReferrals(data.referrals)
          setEarnings(data.earnings)
        }
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/users/leaderboard')
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data)
      }
    } catch (error) {
      console.error('Fetch leaderboard error:', error)
    }
  }

  const handleClaimDaily = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/users/daily-reward', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          alert(`✅ Claimed ${data.reward} coins! Streak: ${data.streak}`)
        }
      }
    } catch (error) {
      console.error('Claim daily error:', error)
    }
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    alert('Referral code copied!')
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>👤 Profile</h1>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
      </div>

      {/* User Stats */}
      <div className="card">
        <h2>{user.username}</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginTop: '20px'
        }}>
          <div>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>Level</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{user.level}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>Coins</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffd700' }}>{user.coins}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>Games Won</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>{user.gamesWon}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>Total Winnings</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>{user.totalWinnings}</p>
          </div>
        </div>
      </div>

      {/* Daily Reward */}
      <div className="card">
        <h3>🎁 Daily Reward</h3>
        <button
          className="btn btn-primary"
          onClick={handleClaimDaily}
          style={{ width: '100%', marginTop: '10px' }}
        >
          Claim Daily Reward
        </button>
      </div>

      {/* Referral */}
      <div className="referral-section">
        <h3>🔗 Referral System</h3>
        <p style={{ marginBottom: '15px', fontSize: '14px' }}>
          Invite friends and earn coins!
        </p>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <p style={{ fontSize: '12px', marginBottom: '8px' }}>Your Referral Code:</p>
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <span className="referral-code">{referralCode}</span>
            <button
              className="btn btn-primary"
              onClick={copyReferralCode}
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              Copy
            </button>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px'
        }}>
          <div>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>Friends Invited</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{referrals}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>Earnings</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffd700' }}>+{earnings}</p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card">
        <h3>🏆 Top Players</h3>
        <ul className="leaderboard">
          {leaderboard.map((player, idx) => (
            <li key={idx} className="leaderboard-item">
              <span className="leaderboard-rank">#{idx + 1}</span>
              <span className="leaderboard-name">
                {player.username}
                <span style={{ fontSize: '12px', opacity: 0.7 }}> (Level {player.level})</span>
              </span>
              <span className="leaderboard-score">💰 {player.totalWinnings}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Profile