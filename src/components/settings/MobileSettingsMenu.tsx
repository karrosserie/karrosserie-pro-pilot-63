import React from 'react';
import { ChevronRight, User, Sliders, Users, FileText, Bot, CreditCard } from 'lucide-react';

interface SettingsCategory {
  value: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface MobileSettingsMenuProps {
  onSelectCategory: (category: string) => void;
  hasFullAccess: boolean;
}

const MobileSettingsMenu: React.FC<MobileSettingsMenuProps> = ({ 
  onSelectCategory, 
  hasFullAccess 
}) => {
  const allCategories: SettingsCategory[] = [
    {
      value: 'account',
      label: 'Entreprise',
      description: 'Informations de votre société',
      icon: User,
    },
    {
      value: 'preferences',
      label: 'Préférences',
      description: 'Documents, références, mentions',
      icon: Sliders,
    },
    {
      value: 'team',
      label: 'Équipe',
      description: 'Gérer les membres',
      icon: Users,
    },
    {
      value: 'templates',
      label: 'Templates',
      description: 'Modèles de documents',
      icon: FileText,
    },
    {
      value: 'relance-ia',
      label: 'Relance IA',
      description: 'Automatisation des relances',
      icon: Bot,
    },
  ];

  const subscriptionCategory: SettingsCategory = {
    value: 'subscription',
    label: 'Abonnement',
    description: 'Plan et facturation',
    icon: CreditCard,
  };

  const categories = hasFullAccess 
    ? [...allCategories, subscriptionCategory]
    : [subscriptionCategory];

  return (
    <div className="bg-background">
      <div className="divide-y divide-border">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.value}
              className="w-full flex items-center gap-5 p-5 active:bg-muted/50 transition-colors"
              onClick={() => onSelectCategory(category.value)}
            >
              <div className="p-3 rounded-xl bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-base text-foreground">{category.label}</p>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSettingsMenu;
