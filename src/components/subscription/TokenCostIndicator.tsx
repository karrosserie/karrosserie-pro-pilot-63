import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CoinsIcon, CheckCircleIcon } from 'lucide-react';
import { TokenOperation, getTokenCost, getTokenCostDescription, isFreeOperation } from '@/config/token-costs';

interface TokenCostIndicatorProps {
  operation: TokenOperation;
  className?: string;
  showIcon?: boolean;
  variant?: 'default' | 'compact';
}

const TokenCostIndicator: React.FC<TokenCostIndicatorProps> = ({ 
  operation, 
  className = '',
  showIcon = true,
  variant = 'default'
}) => {
  const cost = getTokenCost(operation);
  const description = getTokenCostDescription(operation);
  const isFree = isFreeOperation(operation);

  if (variant === 'compact') {
    return (
      <Badge 
        variant={isFree ? "secondary" : "outline"} 
        className={`${isFree ? 'bg-green-100 text-green-800 border-green-200' : ''} ${className}`}
      >
        {showIcon && (
          isFree 
            ? <CheckCircleIcon className="w-3 h-3 mr-1" />
            : <CoinsIcon className="w-3 h-3 mr-1" />
        )}
        {isFree ? 'Gratuit' : `${cost} jeton${cost > 1 ? 's' : ''}`}
      </Badge>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && (
        <div className={`p-1 rounded-full ${isFree ? 'bg-green-100' : 'bg-blue-100'}`}>
          {isFree 
            ? <CheckCircleIcon className="w-4 h-4 text-green-600" />
            : <CoinsIcon className="w-4 h-4 text-blue-600" />
          }
        </div>
      )}
      <span className={`text-sm ${isFree ? 'text-green-700' : 'text-gray-700'}`}>
        {description}
      </span>
    </div>
  );
};

export default TokenCostIndicator;