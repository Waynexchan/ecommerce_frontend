import React from 'react'
import { useAuthStore } from '../../store/auths'
import { Link } from 'react-router-dom'

function Dashboard() {
    const [isLoggedIn, setIsLoggedIn] = useAuthStore((state) => [
      state.isLoggedIn,
      state.user
    ])
  return (
    <>
      {isLoggedIn()
        ? <div>
            <h1>Dashboard</h1>
            <Link to={`/logout`}>Logout</Link>
        </div>
        : <div>HomePage</div>
      }
    </>
  )
}

export default Dashboard
