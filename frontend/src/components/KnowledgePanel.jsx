import { motion } from "framer-motion";
import { BookOpen, Zap, Database } from "lucide-react";

export default function KnowledgePanel({ sources = [] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <motion.div
      className="knowledge-panel"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="kp-header">
        <Database size={14} />
        <span>Knowledge Sources</span>
      </div>
      <div className="kp-sources">
        {sources.map((src, i) => (
          <motion.div
            key={i}
            className="kp-source-chip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <BookOpen size={11} />
            <span>{src}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}