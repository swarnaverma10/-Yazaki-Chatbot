import { motion, AnimatePresence } from 'framer-motion'

function CtrlBtn({ onClick, active, color, title, children }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      title={title}
      style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: `1.5px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
        background: active
          ? `radial-gradient(circle, ${color}22, ${color}08)`
          : 'rgba(255,255,255,0.04)',
        color: active ? color : '#8899aa',
        fontSize: 18,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        boxShadow: active ? `0 0 18px ${color}44` : 'none',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </motion.button>
  )
}

export default function VoiceControls({
  isListening, isSpeaking, speechEnabled,
  toggleMic, toggleSpeech, stopSpeaking, onClear
}) {
  return (
    <div style={{
      position: 'relative',   // ← fixed hata, relative lagaya
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 24px',
      background: 'rgba(10, 22, 40, 0.85)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 50,
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    }}>

      <motion.button
        onClick={toggleMic}
        animate={isListening ? {
          boxShadow: ['0 0 0px #00e5ff', '0 0 24px #00e5ff88', '0 0 0px #00e5ff']
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        title={isListening ? 'Stop listening' : 'Start listening'}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: `2px solid ${isListening ? '#00e5ff' : 'rgba(0,229,255,0.3)'}`,
          background: isListening
            ? 'linear-gradient(135deg, rgba(0,229,255,0.25), rgba(0,180,216,0.15))'
            : 'rgba(255,255,255,0.05)',
          color: isListening ? '#00e5ff' : '#8899aa',
          fontSize: 22,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s',
        }}
      >
        {isListening ? '🎙️' : '🎤'}
      </motion.button>

      <CtrlBtn onClick={toggleSpeech} active={speechEnabled} color="#7c3aed" title={speechEnabled ? 'Mute AI' : 'Unmute AI'}>
        {speechEnabled ? '🔊' : '🔇'}
      </CtrlBtn>

      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CtrlBtn onClick={stopSpeaking} active={true} color="#f97316" title="Stop speaking">
              ⏹
            </CtrlBtn>
          </motion.div>
        )}
      </AnimatePresence>

      <CtrlBtn onClick={onClear} active={false} color="#ef4444" title="Clear chat">
        🗑
      </CtrlBtn>
    </div>
  )
}