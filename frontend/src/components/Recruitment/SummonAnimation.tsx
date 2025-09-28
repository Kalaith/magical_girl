import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SummonResult } from "../../types/recruitment";
import { Button } from "../ui/Button";

interface SummonAnimationProps {
  onNext: () => SummonResult | null;
  onSkip: () => void;
  currentResult?: SummonResult;
}

const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case "Mythical":
      return "from-red-500 to-pink-600";
    case "Legendary":
      return "from-yellow-400 to-orange-500";
    case "Epic":
      return "from-purple-500 to-purple-700";
    case "Rare":
      return "from-blue-500 to-blue-700";
    case "Uncommon":
      return "from-green-500 to-green-700";
    default:
      return "from-gray-500 to-gray-700";
  }
};

const getRarityParticles = (rarity: string): string => {
  switch (rarity) {
    case "Mythical":
      return "🌟✨💫⭐🔥";
    case "Legendary":
      return "⭐✨💫🌟";
    case "Epic":
      return "✨💜⚡";
    case "Rare":
      return "💙✨";
    case "Uncommon":
      return "💚";
    default:
      return "✨";
  }
};

export const SummonAnimation: React.FC<SummonAnimationProps> = ({
  onNext,
  onSkip,
  currentResult,
}) => {
  const [phase, setPhase] = useState<"intro" | "reveal" | "celebration">(
    "intro",
  );
  const [currentCharacter, setCurrentCharacter] = useState<SummonResult | null>(
    null,
  );
  const [particleElements, setParticleElements] = useState<React.ReactNode[]>(
    [],
  );

  useEffect(() => {
    if (currentResult) {
      setCurrentCharacter(currentResult);
      startAnimation();
    }
  }, [currentResult]);

  const startAnimation = () => {
    setPhase("intro");

    // Intro phase
    setTimeout(() => {
      setPhase("reveal");
    }, 1500);

    // Celebration phase for rare pulls
    setTimeout(() => {
      if (
        currentResult &&
        ["Epic", "Legendary", "Mythical"].includes(currentResult.rarity)
      ) {
        setPhase("celebration");
        generateParticles();
      }
    }, 3000);
  };

  const generateParticles = () => {
    if (!currentCharacter) return;

    const particles = getRarityParticles(currentCharacter.rarity);
    const elements = [];

    for (let i = 0; i < 20; i++) {
      const particle = particles[Math.floor(Math.random() * particles.length)];
      const delay = Math.random() * 2;
      const duration = 2 + Math.random() * 2;
      const startX = Math.random() * 100;
      const endX = Math.random() * 100;
      const startY = 100 + Math.random() * 20;
      const endY = -20 - Math.random() * 20;

      elements.push(
        <motion.div
          key={i}
          className="absolute text-4xl pointer-events-none"
          initial={{ x: `${startX}vw`, y: `${startY}vh`, opacity: 0, scale: 0 }}
          animate={{
            x: `${endX}vw`,
            y: `${endY}vh`,
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration,
            delay,
            ease: "easeOut",
          }}
        >
          {particle}
        </motion.div>,
      );
    }

    setParticleElements(elements);
  };

  const handleNext = () => {
    const nextResult = onNext();
    if (nextResult) {
      setCurrentCharacter(nextResult);
      setPhase("intro");
      setParticleElements([]);
      startAnimation();
    }
  };

  if (!currentCharacter) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
    >
      {/* Particle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particleElements}
      </div>

      {/* Background animation */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(currentCharacter.rarity)} opacity-20`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-lg mx-auto px-4">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="space-y-6"
            >
              <motion.div
                className="text-6xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              >
                🎭
              </motion.div>
              <motion.h2
                className="text-3xl font-bold text-white"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Summoning Magic...
              </motion.h2>
              <motion.div
                className="flex justify-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-white rounded-full"
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {phase === "reveal" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="space-y-6"
            >
              {/* Character card reveal */}
              <motion.div
                className={`relative mx-auto w-80 h-96 bg-gradient-to-br ${getRarityColor(
                  currentCharacter.rarity,
                )} rounded-2xl shadow-2xl overflow-hidden`}
                initial={{ rotateY: 180, scale: 0.8 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Rarity border */}
                <div className="absolute inset-0 border-4 border-opacity-60 rounded-2xl">
                  <div
                    className={`absolute inset-0 border-4 rounded-2xl ${
                      currentCharacter.rarity === "Mythical"
                        ? "border-red-400"
                        : currentCharacter.rarity === "Legendary"
                          ? "border-yellow-400"
                          : currentCharacter.rarity === "Epic"
                            ? "border-purple-400"
                            : currentCharacter.rarity === "Rare"
                              ? "border-blue-400"
                              : currentCharacter.rarity === "Uncommon"
                                ? "border-green-400"
                                : "border-gray-400"
                    }`}
                  />
                </div>

                {/* Character image placeholder */}
                <div className="absolute inset-4 bg-black bg-opacity-20 rounded-xl flex items-center justify-center">
                  <div className="text-8xl">
                    {currentCharacter.character.element === "Fire"
                      ? "🔥"
                      : currentCharacter.character.element === "Water"
                        ? "💧"
                        : currentCharacter.character.element === "Earth"
                          ? "🌱"
                          : currentCharacter.character.element === "Air"
                            ? "💨"
                            : currentCharacter.character.element === "Light"
                              ? "☀️"
                              : currentCharacter.character.element ===
                                  "Darkness"
                                ? "🌙"
                                : "✨"}
                  </div>
                </div>

                {/* Character info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {currentCharacter.character.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300">
                        {currentCharacter.character.element}
                      </span>
                      <span className="text-xs px-2 py-1 bg-purple-600 rounded">
                        {currentCharacter.character.specialization}
                      </span>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i <
                            [
                              "Common",
                              "Uncommon",
                              "Rare",
                              "Epic",
                              "Legendary",
                              "Mythical",
                            ].indexOf(currentCharacter.rarity) +
                              1
                              ? "text-yellow-400"
                              : "text-gray-600"
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* New character indicator */}
                {currentCharacter.isNew && (
                  <motion.div
                    className="absolute top-4 right-4 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    NEW!
                  </motion.div>
                )}

                {/* Rare pull effects */}
                {["Epic", "Legendary", "Mythical"].includes(
                  currentCharacter.rarity,
                ) && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <div className="absolute inset-0 bg-white bg-opacity-20 rounded-2xl" />
                  </motion.div>
                )}
              </motion.div>

              {/* Rarity announcement */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="space-y-2"
              >
                <div
                  className={`text-4xl font-bold ${
                    currentCharacter.rarity === "Mythical"
                      ? "text-red-400"
                      : currentCharacter.rarity === "Legendary"
                        ? "text-yellow-400"
                        : currentCharacter.rarity === "Epic"
                          ? "text-purple-400"
                          : currentCharacter.rarity === "Rare"
                            ? "text-blue-400"
                            : currentCharacter.rarity === "Uncommon"
                              ? "text-green-400"
                              : "text-gray-400"
                  }`}
                >
                  {currentCharacter.rarity.toUpperCase()}
                </div>

                {currentCharacter.wasFeatured && (
                  <motion.div
                    className="text-lg text-yellow-300 font-semibold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ⭐ FEATURED CHARACTER ⭐
                  </motion.div>
                )}

                {currentCharacter.wasGuaranteed && (
                  <motion.div
                    className="text-lg text-orange-300 font-semibold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🎯 PITY ACTIVATED 🎯
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {phase === "celebration" && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <motion.div
                className="text-6xl"
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 360, 720],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎉
              </motion.div>
              <motion.h2
                className="text-4xl font-bold text-yellow-400"
                animate={{
                  scale: [1, 1.1, 1],
                  textShadow: [
                    "0 0 10px rgba(251, 191, 36, 0.5)",
                    "0 0 20px rgba(251, 191, 36, 0.8)",
                    "0 0 10px rgba(251, 191, 36, 0.5)",
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                RARE PULL!
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <Button variant="secondary" onClick={onSkip} className="px-6 py-3">
          Skip All
        </Button>
        <Button variant="primary" onClick={handleNext} className="px-6 py-3">
          Continue
        </Button>
      </div>
    </motion.div>
  );
};
