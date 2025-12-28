// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Detail from './pages/detail'
import Favorites from './pages/favorites' 
import Person from './pages/person'

function App() {
  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: 'white' }}>
     <div className='kar efekti' ></div>
      {/* Yönlendirme Kuralları */}
      <Routes>
        <Route path="/" element={<Home />} />           {/* Ana sayfa açılınca Home'u göster */}
        <Route path="/detay/:id" element={<Detail />} /> {/* /detay/... denilince Detail'i göster */}
        <Route path="/favoriler" element={<Favorites />} />
        <Route path="/kisi/:id" element={<Person />} />
      </Routes>

    </div>
  ) 
}

export default App