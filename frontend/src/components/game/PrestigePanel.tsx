import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGameStore } from '../../stores/gameStore';

export const PrestigePanel: React.FC = () => {
  const { player } = useGameStore();

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-magical-primary mb-2">Prestige System</h1>
        <p className="text-gray-600">Reset your progress for powerful permanent bonuses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Current Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Level:</span>
              <span className="font-semibold">{player.resources.level}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Experience:</span>
              <span className="font-semibold">{player.resources.experience.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Prestige Level:</span>
              <span className="font-semibold text-magical-primary">0</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Prestige Benefits</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>• Faster experience gain</span>
              <span className="text-green-600">+10% per level</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• Bonus starting resources</span>
              <span className="text-green-600">+25% per level</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• Special prestige abilities</span>
              <span className="text-purple-600">Unlocks at Level 1</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Prestige Simulation</h3>
        <div className="space-y-4">
          <p className="text-gray-600">
            Performing prestige will reset your level and experience, but grant permanent bonuses.
          </p>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold mb-2">If you prestige now:</h4>
            <div className="space-y-1 text-sm">
              <div>• Gain 1 Prestige Level</div>
              <div>• Reset to Level 1</div>
              <div>• Keep all magical girls and items</div>
              <div>• Gain +10% experience bonus permanently</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="primary" disabled={player.resources.level < 50} className="flex-1">
              {player.resources.level < 50 ? 'Requires Level 50' : 'Perform Prestige'}
            </Button>
            <Button variant="secondary" className="flex-1">
              Learn More
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
