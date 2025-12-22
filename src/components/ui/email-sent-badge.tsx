import React from 'react';
import { Mail, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface EmailSentBadgeProps {
  className?: string;
}

export const EmailSentBadge: React.FC<EmailSentBadgeProps> = ({ className = '' }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium ${className}`}>
          <Mail className="h-3 w-3" />
          <span className="hidden sm:inline">Envoyé</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Envoyé par email</p>
      </TooltipContent>
    </Tooltip>
  );
};
