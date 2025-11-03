import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '@/components/BottomNavigation.css'

function BottomNavigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/search', icon: '🔍', label: 'Search' },
    { path: '/favorites', icon: '❤️', label: 'Favorites' },
    { path: '/profile', icon: '👤', label: 'Profile' }
  ]

  return (
    <nav className="bottom-navigation">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default BottomNavigation
