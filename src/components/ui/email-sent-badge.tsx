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
        <div className={`inline-flex items-center justify-center relative ${className}`}>
          <Mail className="h-4 w-4 text-green-600" />
          <Check className="h-2.5 w-2.5 text-green-600 absolute -bottom-0.5 -right-0.5 bg-white rounded-full" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Envoyé par email</p>
      </TooltipContent>
    </Tooltip>
  );
};
