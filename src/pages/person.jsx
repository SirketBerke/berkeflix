// src/pages/Person.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Filmkarti from '../components/Filmkartı'

function Person() {
  const { id } = useParams()
  const [kisi, setKisi] = useState(null)
  const [oynadigiFilmler, setOynadigiFilmler] = useState([])

  // DİL VE ÇEVİRİ
  const mevcutDil = localStorage.getItem('dil') || 'tr-TR'
  const metinler = {
    'tr-TR': { anaSayfa: '← Ana Sayfa', dogum: 'Doğum Tarihi', yer: 'Doğum Yeri', biyo: 'Biyografi', filmografi: 'Filmografisi', bilinmiyor: 'Bilinmiyor', biyoYok: 'Biyografi bulunamadı.' },
    'en-US': { anaSayfa: '← Home', dogum: 'Birthday', yer: 'Place of Birth', biyo: 'Biography', filmografi: 'Filmography', bilinmiyor: 'Unknown', biyoYok: 'No biography available.' }
  }

  const API_KEY = "74db544a5df45616a48fcb3c944e1314" 

  useEffect(() => {
    // Kişi Bilgisi (Dil destekli)
    axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=${mevcutDil}`)
      .then(res => setKisi(res.data))

    // Oynadığı Filmler (Dil destekli)
    axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}&language=${mevcutDil}`)
      .then(res => {
        const siraliFilmler = res.data.cast.sort((a, b) => b.popularity - a.popularity).slice(0, 20)
        setOynadigiFilmler(siraliFilmler)
      })
      
    window.scrollTo(0, 0)
  }, [id, mevcutDil])

  if (!kisi) return <div style={{color:'white', padding:'20px'}}>...</div>

  return (
    <div style={{ padding: '40px', color: 'white' }}>
        
      <Link to="/" style={{ textDecoration: 'none', color: '#e50914', fontWeight: 'bold' }}>
        {metinler[mevcutDil].anaSayfa}
      </Link>

      <div style={{ display: 'flex', gap: '40px', marginTop: '20px', flexWrap: 'wrap' }}>
        <img 
          src={kisi.profile_path ? `https://image.tmdb.org/t/p/w500${kisi.profile_path}` : "https://via.placeholder.com/300x450"} 
          style={{ width: '300px', borderRadius: '15px', boxShadow: '0 0 20px rgba(255,255,255,0.1)' }}
        />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '40px', color: 'orange' }}>{kisi.name}</h1>
          <p><strong>{metinler[mevcutDil].dogum}:</strong> {kisi.birthday || metinler[mevcutDil].bilinmiyor}</p>
          <p><strong>{metinler[mevcutDil].yer}:</strong> {kisi.place_of_birth || metinler[mevcutDil].bilinmiyor}</p>
          
          <h3>{metinler[mevcutDil].biyo}</h3>
          <p style={{ lineHeight: '1.6', color: '#ccc' }}>
            {kisi.biography ? kisi.biography : metinler[mevcutDil].biyoYok}
          </p>
        </div>
      </div>

      <h2 style={{ marginTop: '50px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>{metinler[mevcutDil].filmografi}</h2>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop:'20px' }}>
        {oynadigiFilmler.map(film => (
           <Link to={`/detay/${film.id}`} key={film.id} style={{ textDecoration: 'none' }}>
             <Filmkarti 
               ad={film.title} 
               puan={film.vote_average}
               resim={film.poster_path ? "https://image.tmdb.org/t/p/w500" + film.poster_path : "https://via.placeholder.com/500x750"}
             />
           </Link>
        ))}
      </div>
    </div>
  )
}

export default Person