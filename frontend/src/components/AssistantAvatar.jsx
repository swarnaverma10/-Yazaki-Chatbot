import { motion } from 'framer-motion'

export default function AssistantAvatar({ state = 'idle' }) {
  return (
    <div className="avatar-wrapper">
      {/* Avatar image */}
      <motion.div
        animate={state === 'speaking' ? { scale: [1, 1.03, 1] } : { scale: 1 }}
        transition={{ duration: 0.6, repeat: state === 'speaking' ? Infinity : 0 }}
        className="avatar-frame"
        style={{
          border: `2px solid ${
            state === 'listening' ? '#22c55e' :
            state === 'speaking' ? '#00e5ff' :
            state === 'thinking' ? '#7c3aed' :
            'rgba(255,255,255,0.1)'
          }`,
          boxShadow: state !== 'idle' ? `0 0 30px ${
            state === 'listening' ? 'rgba(34,197,94,0.3)' :
            state === 'speaking' ? 'rgba(0,229,255,0.3)' :
            'rgba(124,58,237,0.3)'
          }` : 'none',
        }}
      >
        <img
          src="/ai-avatar.png"
          alt="Yazaki AI Assistant"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none' }}
        />

        {/* Speaking wave overlay */}
        {state === 'speaking' && (
          <div style={{
            position: 'absolute', bottom: 12, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 3, alignItems: 'flex-end',
          }}>
            {[8, 14, 10, 16, 8].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [h * 0.5, h, h * 0.5] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                style={{
                  width: 4, background: '#00e5ff',
                  borderRadius: 2, opacity: 0.8,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Name tag */}
      <div style={{ textAlign: 'center' }}>
        <div className="avatar-name">Yazaki Copilot</div>
        <div className="avatar-subtitle">AI Assistant · Yazaki India</div>
      </div>
    </div>
  )
}