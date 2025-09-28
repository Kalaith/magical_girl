import React from "react";
import { Card } from "../ui/Card";

export const RecruitmentView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-magical-primary mb-2">
          Recruitment
        </h1>
        <p className="text-gray-600">
          Summon powerful magical girls to join your team
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-gray-500">Recruitment system is currently being enhanced.</p>
        <p className="text-sm text-gray-400 mt-2">
          Check back soon for powerful summoning features!
        </p>
      </Card>
    </div>
  );
};