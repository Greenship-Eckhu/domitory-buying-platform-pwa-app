import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

function BottomNavigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/search', icon: '🔍', label: 'Search' },
    { path: '/favorites', icon: '❤️', label: 'Favorites' },
    { path: '/profile', icon: '👤', label: 'Profile' }
  ]

  return (
    <Nav>
      {navItems.map((item) => (
        <NavItem
          key={item.path}
          to={item.path}
          $isActive={location.pathname === item.path}
        >
          <NavIcon $isActive={location.pathname === item.path}>{item.icon}</NavIcon>
          <NavLabel>{item.label}</NavLabel>
        </NavItem>
      ))}
    </Nav>
  )
}

const Nav = styled.nav`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 480px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding: 8px 0;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    background-color: #1c1c1e;
    border-top-color: #38383a;
  }
`

const NavItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 8px;
  text-decoration: none;
  color: ${props => props.$isActive ? '#007AFF' : '#666'};
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: #f5f5f5;
  }

  @media (prefers-color-scheme: dark) {
    color: ${props => props.$isActive ? '#0A84FF' : '#a1a1a6'};

    &:hover {
      background-color: #2c2c2e;
    }
  }
`

const NavIcon = styled.span<{ $isActive: boolean }>`
  font-size: 24px;
  margin-bottom: 4px;
  transition: transform 0.2s ease;
  transform: ${props => props.$isActive ? 'scale(1.1)' : 'scale(1)'};
`

const NavLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
`

export default BottomNavigation
