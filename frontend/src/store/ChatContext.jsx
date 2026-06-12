import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios'

export const ChatContext = createContext()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function loadHistory() {
  try {
    const saved = localStorage.getItem('m911_chat_history')
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

export function ChatProvider({ children }) {
  const [messages, setMessages]   = useState(loadHistory)
  const [loading, setLoading]     = useState(false)
  const [images, setImages]       = useState([])
  const [topic, setTopic]         = useState('')
  const [sources, setSources]     = useState([])

  useEffect(() => {
    try { localStorage.setItem('m911_chat_history', JSON.stringify(messages)) }
    catch {}
  }, [messages])

  const sendMessage = useCallback(async (question) => {
    if (!question.trim()) return

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    setImages([])
    setSources([])
    setTopic('')

    try {
      const res = await axios.post(`${API_URL}/chat`, { question })
      const data = res.data

      console.log('FULL DATA:', data) // temporary debug

      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString()
      }

      setMessages(prev => [...prev, botMsg])
      setSources(data.sources || [])
      setTopic(data.topic || '')

      // Images directly from /chat response
      if (data.images && data.images.length > 0) {
        setImages(data.images)
      }

    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Connection error. Please check if backend is running.',
        timestamp: new Date().toLocaleTimeString(),
        error: true
      }])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
    setImages([])
    setSources([])
    setTopic('')
    try { localStorage.removeItem('m911_chat_history') } catch {}
  }, [])

  return (
    <ChatContext.Provider value={{
      messages, loading, images, topic, sources,
      sendMessage, clearChat
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)