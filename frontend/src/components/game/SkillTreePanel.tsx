import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkillTreeStore } from '../../stores/skillTreeStore';
import type { SkillNode, SpecializationPath, SkillTree } from '../../types/skillTree';

interface SkillNodeComponentProps {
  node: SkillNode;
  isAvailable: boolean;
  isSelected: boolean;
  onSelect: (node: SkillNode) => void;
  onLearn: (nodeId: string) => void;
  position: { x: number; y: number };
}

const SkillNodeComponent: React.FC<SkillNodeComponentProps> = ({
  node,
  isAvailable,
  isSelected,
  onSelect,
  onLearn,
  position,
}) => {
  const canLearn = isAvailable && node.currentRank < node.maxRank;

  const tierColors = {
    basic: 'bg-gray-600 border-gray-500',
    intermediate: 'bg-green-600 border-green-500',
    advanced: 'bg-blue-600 border-blue-500',
    expert: 'bg-purple-600 border-purple-500',
    master: 'bg-yellow-600 border-yellow-500',
    legendary: 'bg-red-600 border-red-500',
  };

  const nodeColor =
    node.currentRank > 0
      ? tierColors[node.tier].replace('600', '400').replace('500', '300')
      : isAvailable
        ? tierColors[node.tier]
        : 'bg-gray-800 border-gray-700';

  return (
    <motion.div
      className={`absolute w-16 h-16 rounded-full border-2 cursor-pointer transition-all duration-200 ${nodeColor} ${
        isSelected ? 'ring-2 ring-white ring-opacity-50' : ''
      } ${canLearn ? 'hover:scale-110' : ''}`}
      style={{ left: position.x, top: position.y }}
      whileHover={canLearn ? { scale: 1.1 } : {}}
      whileTap={canLearn ? { scale: 0.95 } : {}}
      onClick={() => onSelect(node)}
      onDoubleClick={() => canLearn && onLearn(node.id)}
    >
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xs font-bold text-white">
          {node.currentRank}/{node.maxRank}
        </span>
      </div>

      {node.currentRank > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}
    </motion.div>
  );
};

interface SkillTreeViewProps {
  tree: SkillTree;
  selectedNode: SkillNode | null;
  onNodeSelect: (node: SkillNode) => void;
  onNodeLearn: (nodeId: string) => void;
}

const SkillTreeView: React.FC<SkillTreeViewProps> = ({
  tree,
  selectedNode,
  onNodeSelect,
  onNodeLearn,
}) => {
  // For now, assume all nodes are available if tree is unlocked
  const getNodeAvailability = (nodeId: string) => {
    const node = tree.nodes.find(n => n.id === nodeId);
    return tree.isUnlocked && node ? node.isLearnable : false;
  };

  const connections = useMemo(() => {
    const lines: Array<{
      from: { x: number; y: number };
      to: { x: number; y: number };
    }> = [];

    tree.nodes.forEach(node => {
      node.prerequisites.forEach(prereq => {
        const prereqNode = tree.nodes.find(n => n.id === prereq.nodeId);
        if (prereqNode && node.position && prereqNode.position) {
          lines.push({
            from: {
              x: prereqNode.position.x + 32,
              y: prereqNode.position.y + 32,
            },
            to: { x: node.position.x + 32, y: node.position.y + 32 },
          });
        }
      });
    });

    return lines;
  }, [tree.nodes]);

  return (
    <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection, index) => (
          <line
            key={index}
            x1={connection.from.x}
            y1={connection.from.y}
            x2={connection.to.x}
            y2={connection.to.y}
            stroke="#4B5563"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
        ))}
      </svg>

      {tree.nodes.map(node => {
        if (!node.position) return null;

        const isAvailable = getNodeAvailability(node.id);
        const isSelected = selectedNode?.id === node.id;

        return (
          <SkillNodeComponent
            key={node.id}
            node={node}
            isAvailable={isAvailable}
            isSelected={isSelected}
            onSelect={onNodeSelect}
            onLearn={onNodeLearn}
            position={node.position}
          />
        );
      })}
    </div>
  );
};

interface SkillNodeDetailsProps {
  node: SkillNode | null;
  onLearn: (nodeId: string) => void;
}

const SkillNodeDetails: React.FC<SkillNodeDetailsProps> = ({ node, onLearn }) => {
  const { getTotalSkillPoints } = useSkillTreeStore();

  if (!node) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-400 text-center">Select a skill node to view details</p>
      </div>
    );
  }

  const isAvailable = node.isLearnable;
  const canLearn = isAvailable && node.currentRank < node.maxRank;
  const skillPoints = getTotalSkillPoints();
  const cost = 1; // Simple cost for now

  return (
    <motion.div
      className="bg-gray-800 p-4 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">{node.name}</h3>
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            node.tier === 'basic'
              ? 'bg-gray-600 text-white'
              : node.tier === 'advanced'
                ? 'bg-blue-600 text-white'
                : node.tier === 'expert'
                  ? 'bg-purple-600 text-white'
                  : node.tier === 'master'
                    ? 'bg-yellow-600 text-black'
                    : 'bg-red-600 text-white'
          }`}
        >
          {node.tier.toUpperCase()}
        </span>
      </div>

      <p className="text-gray-300 mb-4">{node.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Rank:</span>
          <span className="text-white">
            {node.currentRank}/{node.maxRank}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Cost:</span>
          <span className="text-white">{cost} SP</span>
        </div>

        {node.effects && node.effects.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Effects:</h4>
            <ul className="space-y-1">
              {node.effects.map((effect, index) => (
                <li key={index} className="text-sm text-gray-300">
                  • {effect.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {node.prerequisites && node.prerequisites.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Prerequisites:</h4>
            <ul className="space-y-1">
              {node.prerequisites.map((prereq, index) => (
                <li key={index} className="text-sm text-gray-300">
                  • {prereq.requirement || `Node ${prereq.nodeId} (Rank ${prereq.minimumRank})`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {canLearn && (
        <button
          onClick={() => onLearn(node.id)}
          disabled={skillPoints < cost}
          className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
            skillPoints >= cost
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Learn Skill ({cost} SP)
        </button>
      )}

      {!isAvailable && (
        <div className="bg-red-900 bg-opacity-50 p-2 rounded text-red-300 text-sm">
          Prerequisites not met
        </div>
      )}
    </motion.div>
  );
};

export const SkillTreePanel: React.FC = () => {
  const {
    trees,
    learnSkillNode,
    analyzeSkillTree,
    getTotalSkillPoints,
    getUnlockedTrees,
    lastAnalysis,
  } = useSkillTreeStore();

  const [selectedTreeId, setSelectedTreeId] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const availableSkillTrees = getUnlockedTrees();
  const selectedTree = selectedTreeId ? trees[selectedTreeId] : null;
  const skillPoints = getTotalSkillPoints();

  const handleNodeSelect = useCallback((node: SkillNode) => {
    setSelectedNode(node);
  }, []);

  const handleNodeLearn = useCallback(
    (nodeId: string) => {
      if (selectedTreeId) {
        learnSkillNode(selectedTreeId, nodeId);
        // Update selected node with new rank
        if (selectedNode?.id === nodeId && selectedTree) {
          const updatedNode = selectedTree.nodes.find(n => n.id === nodeId);
          if (updatedNode) {
            setSelectedNode(updatedNode);
          }
        }
      }
    },
    [learnSkillNode, selectedNode, selectedTree, selectedTreeId]
  );

  const handleAnalyze = useCallback(() => {
    if (selectedTreeId) {
      analyzeSkillTree(selectedTreeId);
      setShowAnalysis(true);
    }
  }, [analyzeSkillTree, selectedTreeId]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">Skill Trees</h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <select
                value={selectedTreeId}
                onChange={e => {
                  setSelectedTreeId(e.target.value);
                  setSelectedNode(null);
                }}
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              >
                <option value="">Select a skill tree...</option>
                {availableSkillTrees.map(tree => (
                  <option key={tree.id} value={tree.id}>
                    {tree.name} ({tree.element})
                  </option>
                ))}
              </select>

              {selectedTreeId && (
                <button
                  onClick={handleAnalyze}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
                >
                  Analyze Tree
                </button>
              )}
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-400">Skill Points</div>
              <div className="text-xl font-bold text-blue-400">{skillPoints}</div>
            </div>
          </div>
        </div>

        {selectedTree ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <h2 className="text-xl font-bold text-white mb-2">
                  {selectedTree.name} - {selectedTree.element} Element
                </h2>
                <p className="text-gray-300 mb-4">{selectedTree.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTree.specializations.map((path: SpecializationPath) => (
                    <span
                      key={path.id}
                      className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm"
                    >
                      {path.name}
                    </span>
                  ))}
                </div>
              </div>

              <SkillTreeView
                tree={selectedTree}
                selectedNode={selectedNode}
                onNodeSelect={handleNodeSelect}
                onNodeLearn={handleNodeLearn}
              />
            </div>

            <div>
              <SkillNodeDetails node={selectedNode} onLearn={handleNodeLearn} />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Select a skill tree to begin your journey</p>
          </div>
        )}

        <AnimatePresence>
          {showAnalysis && lastAnalysis && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAnalysis(false)}
            >
              <motion.div
                className="bg-gray-800 p-6 rounded-lg max-w-2xl max-h-96 overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">Tree Analysis</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-400">Efficiency Score</h4>
                    <div className="text-2xl font-bold text-green-400">
                      {(lastAnalysis.pointEfficiency * 100).toFixed(1)}%
                    </div>
                  </div>

                  {lastAnalysis.recommendedNodes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-400 mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        {lastAnalysis.recommendedNodes.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            <span>{rec.reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowAnalysis(false)}
                  className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
