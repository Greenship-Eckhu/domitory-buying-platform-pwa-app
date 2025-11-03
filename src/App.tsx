import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNavigation from '@/components/BottomNavigation'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Favorites from '@/pages/Favorites'
import Profile from '@/pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <BottomNavigation />
      </div>
    </BrowserRouter>
  )
}

export default App
