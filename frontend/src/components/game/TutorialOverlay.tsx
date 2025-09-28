import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import type {
  Tutorial,
  TutorialStep,
  TutorialHighlight,
  TutorialTooltip,
  ContextualHelp
} from '../../types';

interface TutorialHighlightProps {
  highlight: TutorialHighlight;
  children: React.ReactNode;
}

const TutorialHighlightComponent: React.FC<TutorialHighlightProps> = ({ highlight, children }) => {
  const highlightStyles = {
    pulse: 'animate-pulse ring-2 ring-blue-500 ring-opacity-75',
    glow: 'shadow-lg shadow-blue-500/50 ring-2 ring-blue-400',
    bounce: 'animate-bounce ring-2 ring-yellow-500',
    outline: 'ring-2 ring-green-500 ring-offset-2 ring-offset-gray-900'
  };

  return (
    <div className={`relative ${highlightStyles[highlight.type]} rounded-lg`}>
      {children}
      {highlight.label && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
          {highlight.label}
        </div>
      )}
    </div>
  );
};

interface TutorialTooltipProps {
  tooltip: TutorialTooltip;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const TutorialTooltipComponent: React.FC<TutorialTooltipProps> = ({
  tooltip,
  onClose,
  onNext,
  onPrevious
}) => {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  return (
    <motion.div
      className={`absolute z-50 ${positionClasses[tooltip.position]} max-w-sm`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-bold text-white text-sm">{tooltip.title}</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <p className="text-gray-300 text-sm mb-4">{tooltip.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {onPrevious && (
              <button
                onClick={onPrevious}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
              >
                Previous
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Next
              </button>
            )}
          </div>

          {tooltip.optional && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm"
            >
              Skip
            </button>
          )}
        </div>
      </div>

      {/* Arrow pointer */}
      <div
        className={`absolute w-3 h-3 bg-gray-800 border-gray-600 transform rotate-45 ${
          tooltip.position === 'top' ? 'top-full -mt-1.5 border-b border-r' :
          tooltip.position === 'bottom' ? 'bottom-full -mb-1.5 border-t border-l' :
          tooltip.position === 'left' ? 'left-full -ml-1.5 border-b border-r' :
          tooltip.position === 'right' ? 'right-full -mr-1.5 border-t border-l' :
          'hidden'
        }`}
      />
    </motion.div>
  );
};

interface TutorialProgressProps {
  currentStep: number;
  totalSteps: number;
  tutorial: Tutorial;
}

const TutorialProgress: React.FC<TutorialProgressProps> = ({
  currentStep,
  totalSteps,
  tutorial
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        className="bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-4">
          <div className="text-white font-semibold">{tutorial.name}</div>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-sm text-gray-400">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface ContextualHelpButtonProps {
  help: ContextualHelp;
  onShowHelp: (help: ContextualHelp) => void;
}

const ContextualHelpButton: React.FC<ContextualHelpButtonProps> = ({ help, onShowHelp }) => {
  return (
    <button
      onClick={() => onShowHelp(help)}
      className="fixed bottom-4 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      title="Get Help"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  );
};

interface TutorialMenuProps {
  availableTutorials: Tutorial[];
  onSelectTutorial: (tutorialId: string) => void;
  onClose: () => void;
}

const TutorialMenu: React.FC<TutorialMenuProps> = ({
  availableTutorials,
  onSelectTutorial,
  onClose
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Available Tutorials</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableTutorials.map(tutorial => (
            <motion.div
              key={tutorial.id}
              className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-500 cursor-pointer transition-colors"
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                onSelectTutorial(tutorial.id);
                onClose();
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white">{tutorial.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  tutorial.difficulty === 'beginner' ? 'bg-green-600 text-white' :
                  tutorial.difficulty === 'intermediate' ? 'bg-yellow-600 text-black' :
                  'bg-red-600 text-white'
                }`}>
                  {tutorial.difficulty}
                </span>
              </div>

              <p className="text-gray-300 text-sm mb-3">{tutorial.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{tutorial.steps.length} steps</span>
                <span>~{tutorial.estimatedDuration} min</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const TutorialOverlay: React.FC = () => {
  const {
    tutorialState,
    availableTutorials,
    startTutorial,
    nextStep,
    previousStep,
    completeTutorial,
    skipTutorial,
    showHint,
    adaptTutorialDifficulty,
    getContextualHelp
  } = useGameStore();

  const [showTutorialMenu, setShowTutorialMenu] = useState(false);
  const [showContextualHelp, setShowContextualHelp] = useState(false);
  const [contextualHelpData, setContextualHelpData] = useState<ContextualHelp | null>(null);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  const currentTutorial = tutorialState.currentTutorial;
  const currentStep = currentTutorial?.steps[tutorialState.currentStepIndex];

  // Auto-advance for certain step types
  useEffect(() => {
    if (currentStep?.autoAdvance && tutorialState.settings.autoAdvanceSpeed !== 'manual') {
      const delay = tutorialState.settings.autoAdvanceSpeed === 'slow' ? 5000 :
                   tutorialState.settings.autoAdvanceSpeed === 'normal' ? 3000 : 1500;

      const timer = setTimeout(() => {
        nextStep();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentStep, tutorialState.settings.autoAdvanceSpeed, nextStep]);

  // Adaptive difficulty adjustment
  useEffect(() => {
    if (tutorialState.analytics.mistakeCount > 3) {
      adaptTutorialDifficulty('easier');
    } else if (tutorialState.analytics.completionTime < 30 && tutorialState.analytics.mistakeCount === 0) {
      adaptTutorialDifficulty('harder');
    }
  }, [tutorialState.analytics, adaptTutorialDifficulty]);

  const handleShowHelp = useCallback((help: ContextualHelp) => {
    setContextualHelpData(help);
    setShowContextualHelp(true);
  }, []);

  const handleGetContextualHelp = useCallback(() => {
    const help = getContextualHelp('current_screen');
    if (help) {
      handleShowHelp(help);
    }
  }, [getContextualHelp, handleShowHelp]);

  const handleStepValidation = useCallback((stepId: string) => {
    // Implement step validation logic based on step requirements
    // This would check if the user has completed the required action
    return true; // Placeholder
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!currentTutorial) return;

      switch (event.key) {
        case 'Escape':
          if (showTutorialMenu) {
            setShowTutorialMenu(false);
          } else if (currentTutorial) {
            skipTutorial();
          }
          break;
        case 'ArrowRight':
        case ' ':
          if (currentStep && !currentStep.validation?.required) {
            nextStep();
          }
          break;
        case 'ArrowLeft':
          previousStep();
          break;
        case 'h':
          if (event.ctrlKey) {
            event.preventDefault();
            handleGetContextualHelp();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentTutorial, currentStep, nextStep, previousStep, skipTutorial, showTutorialMenu, handleGetContextualHelp]);

  if (!currentTutorial) {
    return (
      <>
        {/* Tutorial Menu Button */}
        <button
          onClick={() => setShowTutorialMenu(true)}
          className="fixed top-4 right-4 z-40 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200"
        >
          Tutorials
        </button>

        {/* Tutorial Menu */}
        <AnimatePresence>
          {showTutorialMenu && (
            <TutorialMenu
              availableTutorials={availableTutorials}
              onSelectTutorial={startTutorial}
              onClose={() => setShowTutorialMenu(false)}
            />
          )}
        </AnimatePresence>

        {/* Contextual Help */}
        <ContextualHelpButton
          help={{} as ContextualHelp}
          onShowHelp={handleGetContextualHelp}
        />

        {/* Contextual Help Modal */}
        <AnimatePresence>
          {showContextualHelp && contextualHelpData && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContextualHelp(false)}
            >
              <motion.div
                className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold text-white mb-3">{contextualHelpData.title}</h3>
                <p className="text-gray-300 mb-4">{contextualHelpData.content}</p>

                {contextualHelpData.quickActions && contextualHelpData.quickActions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-400 mb-2">Quick Actions:</h4>
                    <div className="space-y-2">
                      {contextualHelpData.quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            // Implement quick action
                            setShowContextualHelp(false);
                          }}
                          className="block w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowContextualHelp(false)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      {/* Tutorial Progress */}
      <TutorialProgress
        currentStep={tutorialState.currentStepIndex}
        totalSteps={currentTutorial.steps.length}
        tutorial={currentTutorial}
      />

      {/* Current Step */}
      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step Overlay */}
            {currentStep.overlay && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-75 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}

            {/* Step Tooltip */}
            {currentStep.tooltip && (
              <div className="fixed z-50" style={{
                top: currentStep.tooltip.position === 'center' ? '50%' : 'auto',
                left: currentStep.tooltip.position === 'center' ? '50%' : 'auto',
                transform: currentStep.tooltip.position === 'center' ? 'translate(-50%, -50%)' : 'none'
              }}>
                <TutorialTooltipComponent
                  tooltip={currentStep.tooltip}
                  onClose={skipTutorial}
                  onNext={currentStep.validation?.required ? undefined : nextStep}
                  onPrevious={tutorialState.currentStepIndex > 0 ? previousStep : undefined}
                />
              </div>
            )}

            {/* Step Highlights */}
            {currentStep.highlights && currentStep.highlights.map((highlight, index) => (
              <div
                key={index}
                className="fixed z-30 pointer-events-none"
                style={{
                  top: highlight.bounds?.y,
                  left: highlight.bounds?.x,
                  width: highlight.bounds?.width,
                  height: highlight.bounds?.height
                }}
              >
                <TutorialHighlightComponent highlight={highlight}>
                  <div className="w-full h-full" />
                </TutorialHighlightComponent>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Controls */}
      <div className="fixed bottom-4 left-4 z-50 flex space-x-2">
        <button
          onClick={skipTutorial}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-lg"
        >
          Skip Tutorial
        </button>

        {currentStep?.hints && currentStep.hints.length > 0 && (
          <button
            onClick={() => showHint(currentStep.hints[0].id)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow-lg"
          >
            Show Hint
          </button>
        )}
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="fixed bottom-4 right-20 z-50 text-xs text-gray-400 bg-gray-800 px-3 py-2 rounded">
        <div>Press <kbd className="bg-gray-700 px-1 rounded">Space</kbd> or <kbd className="bg-gray-700 px-1 rounded">→</kbd> for next</div>
        <div>Press <kbd className="bg-gray-700 px-1 rounded">←</kbd> for previous</div>
        <div>Press <kbd className="bg-gray-700 px-1 rounded">Ctrl+H</kbd> for help</div>
        <div>Press <kbd className="bg-gray-700 px-1 rounded">Esc</kbd> to skip</div>
      </div>
    </>
  );
};