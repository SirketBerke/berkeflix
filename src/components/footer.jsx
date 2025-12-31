

function Footer() {
  return (
    <footer style={{ 
      backgroundColor: 'black', 
      padding: '40px 20px', 
      textAlign: 'center', 
      color: '#757575', 
      marginTop: '50px',
      borderTop: '1px solid #333'
    }}>
      
      {/* Üst Kısım: Linkler */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px', fontSize: '14px', flexWrap: 'wrap' }}>
        <span style={{ cursor: 'pointer' }}>Hakkımızda</span>
        <span style={{ cursor: 'pointer' }}>İletişim</span>
        <span style={{ cursor: 'pointer' }}>Gizlilik Politikası</span>
        <span style={{ cursor: 'pointer' }}>Kullanım Şartları</span>
        <span style={{ cursor: 'pointer' }}>Yardım Merkezi</span>
      </div>

      {/* Orta Kısım: Sosyal Medya (Göstermelik) */}
      <div style={{ marginBottom: '20px', fontSize: '20px', letterSpacing: '10px' }}>
      </div>

      {/* Alt Kısım: İmza */}
      <p style={{ fontSize: '12px' }}>
        © 2025 <strong>BERKEFLIX</strong> Inc. <br />
        <span style={{ fontSize: '10px', color: '#555' }}>Designed by Berke</span>
      </p>

    </footer>
  )
}

export default Footer