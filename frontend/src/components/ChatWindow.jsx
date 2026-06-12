import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../store/ChatContext'

function MessageBubble({ msg }) {
  const isBot = msg.role === 'assistant'
  const [copied, setCopy] = [false, () => {}]

  const copy = () => {
    navigator.clipboard.writeText(msg.content)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: 'flex', gap: '10px',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        marginBottom: '14px', padding: '0 4px'
      }}
    >
      {isBot && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', marginTop: '2px',
          boxShadow: '0 0 10px var(--cyan-glow)'
        }}>⬡</div>
      )}

      <div style={{ maxWidth: '75%' }}>
        <div style={{
          padding: '10px 14px',
          borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
          background: isBot
            ? 'rgba(255,255,255,0.04)'
            : 'linear-gradient(135deg, var(--cyan), var(--teal))',
          border: isBot ? '1px solid var(--border)' : 'none',
          boxShadow: isBot
            ? '0 4px 20px rgba(0,0,0,0.2)'
            : '0 4px 20px rgba(6,182,212,0.3)',
          color: 'var(--text)', fontSize: '13.5px', lineHeight: '1.65'
        }}>
          {isBot ? (
            <ReactMarkdown components={{
              p: ({ children }) => <p style={{ margin: '3px 0' }}>{children}</p>,
              ul: ({ children }) => <ul style={{ margin: '6px 0', paddingLeft: '18px' }}>{children}</ul>,
              li: ({ children }) => <li style={{ margin: '2px 0' }}>{children}</li>,
              strong: ({ children }) => <strong style={{ color: 'var(--cyan)' }}>{children}</strong>,
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>{children}</a>
              )
            }}>
              {msg.content}
            </ReactMarkdown>
          ) : (
            <p style={{ margin: 0 }}>{msg.content}</p>
          )}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          marginTop: '4px', justifyContent: isBot ? 'flex-start' : 'flex-end'
        }}>
          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{msg.timestamp}</span>
          {isBot && (
            <button onClick={copy} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '10px', color: 'var(--muted)', padding: '1px 6px',
              borderRadius: '4px', transition: 'color 0.2s', fontFamily: 'var(--font-body)'
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >Copy</button>
          )}
        </div>
      </div>

      {!isBot && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
          background: 'var(--card)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', marginTop: '2px'
        }}>◈</div>
      )}
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', gap: '10px', marginBottom: '14px', padding: '0 4px' }}
    >
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px',
        background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', boxShadow: '0 0 10px var(--cyan-glow)'
      }}>⬡</div>
      <div style={{
        padding: '10px 16px', borderRadius: '4px 14px 14px 14px',
        background: 'var(--card)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '5px'
      }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cyan)' }}
            animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function WelcomeScreen() {
  const { sendMessage } = useChat()
  const suggestions = [
    "What is HoloBox?",
    "Tell me about VR training solutions",
    "What services does Metaverse911 offer?",
    "What is the AI Kiosk?"
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: '20px', padding: '32px', textAlign: 'center'
      }}
    >
      <div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '22px',
          fontWeight: 700, color: 'white', marginBottom: '8px'
        }}>How can I help you?</h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px', maxWidth: '340px', lineHeight: 1.6 }}>
          Ask me anything about Metaverse911 products, services, and solutions.
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '8px', width: '100%', maxWidth: '440px'
      }}>
        {suggestions.map((q, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02, borderColor: 'var(--cyan)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => sendMessage(q)}
            style={{
              padding: '11px 13px',
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '10px', cursor: 'pointer', color: 'var(--text)',
              fontSize: '12px', textAlign: 'left', lineHeight: 1.4,
              fontFamily: 'var(--font-body)', transition: 'all 0.2s'
            }}
          >
            {q}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export default function ChatWindow({ onSpeakingChange }) {
  const { messages, loading } = useChat()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    const lastMsg = messages[messages.length - 1]
    if (lastMsg?.role === 'assistant' && lastMsg?.content && !lastMsg?.error) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(lastMsg.content)
      utterance.lang = 'en-US'
      utterance.rate = 0.95
      utterance.pitch = 1
      utterance.volume = 1
      utterance.onstart = () => onSpeakingChange?.(true)
      utterance.onend = () => onSpeakingChange?.(false)
      utterance.onerror = () => onSpeakingChange?.(false)
      window.speechSynthesis.speak(utterance)
    }
  }, [messages])

  return (
    <div style={{
      flex: 1, overflowY: 'auto', padding: '20px',
      background: 'transparent'
    }}>
      {messages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <AnimatePresence>
          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
          {loading && <TypingIndicator />}
        </AnimatePresence>
      )}
      <div ref={bottomRef} />
    </div>
  )
}