
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
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-sm sm:text-base text-gray-600">{description}</p>
    </div>
  );
};

export default ExpertiseReportHeader;
