import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/Card";
import type { CombatLogEntry } from "../../types/combat";

interface CombatLogProps {
  combatLog: CombatLogEntry[];
  maxEntries?: number;
}

interface LogEntryProps {
  entry: CombatLogEntry;
  index: number;
}

const LogEntry: React.FC<LogEntryProps> = ({ entry, index }) => {
  const getEntryIcon = (type: string) => {
    switch (type) {
      case "Action":
        return "⚔️";
      case "Damage":
        return "💥";
      case "Healing":
        return "💚";
      case "Status":
        return "✨";
      case "Movement":
        return "🏃";
      case "Environment":
        return "🌪️";
      case "Victory":
        return "🏆";
      case "Defeat":
        return "💀";
      case "System":
        return "ℹ️";
      default:
        return "📝";
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case "Action":
        return "text-blue-400";
      case "Damage":
        return "text-red-400";
      case "Healing":
        return "text-green-400";
      case "Status":
        return "text-purple-400";
      case "Movement":
        return "text-yellow-400";
      case "Environment":
        return "text-cyan-400";
      case "Victory":
        return "text-green-500";
      case "Defeat":
        return "text-red-500";
      case "System":
        return "text-gray-400";
      default:
        return "text-gray-300";
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour12: false,
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-800 hover:bg-opacity-50 transition-colors"
    >
      {/* Turn Number */}
      <div className="flex-shrink-0 w-8 text-xs text-gray-500 text-center">
        {entry.turn}
      </div>

      {/* Entry Icon */}
      <div className="flex-shrink-0">
        <span className="text-lg">{getEntryIcon(entry.type)}</span>
      </div>

      {/* Entry Content */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm ${getEntryColor(entry.type)}`}>
          {entry.description}
        </div>

        {/* Additional Details */}
        {entry.details && (
          <div className="text-xs text-gray-500 mt-1">
            {typeof entry.details === "object"
              ? Object.entries(entry.details)
                  .slice(0, 3)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ")
              : String(entry.details)}
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-gray-600 mt-1">
          {formatTimestamp(entry.timestamp)}
        </div>
      </div>

      {/* Critical/Special Indicators */}
      {entry.details?.critical && (
        <div className="flex-shrink-0">
          <span className="text-yellow-400 text-sm">💥</span>
        </div>
      )}

      {entry.value !== undefined && (
        <div className="flex-shrink-0 text-sm font-semibold text-white">
          {entry.value > 0 ? "+" : ""}
          {entry.value}
        </div>
      )}
    </motion.div>
  );
};

export const CombatLog: React.FC<CombatLogProps> = ({
  combatLog,
  maxEntries = 20,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [combatLog]);

  const displayEntries = combatLog.slice(-maxEntries);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Combat Log</h3>
          <div className="text-sm text-gray-400">
            {combatLog.length} entries
          </div>
        </div>

        {/* Log Entries */}
        <div
          ref={scrollRef}
          className="space-y-1 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
        >
          {displayEntries.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-gray-400">No combat log entries yet</p>
              <p className="text-gray-500 text-sm">
                Actions and events will appear here
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {displayEntries.map((entry, index) => (
                <LogEntry key={entry.id} entry={entry} index={index} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Log Statistics */}
        {combatLog.length > 0 && (
          <div className="pt-3 border-t border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Actions</div>
                <div className="text-white font-semibold">
                  {combatLog.filter((e) => e.type === "Action").length}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Damage</div>
                <div className="text-white font-semibold">
                  {combatLog.filter((e) => e.type === "Damage").length}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Healing</div>
                <div className="text-white font-semibold">
                  {combatLog.filter((e) => e.type === "Healing").length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Entry Type Legend */}
        <div className="pt-3 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <span>⚔️</span>
              <span>Actions</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>💥</span>
              <span>Damage</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>💚</span>
              <span>Healing</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>✨</span>
              <span>Status</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
