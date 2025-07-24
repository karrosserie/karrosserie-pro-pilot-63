
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileIcon, DownloadIcon, Trash } from 'lucide-react';
import { getFilename, isImageFile, handleDownload } from './utils/documentUtils';

interface DocumentDisplayProps {
  documentUrl: string;
  isViewMode: boolean;
  isDeleting: boolean;
  isAnalyzing?: boolean;
  onDelete: () => void;
  customContent?: React.ReactNode;
}

export const DocumentDisplay: React.FC<DocumentDisplayProps> = ({
  documentUrl,
  isViewMode,
  isDeleting,
  isAnalyzing = false,
  onDelete,
  customContent
}) => {
  const isImage = isImageFile(documentUrl);

  if (isImage) {
    return (
      <div className="border rounded-lg p-4">
        <div className="mb-4">
          <img 
            src={documentUrl} 
            alt="Document" 
            className="max-h-40 mx-auto object-contain" 
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isAnalyzing ? (
              <div className="flex items-center text-karrosserie-orange">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Analyse en cours...</span>
              </div>
            ) : (
              customContent
            )}
          </div>
          {!isViewMode && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownload(documentUrl)}
              >
                <DownloadIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onDelete}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-600"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center">
        <FileIcon className="h-10 w-10 text-blue-500 mr-4" />
        <div className="flex-1">
          <p className="font-medium truncate">{getFilename(documentUrl)}</p>
          <p className="text-xs text-gray-500">Document téléchargé</p>
        </div>
        {!isViewMode && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload(documentUrl)}
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-600"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
