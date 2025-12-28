// src/components/Filmkartı.jsx

function Filmkarti({ ad, puan, resim }) {
  return (
    <div 
      className="film-karti" // <-- İŞTE SİHİR BURADA!
      style={{ 
        width: '200px', 
        backgroundColor: '#222', 
        borderRadius: '10px', 
        overflow: 'hidden', 
        position: 'relative' // Bunu ekledik ki düzgün dursun
      }}
    >
      
      {/* Film Resmi */}
      <img src={resim} alt={ad} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
      
      {/* Puan Kutucuğu (Sol üstte) */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'orange', color: 'black', padding: '5px', borderRadius: '5px', fontWeight: 'bold' }}>
        {puan.toFixed(1)}
      </div>

      {/* Film Adı */}
      <div style={{ padding: '10px' }}>
        <h3 style={{ color: 'white', fontSize: '16px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ad}
        </h3>
      </div>

    </div>
  )
}

export default Filmkarti