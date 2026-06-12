export default function Navbar({ onClear }) {
  return (
    <div style={{
      height: 58,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(5,13,26,0.8)',
      backdropFilter: 'blur(20px)',
      flexShrink: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #00e5ff, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: '#fff',
        }}>M</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f4f8', letterSpacing: '0.02em' }}>
            Metaverse911
          </div>
          <div style={{ fontSize: 11, color: '#00e5ff', opacity: 0.7 }}>AI Copilot</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#22c55e',
          boxShadow: '0 0 8px #22c55e',
        }} />
        <span style={{ fontSize: 12, color: '#8899aa' }}>Online</span>
      </div>
    </div>
  )
}