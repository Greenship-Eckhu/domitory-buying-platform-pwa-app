import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BottomNavigation from '@/components/BottomNavigation'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Favorites from '@/pages/Favorites'
import Profile from '@/pages/Profile'
import AddProduct from '@/pages/AddProduct'

function AppLayout() {
  const location = useLocation()

  // AddProduct 페이지에서는 BottomNavigation 숨김
  const hideBottomNav = location.pathname === '/add-product'

  return (
    <AppContainer>
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
      </MainContent>
      {!hideBottomNav && <BottomNavigation />}
    </AppContainer>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

const AppContainer = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background-color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    box-shadow: none;
  }
`

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  height: 0;
  overflow: hidden;
  position: relative;
`

export default App
