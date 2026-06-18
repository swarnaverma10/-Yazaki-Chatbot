import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InputBox from './InputBox'

function renderMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/#{1,3} (.+)/g, '<span style="font-weight:600;color:#f0f4f8;display:block;margin:6px 0 2px">$1</span>')
    .replace(/\n/g, '<br/>')
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 10,
      }}
    >
      <div style={{
        maxWidth: '88%',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        background: isUser
          ? 'linear-gradient(135deg, rgba(0,229,255,0.18), rgba(0,180,216,0.12))'
          : 'rgba(255,255,255,0.04)',
        border: isUser
          ? '1px solid rgba(0,229,255,0.25)'
          : '1px solid rgba(255,255,255,0.06)',
        fontSize: 13,
        lineHeight: 1.6,
        color: isUser ? '#e0f7ff' : '#c8d8e8',
      }}>
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
      </div>
    </motion.div>
  )
}

export default function ChatSidebar({ messages, loading, onSend }) {
  const bottomRef = useRef(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <motion.div
      animate={{ width: collapsed ? 48 : '100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="chat-sidebar"
    >
      {/* Header */}
      <div className="chat-sidebar-header">
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#00e5ff', boxShadow: '0 0 8px #00e5ff',
            }} />
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#8899aa',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Conversation
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="collapse-btn"
          style={{ marginLeft: collapsed ? 'auto' : 0 }}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Body */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px' }}>
              {messages.length === 0 && (
                <div style={{
                  textAlign: 'center', color: '#445566',
                  fontSize: 13, marginTop: 60, lineHeight: 1.8,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>💬</div>
                  Ask me anything about<br />Domestic Travel Policy
                </div>
              )}

              {messages.map((m, i) => (
                <Message key={m.id || i} msg={m} />
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', gap: 5, padding: '8px 14px', alignItems: 'center' }}
                >
                  {[0, 0.15, 0.3].map((d, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: d }}
                      style={{ width: 7, height: 7, borderRadius: '50%', background: '#00e5ff' }}
                    />
                  ))}
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{
              flexShrink: 0,
              padding: '10px 12px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <InputBox onSend={onSend} loading={loading} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}