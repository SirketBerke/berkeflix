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
    'tr-TR': { placeholder: 'Film ara...', araButon: 'ARA', baslik: 'BERKEFLIX', hepsi: 'TÜM TÜRLER' },
    'en-US': { placeholder: 'Search movie...', araButon: 'SEARCH', baslik: 'BERKEFLIX', hepsi: 'ALL GENRES' }
  }

  // --- API KEY ---
  const API_KEY = "74db544a5df45616a48fcb3c944e1314" 

  const cikisYap = () => {
    localStorage.removeItem('kullanici')
    window.location.reload()
  }

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

  // --- GÜNCELLENMİŞ BUTON STİLİ ---
  const butonStili = {
    width: '160px',           
    padding: '12px 15px',     // Biraz daha dolgun
    backgroundColor: 'rgba(20, 20, 20, 0.8)', 
    border: '1px solid #444', 
    borderRadius: '8px',      
    color: 'white',           // Tam beyaz yazı
    fontSize: '14px',         // Yazı boyutu arttı
    fontWeight: 'bold',       // KALIN YAZI EKLENDİ
    cursor: 'pointer',
    outline: 'none',
    textAlign: 'center',      // Yazıyı ortaladık
    transition: 'all 0.3s ease', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // İçeriği tam ortala
    letterSpacing: '1px'      // Harf aralığını biraz açtık, daha şık durur
  }

  return (
    <div style={{ padding: '30px' }}>
      
      <header style={{ 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '40px', 
        height: '120px'
      }}>
        
        {/* --- SOL BLOK --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 2 }}>
          
          {/* 1. DİL BUTONU (Logosuz, Kalın) */}
          <button onClick={dilDegistir} style={butonStili} onMouseOver={(e) => e.target.style.borderColor = 'white'} onMouseOut={(e) => e.target.style.borderColor = '#444'}>
            {mevcutDil === 'tr-TR' ? 'TÜRKÇE' : 'ENGLISH'}
          </button>
          
          {/* 2. KATEGORİ SEÇİMİ (Logosuz, Kalın) */}
          <select 
            value={seciliTur} 
            onChange={(e) => setSeciliTur(e.target.value)} 
            style={{...butonStili, appearance: 'none', backgroundImage: 'none', textAlignLast: 'center'}} 
          >
            <option value="">{metinler[mevcutDil].hepsi}</option>
            {turler.map(tur => <option key={tur.id} value={tur.id}>{tur.name}</option>)}
          </select>

          {/* 3. ÇIKIŞ BUTONU (Logosuz, Kalın) */}
          <button onClick={cikisYap} style={{...butonStili, borderColor: '#e50914', color: '#ff4d4d'}} onMouseOver={(e) => e.target.style.backgroundColor = '#330000'} onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(20, 20, 20, 0.8)'}>
            {mevcutDil === 'tr-TR' ? 'ÇIKIŞ YAP' : 'LOGOUT'}
          </button>

        </div>

        {/* --- ORTA BLOK: KARLI BAŞLIK --- */}
        <h1 
          onClick={() => { setSeciliTur(''); filmleriGetir(); }} 
          className="berkeflix-snow-title" 
          style={{ 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            margin: 0, 
            cursor: 'pointer', 
            fontSize: '60px', 
            lineHeight: '1', 
            zIndex: 1,
            top: '10px'
          }}
        >
          {metinler[mevcutDil].baslik}
        </h1>

        {/* --- SAĞ BLOK: ARAMA --- */}
        <form onSubmit={filmAra} style={{ display: 'flex', gap: '10px', zIndex: 2 }}>
          <input 
            type="text" 
            placeholder={metinler[mevcutDil].placeholder} 
            value={aramaKelimesi} 
            onChange={(e) => setAramaKelimesi(e.target.value)} 
            style={{ 
              padding: '12px 20px', 
              borderRadius: '25px',
              border: '1px solid #444', 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              color: 'white', 
              outline: 'none', 
              width: '220px',
              backdropFilter: 'blur(5px)'
            }} 
          />
          <button type="submit" style={{ padding: '12px 25px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
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