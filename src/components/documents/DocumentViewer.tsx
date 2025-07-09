
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, X, ExternalLink, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface DocumentViewerProps {
  url: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

export const DocumentViewer = ({ 
  url, 
  open, 
  onOpenChange,
  title = "Document"
}: DocumentViewerProps) => {
  const [iframeError, setIframeError] = useState(false);
  
  if (!url) return null;

  const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i);
  const isPdf = url.match(/\.(pdf)$/i);

  const handleDownload = () => {
    window.open(url as string, '_blank');
  };

  const handleOpenInNewTab = () => {
    window.open(url as string, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex items-center space-x-2">
            {isPdf && (
              <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir dans un nouvel onglet
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-gray-50 rounded-md border min-h-[500px]">
          {isImage ? (
            <div className="flex items-center justify-center h-full">
              <img 
                src={url} 
                alt={title} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : isPdf ? (
            !iframeError ? (
              <div className="w-full h-full">
                <iframe 
                  src={`${url}#view=FitH&toolbar=1&navpanes=0&scrollbar=1`}
                  title={title}
                  className="w-full h-full border-0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  onLoad={() => setIframeError(false)}
                  onError={() => {
                    console.error('Iframe failed to load PDF');
                    setIframeError(true);
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                <AlertCircle className="h-16 w-16 text-orange-500" />
                <div className="text-center">
                  <p className="text-lg font-medium">Impossible d'afficher le PDF</p>
                  <p className="text-sm mt-2">Votre navigateur bloque l'affichage du PDF dans cette fenêtre.</p>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={handleOpenInNewTab}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ouvrir dans un nouvel onglet
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FileText className="h-16 w-16 mb-4" />
              <p>Prévisualisation non disponible</p>
              <Button className="mt-4" onClick={handleDownload}>Télécharger le document</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
