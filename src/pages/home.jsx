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
  
  // --- EKRAN GENİŞLİĞİNİ ÖLÇME ---
  const [ekranGenisligi, setEkranGenisligi] = useState(window.innerWidth)

  const mevcutDil = localStorage.getItem('dil') || 'tr-TR'
  const metinler = {
    'tr-TR': { placeholder: 'Film ara...', araButon: 'ARA', baslik: 'BERKEFLIX', hepsi: 'TÜM TÜRLER' },
    'en-US': { placeholder: 'Search movie...', araButon: 'SEARCH', baslik: 'BERKEFLIX', hepsi: 'ALL GENRES' }
  }

  // --- API KEY ---
  const API_KEY = "74db544a5df45616a48fcb3c944e1314" 

  // Ekran boyutu değişirse güncelle
  useEffect(() => {
    const handleResize = () => setEkranGenisligi(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mobil mi? (768px'den küçükse mobildir)
  const isMobile = ekranGenisligi < 768

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

  // --- STİLLER ---
  const butonStili = {
    width: isMobile ? '100%' : '160px', // Mobilde tam genişlik, PC'de sabit
    padding: '12px 15px',
    backgroundColor: 'rgba(20, 20, 20, 0.8)', 
    border: '1px solid #444', 
    borderRadius: '8px',      
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    outline: 'none',
    textAlign: 'center',
    transition: 'all 0.3s ease', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '1px',
    marginBottom: isMobile ? '10px' : '0' // Mobilde araları aç
  }

  return (
    <div style={{ padding: isMobile ? '15px' : '30px' }}>
      
      <header style={{ 
        position: 'relative', 
        display: 'flex', 
        // MOBİLSE ALT ALTA, DEĞİLSE YAN YANA
        flexDirection: isMobile ? 'column' : 'row', 
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'space-between',
        marginBottom: '40px', 
        gap: isMobile ? '20px' : '0', // Mobilde elemanların arasını aç
        height: isMobile ? 'auto' : '120px' // Mobilde yükseklik serbest
      }}>
        
        {/* --- ORTA BLOK: BAŞLIK (Mobilde En Üste Çıksın Diye Sırayı Değiştirdik) --- */}
        {/* Mobilde 'order' kullanarak sırayı değiştiriyoruz */}
        <h1 
          onClick={() => { setSeciliTur(''); filmleriGetir(); }} 
          className="berkeflix-snow-title" 
          style={{ 
            position: isMobile ? 'static' : 'absolute', // Mobilde sabit dur, PC'de yüz
            left: isMobile ? 'auto' : '50%', 
            transform: isMobile ? 'none' : 'translateX(-50%)', 
            margin: 0, 
            cursor: 'pointer', 
            fontSize: isMobile ? '40px' : '60px', // Mobilde yazıyı küçült
            lineHeight: '1', 
            zIndex: 1,
            top: '10px',
            textAlign: 'center',
            order: isMobile ? 1 : 2 // Mobilde 1. sırada (En üstte)
          }}
        >
          {metinler[mevcutDil].baslik}
        </h1>

        {/* --- SAĞ BLOK: ARAMA (Mobilde Ortaya) --- */}
        <form onSubmit={filmAra} style={{ display: 'flex', gap: '10px', zIndex: 2, width: isMobile ? '100%' : 'auto', order: isMobile ? 2 : 3 }}>
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
              width: isMobile ? '100%' : '220px', // Mobilde tam boy
              backdropFilter: 'blur(5px)'
            }} 
          />
          <button type="submit" style={{ padding: '12px 25px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
            {metinler[mevcutDil].araButon}
          </button>
        </form>

        {/* --- SOL BLOK: BUTONLAR (Mobilde En Alta) --- */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '10px', zIndex: 2, width: isMobile ? '100%' : 'auto', flexWrap: 'wrap', justifyContent: 'center', order: isMobile ? 3 : 1 }}>
          
          <button onClick={dilDegistir} style={{...butonStili, flex: isMobile ? 1 : 'none'}}>
            {mevcutDil === 'tr-TR' ? 'TÜRKÇE' : 'ENGLISH'}
          </button>
          
          <select 
            value={seciliTur} 
            onChange={(e) => setSeciliTur(e.target.value)} 
            style={{...butonStili, flex: isMobile ? 1 : 'none', appearance: 'none', backgroundImage: 'none', textAlignLast: 'center'}} 
          >
            <option value="">{metinler[mevcutDil].hepsi}</option>
            {turler.map(tur => <option key={tur.id} value={tur.id}>{tur.name}</option>)}
          </select>

          {/* Mobilde çıkış butonu tam genişlik olsun */}
          <button onClick={cikisYap} style={{...butonStili, width: isMobile ? '100%' : '160px', borderColor: '#e50914', color: '#ff4d4d'}}>
            {mevcutDil === 'tr-TR' ? 'ÇIKIŞ YAP' : 'LOGOUT'}
          </button>

        </div>

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