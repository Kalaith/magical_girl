import React from "react";
import { Card } from "../ui/Card";

export const SimpleEnhancedSettingsPanel: React.FC = () => {
  return (
    <Card>
      <div className="p-4">
        <h2 className="text-xl font-bold text-gradient mb-4">
          Enhanced Settings
        </h2>
        <p className="text-gray-600">
          Advanced settings features are being enhanced. Check back soon!
        </p>
      </div>
    </Card>
  );
};
