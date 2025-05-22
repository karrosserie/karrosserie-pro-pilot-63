
import React from 'react';

interface ExpertiseReportHeaderProps {
  title: string;
  description: string;
}

const ExpertiseReportHeader: React.FC<ExpertiseReportHeaderProps> = ({
  title,
  description
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
};

export default ExpertiseReportHeader;
