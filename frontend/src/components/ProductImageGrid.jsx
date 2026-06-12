import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function ProductImageGrid({ images }) {
  const [selected, setSelected] = useState(null)

  if (!images?.length) return null

  return (
    <>
      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              cursor: 'zoom-out',
            }}
          >
            {/* ✕ Close button */}
            <div
              onClick={e => { e.stopPropagation(); setSelected(null) }}
              style={{
                position: 'fixed',
                top: 20, right: 24,
                width: 36, height: 36,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 18, color: '#fff',
                zIndex: 1001,
                backdropFilter: 'blur(4px)',
              }}
            >
              ✕
            </div>

            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              src={selected}
              style={{
                maxWidth: '85vw', maxHeight: '85vh',
                borderRadius: 16,
                boxShadow: '0 0 60px rgba(0,212,255,0.3)',
                border: '1px solid rgba(0,212,255,0.3)',
                cursor: 'default',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ margin: '12px 0' }}>
        <div style={{
          fontSize: 11, color: '#00D4FF', fontWeight: 600,
          marginBottom: 10, letterSpacing: '0.1em',
        }}>
          PRODUCTS
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: images.length === 1 ? '1fr' : '1fr 1fr',
          gap: 8,
        }}>
          {images.map((img, i) => {
            const src =
              img.url || img.image_url || img.image ||
              img.src || img.path || img.file_url ||
              (typeof img === 'string' ? img : null)

            const name = img.name || img.title || img.product_name || ''
            const desc = img.description || img.desc || ''

            if (!src) return null

            const finalSrc = src.startsWith('http')
              ? src
              : `http://localhost:8000/${src.replace(/^\//, '')}`

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => setSelected(finalSrc)}
                style={{
                  borderRadius: 12, overflow: 'hidden',
                  border: '1px solid rgba(0,212,255,0.15)',
                  background: 'rgba(255,255,255,0.03)',
                  cursor: 'zoom-in',
                }}
              >
                <img
                  src={finalSrc}
                  alt={name || 'Product'}
                  style={{
                    width: '100%',
                    height: images.length === 1 ? 160 : 110,
                    objectFit: 'cover', display: 'block',
                  }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                {(name || desc) && (
                  <div style={{ padding: '8px 10px' }}>
                    {name && (
                      <div style={{
                        fontSize: 12, fontWeight: 600,
                        color: '#e0f7ff', marginBottom: 2,
                      }}>
                        {name}
                      </div>
                    )}
                    {desc && (
                      <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.4 }}>
                        {desc}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </>
  )
}