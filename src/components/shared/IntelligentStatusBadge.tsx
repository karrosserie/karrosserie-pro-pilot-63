
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, TrendingUp, Gavel } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusType = 'relance1' | 'relance2' | 'relance3' | 'contentieux' | 'judiciaire' | 'paye' | 'attente' | 'urgent';

interface IntelligentStatusBadgeProps {
  status: StatusType;
  customText?: string;
  showIcon?: boolean;
  showAnimation?: boolean;
  className?: string;
}

const IntelligentStatusBadge: React.FC<IntelligentStatusBadgeProps> = ({
  status,
  customText,
  showIcon = true,
  showAnimation = true,
  className
}) => {
  const getStatusConfig = (status: StatusType) => {
    const configs = {
      relance1: {
        text: customText || '🔵 Relance 1 🤖',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Clock,
        animation: showAnimation ? 'animate-pulse' : ''
      },
      relance2: {
        text: customText || '🟡 Relance 2 🤖',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        animation: showAnimation ? 'animate-pulse' : ''
      },
      relance3: {
        text: customText || '🟠 Relance 3 🤖',
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: AlertCircle,
        animation: showAnimation ? 'animate-pulse' : ''
      },
      contentieux: {
        text: customText || '🔴 Relance 4 🤖',
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertCircle,
        animation: showAnimation ? 'animate-ping' : ''
      },
      judiciaire: {
        text: customText || '⚠️ Contentieux 🤖',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: Gavel,
        animation: showAnimation ? 'animate-pulse' : ''
      },
      paye: {
        text: customText || '✅ Payé',
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: TrendingUp,
        animation: ''
      },
      attente: {
        text: customText || '⏳ En attente',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Clock,
        animation: ''
      },
      urgent: {
        text: customText || '🚨 Urgent',
        className: 'bg-red-200 text-red-900 border-red-300',
        icon: AlertCircle,
        animation: showAnimation ? 'animate-bounce' : ''
      }
    };
    
    return configs[status];
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <Badge 
      className={cn(
        'inline-flex items-center font-medium text-xs px-3 py-1 border',
        config.className,
        config.animation,
        className
      )}
      variant="outline"
    >
      {showIcon && IconComponent && (
        <IconComponent className="h-3 w-3 mr-1" />
      )}
      {config.text}
    </Badge>
  );
};

export default IntelligentStatusBadge;
