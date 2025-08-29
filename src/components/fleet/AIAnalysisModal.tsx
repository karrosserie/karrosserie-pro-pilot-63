import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, Brain } from 'lucide-react';

interface AIAnalysisModalProps {
  open: boolean;
  title?: string;
  description?: string;
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({ 
  open, 
  title = "Analyse IA en cours",
  description = "Lecture et extraction des informations..."
}) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="relative">
            <Brain className="h-16 w-16 text-primary animate-pulse" />
            <Loader2 className="h-6 w-6 text-primary animate-spin absolute top-5 left-5" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          
          <div className="flex space-x-1 mt-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};