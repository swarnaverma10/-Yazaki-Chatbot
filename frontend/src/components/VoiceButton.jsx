import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, StopCircle, Trash2 } from "lucide-react";

export default function VoiceButton({
  isListening,
  isSpeaking,
  speechEnabled,
  onToggleMic,
  onToggleSpeech,
  onStopSpeaking,
  onClearChat,
}) {
  const buttons = [
    {
      id: "mic",
      icon: isListening ? <MicOff size={22} /> : <Mic size={22} />,
      label: isListening ? "Stop Mic" : "Start Mic",
      onClick: onToggleMic,
      active: isListening,
      color: "cyan",
      pulse: isListening,
    },
    {
      id: "speaker",
      icon: speechEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />,
      label: speechEnabled ? "Mute TTS" : "Unmute TTS",
      onClick: onToggleSpeech,
      active: speechEnabled,
      color: "teal",
    },
    {
      id: "stop",
      icon: <StopCircle size={22} />,
      label: "Stop Speaking",
      onClick: onStopSpeaking,
      active: isSpeaking,
      color: "purple",
    },
    {
      id: "clear",
      icon: <Trash2 size={22} />,
      label: "Clear Chat",
      onClick: onClearChat,
      color: "red",
    },
  ];

  return (
    <motion.div
      className="voice-controls"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {buttons.map((btn) => (
        <motion.button
          key={btn.id}
          className={`voice-btn voice-btn--${btn.color} ${btn.active ? "voice-btn--active" : ""}`}
          onClick={btn.onClick}
          whileHover={{ scale: 1.12, y: -3 }}
          whileTap={{ scale: 0.9 }}
          title={btn.label}
        >
          {btn.pulse && (
            <span className="mic-pulse-ring" />
          )}
          {btn.icon}
          <span className="voice-btn-label">{btn.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}