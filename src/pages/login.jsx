// src/pages/Login.jsx
import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState("")
  const [sifre, setSifre] = useState("")
  
  // YENİ ÖZELLİKLER İÇİN STATE'LER
  const [kayitModu, setKayitModu] = useState(false) // false: Giriş, true: Kayıt
  const [beniHatirla, setBeniHatirla] = useState(true) // Varsayılan: İşaretli

  const islemYap = (e) => {
    e.preventDefault()

    if(email.length < 5 || sifre.length < 3) {
      alert("Lütfen geçerli bir e-posta ve en az 3 haneli şifre girin.")
      return
    }

    // --- SENARYO 1: KAYIT OLMA ---
    if (kayitModu) {
      // Mevcut kullanıcıları çek
      const mevcutKullanicilar = JSON.parse(localStorage.getItem('users')) || []
      
      // Bu e-posta daha önce alınmış mı?
      const kullaniciVarMi = mevcutKullanicilar.find(user => user.email === email)
      
      if (kullaniciVarMi) {
        alert("Bu e-posta adresi zaten kayıtlı! Lütfen giriş yapın.")
      } else {
        // Yeni kullanıcıyı listeye ekle
        mevcutKullanicilar.push({ email, sifre })
        localStorage.setItem('users', JSON.stringify(mevcutKullanicilar))
        alert("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.")
        setKayitModu(false) // Giriş ekranına geri döndür
        setSifre("") // Şifreyi temizle
      }
    } 
    
    // --- SENARYO 2: GİRİŞ YAPMA ---
    else {
      const mevcutKullanicilar = JSON.parse(localStorage.getItem('users')) || []
      // E-posta ve şifre eşleşiyor mu kontrol et
      const dogruKullanici = mevcutKullanicilar.find(user => user.email === email && user.sifre === sifre)

      if (dogruKullanici) {
        // BAŞARILI GİRİŞ
        if (beniHatirla) {
          localStorage.setItem('kullanici', JSON.stringify(dogruKullanici)) // Kalıcı Hafıza
        } else {
          sessionStorage.setItem('kullanici', JSON.stringify(dogruKullanici)) // Geçici Hafıza (Tarayıcı kapanınca silinir)
        }
        window.location.reload()
      } else {
        // HATALI GİRİŞ
        alert("Hatalı E-posta veya Şifre! (Eğer kayıt olmadıysanız önce kayıt olun)")
      }
    }
  }

  return (
    <div style={{ 
      height: '100vh', 
      width: '100%', 
      backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/TR-tr-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)' }}></div>

      <div style={{ 
        position: 'relative',
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: '60px 40px', 
        borderRadius: '10px', 
        zIndex: 1, 
        width: '400px',
        color: 'white',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>

        {/* ARKA PLAN LOGOSU */}
        <h1 style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            margin: 0, fontSize: '90px', fontWeight: '900', color: 'rgba(229, 9, 20, 0.15)',
            zIndex: 0, pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap', fontFamily: 'Arial Black, sans-serif'
        }}>
            BERKEFLIX
        </h1>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: 'bold' }}>
              {kayitModu ? "Kayıt Ol" : "Oturum Aç"}
            </h2>
            
            <form onSubmit={islemYap} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input 
                  type="email" 
                  placeholder="E-posta veya telefon numarası" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: '16px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#333', color: 'white', fontSize: '16px', outline: 'none' }}
              />
              
              <input 
                  type="password" 
                  placeholder="Parola" 
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  style={{ padding: '16px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#333', color: 'white', fontSize: '16px', outline: 'none' }}
              />
              
              <button type="submit" style={{ padding: '16px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', marginTop: '20px', transition: 'background 0.2s' }}>
                {kayitModu ? "Kayıt Ol" : "Oturum Aç"}
              </button>
            </form>

            <div style={{ color: '#aaa', marginTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', alignItems: 'center' }}>
                
                {/* --- BENİ HATIRLA (ÇALIŞIYOR) --- */}
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect:'none' }}>
                  <input 
                    type="checkbox" 
                    checked={beniHatirla}
                    onChange={(e) => setBeniHatirla(e.target.checked)}
                    style={{ marginRight: '5px', width:'16px', height:'16px', accentColor: '#737373' }} 
                  />
                  Beni hatırla
                </label>

                <span style={{ cursor:'pointer' }}>Yardım ister misiniz?</span>
            </div>

            {/* --- KAYIT MODUNA GEÇİŞ --- */}
            <p style={{ color: '#737373', marginTop: '30px', fontSize: '16px' }}>
              {kayitModu ? "Zaten hesabınız var mı?" : "Berkeflix'e yeni misiniz?"} 
              {' '}
              <span 
                onClick={() => setKayitModu(!kayitModu)} // Tıklayınca modu değiştir
                style={{ color: 'white', cursor: 'pointer', fontWeight:'bold' }}
              >
                 {kayitModu ? "Oturum Açın." : "Şimdi katılın."}
              </span>
            </p>
        </div>

      </div>

    </div>
  )
}

export default Login