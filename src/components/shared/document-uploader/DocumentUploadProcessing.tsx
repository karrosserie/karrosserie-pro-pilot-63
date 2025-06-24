
import React from 'react';
import { AIProcessingLoader } from '@/components/ui/ai-processing-loader';

interface DocumentUploadProcessingProps {
  progress: number;
  message?: string;
}

export const DocumentUploadProcessing: React.FC<DocumentUploadProcessingProps> = ({
  progress,
  message
}) => {
  return (
    <div className="border rounded-lg p-8 bg-gray-50">
      <AIProcessingLoader 
        progress={progress} 
        message={message}
      />
    </div>
  );
};
