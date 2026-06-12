import { useState } from 'react'

export default function InputBox({ onSend, loading }) {
  const [text, setText] = useState('')

  const handle = () => {
    if (!text.trim() || loading) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handle()}
        placeholder="Type a message..."
        disabled={loading}
        style={{
          flex: 1,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: '9px 14px',
          fontSize: 13,
          color: '#f0f4f8',
          outline: 'none',
          fontFamily: 'Inter, sans-serif',
        }}
      />
      <button
        onClick={handle}
        disabled={loading || !text.trim()}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: 'none',
          background: text.trim() ? 'linear-gradient(135deg, #00e5ff, #0090a8)' : 'rgba(255,255,255,0.06)',
          color: text.trim() ? '#fff' : '#445566',
          fontSize: 16,
          cursor: text.trim() ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
      >
        ↑
      </button>
    </div>
  )
}