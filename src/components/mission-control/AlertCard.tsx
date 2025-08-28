import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ActionModal from './modals/ActionModal';
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
  Wrench,
  Building2,
  Calculator,
  Shield,
  Truck,
  Banknote,
  FileText
} from 'lucide-react';

interface AlertCardProps {
  type: 'critical' | 'important';
  icon: 'weather' | 'payment' | 'power' | 'cooling' | 'finance' | 'accounting' | 'insurance' | 'supplier' | 'bank' | 'administration';
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
    modalType?: string;
    modalData?: any;
  }>;
  className?: string;
}

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'weather': return <Cloud className="h-5 w-5" />;
    case 'payment': return <CreditCard className="h-5 w-5" />;
    case 'power': return <Zap className="h-5 w-5" />;
    case 'cooling': return <Snowflake className="h-5 w-5" />;
    case 'finance': return <Building2 className="h-5 w-5" />;
    case 'accounting': return <Calculator className="h-5 w-5" />;
    case 'insurance': return <Shield className="h-5 w-5" />;
    case 'supplier': return <Truck className="h-5 w-5" />;
    case 'bank': return <Banknote className="h-5 w-5" />;
    case 'administration': return <FileText className="h-5 w-5" />;
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
  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    modalType: string;
    modalData: any;
  }>({
    isOpen: false,
    modalType: '',
    modalData: null
  });

  const handleActionClick = (action: any) => {
    if (action.modalType) {
      setActiveModal({
        isOpen: true,
        modalType: action.modalType,
        modalData: action.modalData || { title: action.label }
      });
    }
  };

  const closeModal = () => {
    setActiveModal({ isOpen: false, modalType: '', modalData: null });
  };
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
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              {getIcon(icon)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{title}</h3>
              {subtitle && <p className="text-xs text-gray-600 mt-1 break-words">{subtitle}</p>}
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${badgeBg} flex-shrink-0 ml-2`}>
            <span className="hidden sm:inline">{type.toUpperCase()}</span>
            <span className="sm:hidden">{type === 'critical' ? 'CRIT' : 'IMP'}</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center sm:text-center">
              <div className="text-base sm:text-lg font-bold text-gray-900">
                {metric.value}
                {metric.unit && <span className="text-sm font-normal text-gray-600">{metric.unit}</span>}
              </div>
              <div className="text-xs text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          {actions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant={action.variant === 'primary' ? 'default' : action.variant === 'secondary' ? 'secondary' : 'outline'}
              onClick={() => handleActionClick(action)}
              className={`text-xs h-6 sm:h-8 px-2 sm:px-3 py-1 flex-1 sm:flex-none min-w-0 ${
                action.variant === 'primary' 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : action.variant === 'secondary'
                  ? 'bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white'
                  : ''
              }`}
            >
              {action.icon && <span className="mr-1 hidden sm:inline">{action.icon}</span>}
              <span className="truncate text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>

      <ActionModal
        isOpen={activeModal.isOpen}
        onClose={closeModal}
        actionType={activeModal.modalType}
        modalData={activeModal.modalData}
      />
    </Card>
  );
};

export default AlertCard;