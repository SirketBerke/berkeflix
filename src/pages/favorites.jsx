// src/pages/Favorites.jsx
import { useEffect, useState } from 'react'
import Filmkarti from '../components/Filmkartı'
import { Link } from 'react-router-dom'

function Favorites() {
  const [favoriler, setFavoriler] = useState([])

  useEffect(() => {
    // 1. Tarayıcı hafızasından listeyi oku
    const kaydedilenler = JSON.parse(localStorage.getItem('favoriler')) || []
    setFavoriler(kaydedilenler)
  }, [])

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1 style={{ color: 'white' }}>Favori Listem ❤️</h1>
        <Link to="/" style={{ color: '#e50914', textDecoration: 'none', fontWeight: 'bold' }}>← Ana Sayfaya Dön</Link>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'flex-start' }}>
        
        {favoriler.length > 0 ? (
          favoriler.map(film => (
            <Link to={`/detay/${film.id}`} key={film.id} style={{ textDecoration: 'none' }}>
               <Filmkarti 
                 ad={film.title} 
                 puan={film.vote_average}
                 // Hafızaya sadece yolunu kaydetmiştik, başına adresi ekliyoruz:
                 resim={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
               />
            </Link>
          ))
        ) : (
          <div style={{ color: '#777', width: '100%', textAlign: 'center', marginTop: '50px' }}>
            <h2>Listen henüz boş...</h2>
            <p>Ana sayfaya gidip beğendiğin filmlere kalp atabilirsin.</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Favorites