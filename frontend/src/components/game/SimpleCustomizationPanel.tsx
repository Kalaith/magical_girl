import React from 'react';
import { Card } from '../ui/Card';

export const SimpleCustomizationPanel: React.FC = () => {
  return (
    <Card>
      <div className="p-4">
        <h2 className="text-xl font-bold text-gradient mb-4">Character Customization</h2>
        <p className="text-gray-600">
          Character customization features are being enhanced. Check back soon!
        </p>
      </div>
    </Card>
  );
};
