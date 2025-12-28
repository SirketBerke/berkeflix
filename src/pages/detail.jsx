// src/pages/Detail.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function Detail() {
  const { id } = useParams()
  const [film, setFilm] = useState(null)
  const [oyuncular, setOyuncular] = useState([])
  const [favoriMi, setFavoriMi] = useState(false)

  // 1. DİL AYARINI AL
  const mevcutDil = localStorage.getItem('dil') || 'tr-TR'

  // 2. ÇEVİRİ SÖZLÜĞÜ
  const metinler = {
    'tr-TR': { 
      yukleniyor: 'Yükleniyor...', 
      anaSayfa: '← Ana Sayfa', 
      favoriler: 'Favorilerim →', 
      oyuncular: 'Oyuncular', 
      ozet: 'Özet',
      dk: 'dk'
    },
    'en-US': { 
      yukleniyor: 'Loading...', 
      anaSayfa: '← Home', 
      favoriler: 'My Favorites →', 
      oyuncular: 'Cast', 
      ozet: 'Overview',
      dk: 'min'
    }
  }

  const API_KEY = "74db544a5df45616a48fcb3c944e1314" 

  useEffect(() => {
    // API isteğinde language=${mevcutDil} kullanıyoruz
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=${mevcutDil}`)
      .then(res => setFilm(res.data))

    axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=${mevcutDil}`)
      .then(res => setOyuncular(res.data.cast.slice(0, 10)))

    const favoriler = JSON.parse(localStorage.getItem('favoriler')) || []
    if (favoriler.some(f => f.id === Number(id))) {
      setFavoriMi(true)
    }
    
    window.scrollTo(0, 0)
  }, [id, mevcutDil]) // Dil değişirse sayfayı yenile

  const favoriIslemi = () => {
    let mevcutListe = JSON.parse(localStorage.getItem('favoriler')) || []
    if (favoriMi) {
      mevcutListe = mevcutListe.filter(f => f.id !== film.id)
      setFavoriMi(false)
    } else {
      mevcutListe.push({ id: film.id, title: film.title, poster_path: film.poster_path, vote_average: film.vote_average })
      setFavoriMi(true)
    }
    localStorage.setItem('favoriler', JSON.stringify(mevcutListe))
  }

  if (!film) return <div style={{color:'white', padding:'20px'}}>{metinler[mevcutDil].yukleniyor}</div>

  return (
    <div style={{ color: 'white', minHeight: '100vh', position: 'relative', paddingBottom: '50px' }}>
      
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '70vh',
        backgroundImage: `url(https://image.tmdb.org/t/p/original${film.backdrop_path})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.3, zIndex: -1,
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))'
      }}></div>

      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* LİNKLER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#e50914', fontSize: '18px', fontWeight: 'bold' }}>
             {metinler[mevcutDil].anaSayfa}
          </Link>
          <Link to="/favoriler" style={{ textDecoration: 'none', color: 'orange', fontSize: '18px', fontWeight: 'bold' }}>
             {metinler[mevcutDil].favoriler}
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '40px', marginTop: '20px', flexWrap: 'wrap' }}>
          <img src={`https://image.tmdb.org/t/p/w500${film.poster_path}`} style={{ borderRadius: '15px', width: '300px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <h1 style={{ fontSize: '45px', margin: 0, lineHeight: '1.1' }}>{film.title}</h1>
              <button onClick={favoriIslemi} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '40px', color: favoriMi ? 'red' : 'gray', transition: 'transform 0.2s' }}>♥</button>
            </div>
            <p style={{ fontSize: '20px', color: '#ccc', fontStyle: 'italic', marginTop: '10px' }}>{film.tagline}</p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
               <span style={{ backgroundColor: '#e50914', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>IMDB: {film.vote_average.toFixed(1)}</span>
               <span style={{ border: '1px solid white', padding: '5px 10px', borderRadius: '5px' }}>{film.release_date.split('-')[0]}</span>
               <span style={{ border: '1px solid white', padding: '5px 10px', borderRadius: '5px' }}>{film.runtime} {metinler[mevcutDil].dk}</span>
            </div>

            <h3 style={{ marginTop: '30px' }}>{metinler[mevcutDil].ozet}</h3>
            <p style={{ lineHeight: '1.8', fontSize: '18px', color: '#ddd' }}>{film.overview}</p>
          </div>
        </div>

        <h2 style={{ marginTop: '60px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>{metinler[mevcutDil].oyuncular}</h2>
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
          {oyuncular.map(oyuncu => (
            <Link to={`/kisi/${oyuncu.id}`} key={oyuncu.id} style={{ textDecoration: 'none', color: 'white' }}>
              <div style={{ minWidth: '130px', textAlign: 'center', cursor: 'pointer' }}>
                {oyuncu.profile_path ? (
                  <img src={`https://image.tmdb.org/t/p/w200${oyuncu.profile_path}`} style={{ width: '100%', borderRadius: '10px', marginBottom: '10px' }} />
                ) : (
                  <div style={{ width: '100%', height: '195px', background: '#333', borderRadius: '10px', marginBottom: '10px' }}></div>
                )}
                <p style={{ fontSize: '15px', fontWeight: 'bold', margin: '0' }}>{oyuncu.name}</p>
                <p style={{ fontSize: '13px', color: '#aaa', margin: '5px 0 0 0' }}>{oyuncu.character}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Detail