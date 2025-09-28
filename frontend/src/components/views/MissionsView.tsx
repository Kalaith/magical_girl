import React from "react";
import { Card } from "../ui/Card";

export const MissionsView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-magical-primary mb-2">
          Missions
        </h1>
        <p className="text-gray-600">
          Send your magical girls on exciting adventures
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-gray-500">Mission system is currently being enhanced.</p>
        <p className="text-sm text-gray-400 mt-2">
          Check back soon for exciting quest features!
        </p>
      </Card>
    </div>
  );
};