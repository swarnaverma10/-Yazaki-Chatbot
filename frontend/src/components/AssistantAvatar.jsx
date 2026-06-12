import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AVATAR_IMG = '/avatar.png' // put your avatar image in /public/avatar.png

const stateConfig = {
  idle: {
    ringColor: 'rgba(0, 229, 255, 0.18)',
    glowColor: 'rgba(0, 229, 255, 0.10)',
    label: null,
  },
  listening: {
    ringColor: 'rgba(0, 229, 255, 0.6)',
    glowColor: 'rgba(0, 229, 255, 0.25)',
    label: 'Listening...',
  },
  speaking: {
    ringColor: 'rgba(124, 58, 237, 0.6)',
    glowColor: 'rgba(124, 58, 237, 0.25)',
    label: 'Speaking',
  },
  thinking: {
    ringColor: 'rgba(0, 180, 216, 0.4)',
    glowColor: 'rgba(0, 180, 216, 0.15)',
    label: 'Thinking...',
  },
}

export default function AssistantAvatar({ state = 'idle' }) {
  const cfg = stateConfig[state] || stateConfig.idle

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>

      {/* Outer glow ring */}
      <div style={{ position: 'relative', width: 320, height: 420 }}>

        {/* Ambient glow behind card */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -20,
            borderRadius: 36,
            background: cfg.glowColor,
            filter: 'blur(30px)',
            zIndex: 0,
          }}
        />

        {/* Avatar card */}
        <motion.div
          animate={state === 'idle' ? { y: [0, -8, 0] } : { y: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            borderRadius: 28,
            overflow: 'hidden',
            border: `1.5px solid ${cfg.ringColor}`,
            background: 'linear-gradient(180deg, rgba(10,22,40,0.6) 0%, rgba(5,13,26,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: `0 0 40px ${cfg.glowColor}, 0 20px 60px rgba(0,0,0,0.5)`,
            transition: 'border-color 0.4s, box-shadow 0.4s',
          }}
        >
          {/* Avatar image */}
          <img
            src={AVATAR_IMG}
            alt="AI Assistant"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
            }}
            onError={(e) => { e.target.style.display = 'none' }}
          />

          {/* Bottom gradient overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(5,13,26,0.95) 0%, transparent 100%)',
          }} />

          {/* State label inside card */}
          <AnimatePresence>
            {cfg.label && (
              <motion.div
                key={state}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {/* Waveform bars — shown when speaking */}
                {state === 'speaking' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    {[1, 1.6, 2.2, 1.8, 1.3, 2, 1.5, 1.1, 1.9, 1.4].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ scaleY: [1, h, 1] }}
                        transition={{ duration: 0.5 + i * 0.07, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          width: 3,
                          height: 16,
                          borderRadius: 3,
                          background: 'rgba(124, 58, 237, 0.9)',
                          transformOrigin: 'center',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Ripple dots — shown when listening */}
                {state === 'listening' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    {[0, 0.15, 0.3, 0.45, 0.6, 0.45, 0.3, 0.15, 0].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{ scaleY: [0.4, 1.8, 0.4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay, ease: 'easeInOut' }}
                        style={{
                          width: 3,
                          height: 16,
                          borderRadius: 3,
                          background: 'rgba(0, 229, 255, 0.9)',
                          transformOrigin: 'center',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Thinking spinner */}
                {state === 'thinking' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid rgba(0,180,216,0.2)',
                      borderTop: '2px solid #00b4d8',
                    }}
                  />
                )}

                <span style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: state === 'listening' ? '#00e5ff' : state === 'speaking' ? '#a78bfa' : '#00b4d8',
                  letterSpacing: '0.05em',
                }}>
                  {cfg.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Rotating ring — only when active */}
        {state !== 'idle' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: 36,
              border: `1px dashed ${cfg.ringColor}`,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Name tag below card */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#f0f4f8', letterSpacing: '0.02em' }}>
          M911 Copilot
        </div>
        <div style={{ fontSize: 13, color: 'rgba(0, 229, 255, 0.7)', marginTop: 4 }}>
          AI Assistant · Metaverse911
        </div>
      </div>
    </div>
  )
}