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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(0,180,216,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(124,58,237,0.07) 0%, transparent 60%), #050d1a',
      overflow: 'hidden',
    }}>

      <Navbar onClear={clearChat} />

      {/* Main area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        padding: '20px 32px',
        overflow: 'hidden',
      }}>

        {/* LEFT — Avatar + name + voice controls stacked */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          flexShrink: 0,
        }}>
          <AssistantAvatar state={assistantState} />

          {/* Voice controls directly below name tag */}
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

        {/* RIGHT — Chat sidebar */}
        <div style={{
          flex: '0 0 380px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>
          <ChatSidebar
            messages={messages}
            loading={loading}
            images={images}
            sources={sources}
            onSend={sendMessage}
          />
        </div>

      </div>
    </div>
  )
}