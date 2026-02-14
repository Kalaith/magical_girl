import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useUIStore } from '../../stores/uiStore';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  action?: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Magical Girl Adventure!',
    content:
      "Let's get you started on your magical journey. This tutorial will guide you through the basics of the game.",
  },
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    content:
      'This is your main dashboard where you can see your progress, active magical girls, and quick stats.',
  },
  {
    id: 'recruitment',
    title: 'Recruitment System',
    content:
      'Here you can summon new magical girls to join your team. Use different currencies to perform summons.',
  },
  {
    id: 'training',
    title: 'Training & Growth',
    content: 'Train your magical girls to improve their stats and unlock new abilities.',
  },
  {
    id: 'missions',
    title: 'Missions & Battles',
    content: 'Send your magical girls on missions to earn rewards and experience.',
  },
];

export const TutorialOverlay: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { currentView } = useUIStore();

  useEffect(() => {
    // Show tutorial on first visit or when explicitly requested
    const hasSeenTutorial = localStorage.getItem('magical-girl-tutorial-completed');
    if (!hasSeenTutorial && currentView === 'dashboard') {
      setIsVisible(true);
    }
  }, [currentView]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('magical-girl-tutorial-completed', 'true');
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-magical-primary">{step.title}</h2>
              <span className="text-sm text-gray-500">
                {currentStep + 1} / {tutorialSteps.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-magical-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{step.content}</p>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="secondary" onClick={handleSkip} className="text-gray-600">
              Skip Tutorial
            </Button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="secondary" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              <Button variant="primary" onClick={handleNext}>
                {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
