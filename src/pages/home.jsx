// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import Filmkarti from '../components/Filmkartı'
import { Link } from 'react-router-dom'

function Home() {
  const [filmler, setFilmler] = useState([])
  const [aramaKelimesi, setAramaKelimesi] = useState("")
  const [turler, setTurler] = useState([]) 
  const [seciliTur, setSeciliTur] = useState('') 

  const mevcutDil = localStorage.getItem('dil') || 'tr-TR'
  const metinler = {
    'tr-TR': { placeholder: 'Film ara...', araButon: 'ARA', baslik: 'BERKEFLIX', hepsi: 'Tüm Filmler' },
    'en-US': { placeholder: 'Search movie...', araButon: 'SEARCH', baslik: 'BERKEFLIX', hepsi: 'All Movies' }
  }

  const API_KEY = "74db544a5df45616a48fcb3c944e1314" 

  const dilDegistir = () => {
    const yeniDil = mevcutDil === 'tr-TR' ? 'en-US' : 'tr-TR'
    localStorage.setItem('dil', yeniDil)
    window.location.reload()
  }

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=${mevcutDil}`)
      .then(res => setTurler(res.data.genres))
  }, [mevcutDil])

  const filmleriGetir = async () => {
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${mevcutDil}`
    if (seciliTur) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${mevcutDil}&with_genres=${seciliTur}`
    }

    const istek1 = axios.get(`${url}&page=1`)
    const istek2 = axios.get(`${url}&page=2`)
    const istek3 = axios.get(`${url}&page=3`)

    const [cevap1, cevap2, cevap3] = await Promise.all([istek1, istek2, istek3])
    setFilmler([...cevap1.data.results, ...cevap2.data.results, ...cevap3.data.results])
  }

  const filmAra = async (e) => {
    e.preventDefault()
    if (aramaKelimesi) {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${aramaKelimesi}&language=${mevcutDil}`)
      setFilmler(response.data.results)
      setSeciliTur('') 
    }
  }

  useEffect(() => {
    filmleriGetir()
  }, [seciliTur, mevcutDil])

  return (
    <div style={{ padding: '20px' }}>
      
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '30px', 
        borderBottom: '1px solid #333', 
        paddingBottom: '20px' 
      }}>
        
        {/* SOL BLOK */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <h1 
            onClick={() => { setSeciliTur(''); filmleriGetir(); }} 
            className="rainbow-text" 
            style={{ margin: 0, cursor: 'pointer', fontSize: '60px', lineHeight: '1' }}
          >
            {metinler[mevcutDil].baslik}
          </h1>

          {/* KONTROLLER (Dil ve Kategori) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* 1. DİL BUTONU */}
            <button 
              onClick={dilDegistir}
              style={{ 
                width: '160px', // SABİT GENİŞLİK (Kategoriyle aynı)
                padding: '10px', 
                background: '#222', 
                border: '1px solid #444', 
                color: 'white', 
                cursor: 'pointer', 
                borderRadius: '5px', 
                fontSize: '14px',
                textAlign: 'left' // Yazıyı sola hizaladık
              }}
            >
              {mevcutDil === 'tr-TR' ? '🌍 DİL: TÜRKÇE' : '🌍 LANG: ENGLISH'}
            </button>

            {/* 2. KATEGORİ SEÇİMİ */}
            <select 
              value={seciliTur} 
              onChange={(e) => setSeciliTur(e.target.value)}
              style={{ 
                width: '160px', // SABİT GENİŞLİK (Butonla aynı)
                padding: '10px', 
                background: '#222', // Renkler aynı
                border: '1px solid #444', 
                borderRadius: '5px', 
                color: 'white', 
                fontSize: '14px', 
                cursor: 'pointer' 
              }}
            >
              <option value="">{metinler[mevcutDil].hepsi}</option>
              {turler.map(tur => (
                <option key={tur.id} value={tur.id}>{tur.name}</option>
              ))}
            </select>

          </div>
        </div>

        {/* SAĞ BLOK (Arama) */}
        <form onSubmit={filmAra} style={{ display: 'flex', gap: '10px', paddingBottom: '10px' }}>
          <input 
            type="text" 
            placeholder={metinler[mevcutDil].placeholder} 
            value={aramaKelimesi}
            onChange={(e) => setAramaKelimesi(e.target.value)}
            style={{ padding: '12px', borderRadius: '5px', border: 'none', outline: 'none', width: '250px' }}
          />
          <button type="submit" style={{ padding: '12px 25px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            {metinler[mevcutDil].araButon}
          </button>
        </form>

      </header>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {filmler.map(film => (
          <Link to={`/detay/${film.id}`} key={film.id} style={{ textDecoration: 'none' }}>
             <Filmkarti 
               ad={film.title} 
               puan={film.vote_average}
               resim={film.poster_path ? "https://image.tmdb.org/t/p/w500" + film.poster_path : "https://via.placeholder.com/500x750?text=Resim+Yok"}
             />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home