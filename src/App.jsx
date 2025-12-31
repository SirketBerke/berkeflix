// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Detail from './pages/detail'
import Favorites from './pages/favorites'
import Person from './pages/person' 
import Login from './pages/login'
import Footer from './components/footer'

function App() {
  // GÜNCELLEME: Hem Local (Kalıcı) hem Session (Geçici) hafızaya bakıyoruz
  const kullaniciVarMi = localStorage.getItem('kullanici') || sessionStorage.getItem('kullanici')

  if (!kullaniciVarMi) {
    return <Login />
  }

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: 'white' }}>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detay/:id" element={<Detail />} />
        <Route path="/favoriler" element={<Favorites />} /> 
        <Route path="/kisi/:id" element={<Person />} /> 
      </Routes>

      <Footer />

    </div>
  )
}

export default App