import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Cloud, 
  CreditCard, 
  Zap, 
  Snowflake,
  TrendingUp,
  Clock,
  Users,
  Eye,
  Package,
  Wrench
} from 'lucide-react';

interface AlertCardProps {
  type: 'critical' | 'important';
  icon: 'weather' | 'payment' | 'power' | 'cooling';
  title: string;
  subtitle?: string;
  description: string;
  impact: string;
  suggestion: string;
  metrics: Array<{
    value: string;
    label: string;
    unit?: string;
  }>;
  actions: Array<{
    label: string;
    variant: 'primary' | 'secondary' | 'outline';
    icon?: React.ReactNode;
  }>;
  className?: string;
}

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'weather': return <Cloud className="h-5 w-5" />;
    case 'payment': return <CreditCard className="h-5 w-5" />;
    case 'power': return <Zap className="h-5 w-5" />;
    case 'cooling': return <Snowflake className="h-5 w-5" />;
    default: return <Cloud className="h-5 w-5" />;
  }
};

const AlertCard: React.FC<AlertCardProps> = ({
  type,
  icon,
  title,
  subtitle,
  description,
  impact,
  suggestion,
  metrics,
  actions,
  className = ""
}) => {
  const isImportant = type === 'important';
  const isCritical = type === 'critical';
  
  const cardBg = isCritical ? 'bg-red-50' : isImportant ? 'bg-yellow-50' : 'bg-blue-50';
  const iconBg = isCritical ? 'bg-red-100' : isImportant ? 'bg-yellow-100' : 'bg-blue-100';
  const iconColor = isCritical ? 'text-red-600' : isImportant ? 'text-yellow-600' : 'text-blue-600';
  const badgeBg = isCritical ? 'bg-red-100 text-red-700' : isImportant ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700';

  return (
    <Card className={`${cardBg} border-0 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        {/* Header avec icône et badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center`}>
              {getIcon(icon)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
              {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${badgeBg}`}>
            {type.toUpperCase()}
          </span>
        </div>

        {/* Impact */}
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-700 mb-1">IMPACT</div>
          <p className="text-sm text-gray-900">{impact}</p>
        </div>

        {/* Suggestion IA */}
        <div className="mb-4 p-3 bg-white/70 rounded-lg border border-white/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">IA</span>
            </div>
            <span className="text-xs font-medium text-blue-600">SUGGESTION IA</span>
          </div>
          <p className="text-sm text-gray-800">{suggestion}</p>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {metric.value}
                {metric.unit && <span className="text-sm font-normal text-gray-600">{metric.unit}</span>}
              </div>
              <div className="text-xs text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {actions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant={action.variant === 'primary' ? 'default' : action.variant === 'secondary' ? 'secondary' : 'outline'}
              className={`text-xs h-8 ${
                action.variant === 'primary' 
                  ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                  : action.variant === 'secondary'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : ''
              }`}
            >
              {action.icon && <span className="mr-1">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCard;