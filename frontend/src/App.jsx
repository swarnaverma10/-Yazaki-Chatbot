import { useContext, useEffect } from 'react'
import { ChatContext } from './store/ChatContext'
import { useVoice } from './hooks/useVoice'
import AssistantAvatar from './components/AssistantAvatar'
import ChatSidebar from './components/ChatSidebar'
import VoiceControls from './components/VoiceControls'
import Navbar from './components/Navbar'
import './index.css'

export default function App() {
  const { messages, loading, sendMessage, clearChat, images, sources } = useContext(ChatContext)
  const {
    isListening, isSpeaking, speechEnabled,
    toggleMic, toggleSpeech, stopSpeaking,
    transcript, setTranscript, speak
  } = useVoice()

  useEffect(() => {
    if (!speechEnabled) return
    const last = messages[messages.length - 1]
    if (last?.role === 'assistant' && last.content) {
      speak(last.content)
    }
  }, [messages])

  useEffect(() => {
    if (transcript?.trim()) {
      sendMessage(transcript.trim())
      setTranscript('')
    }
  }, [transcript])

  const assistantState = isListening ? 'listening' : isSpeaking ? 'speaking' : loading ? 'thinking' : 'idle'

  return (
    <div className="app-root">
      <Navbar onClear={clearChat} />

      <div className="main-area">
        {/* LEFT — Avatar + Voice Controls */}
        <div className="avatar-section">
          <AssistantAvatar state={assistantState} />
          <VoiceControls
            isListening={isListening}
            isSpeaking={isSpeaking}
            speechEnabled={speechEnabled}
            toggleMic={toggleMic}
            toggleSpeech={toggleSpeech}
            stopSpeaking={stopSpeaking}
            onClear={clearChat}
          />
        </div>

        {/* RIGHT — Chat */}
        <div className="chat-section">
          <ChatSidebar
            messages={messages}
            loading={loading}
            images={[]}
            sources={[]}
            onSend={sendMessage}
          />
        </div>
      </div>
    </div>
  )
}