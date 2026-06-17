import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Login from './pages/Login'
import Home from './pages/Home'
import GameTable from './pages/GameTable'
import Profile from './pages/Profile'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedTable, setSelectedTable] = useState(null)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    // Initialize Telegram Web App
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
    }

    // Connect to Socket.io
    const newSocket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })

    setSocket(newSocket)

    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      fetchProfile(token)
    }

    return () => newSocket.close()
  }, [])

  const fetchProfile = async (token) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
    }
  }

  const handleLogin = (userData, token) => {
    setUser(userData)
    localStorage.setItem('token', token)
    setCurrentPage('home')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    setCurrentPage('home')
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app">
      {currentPage === 'home' && (
        <Home
          user={user}
          socket={socket}
          onSelectTable={(table) => {
            setSelectedTable(table)
            setCurrentPage('game')
          }}
          onOpenProfile={() => setCurrentPage('profile')}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'game' && (
        <GameTable
          table={selectedTable}
          user={user}
          socket={socket}
          onBack={() => setCurrentPage('home')}
        />
      )}
      {currentPage === 'profile' && (
        <Profile
          user={user}
          onBack={() => setCurrentPage('home')}
        />
      )}
    </div>
  )
}

export default App