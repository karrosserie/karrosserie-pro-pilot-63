
import React from 'react';
import { FileText, User, Car, CreditCard } from 'lucide-react';

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  iconBackground: string;
  title: string;
  description: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    icon: <FileText className="h-4 w-4 text-white" />,
    iconBackground: 'bg-blue-500',
    title: 'Devis créé',
    description: 'Renault Clio - Jean Dupont',
    time: 'Il y a 10 minutes'
  },
  {
    id: '2',
    icon: <User className="h-4 w-4 text-white" />,
    iconBackground: 'bg-green-500',
    title: 'Nouveau client',
    description: 'Marie Martin',
    time: 'Il y a 2 heures'
  },
  {
    id: '3',
    icon: <Car className="h-4 w-4 text-white" />,
    iconBackground: 'bg-purple-500',
    title: 'Prêt véhicule',
    description: 'Peugeot 208 - Sophie Bernard',
    time: 'Il y a 3 heures'
  },
  {
    id: '4',
    icon: <CreditCard className="h-4 w-4 text-white" />,
    iconBackground: 'bg-amber-500',
    title: 'Paiement reçu',
    description: 'Facture #F2023-056',
    time: 'Il y a 1 jour'
  }
];

const RecentActivity = () => {
  return (
    <div className="card-container animate-fade-in">
      <h3 className="section-title">Activité récente</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="flex items-start border-b border-gray-100 pb-3 last:border-0"
          >
            <div 
              className={`${activity.iconBackground} p-2 rounded-full mr-3 mt-0.5`}
            >
              {activity.icon}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{activity.title}</h4>
              <p className="text-sm text-gray-600">{activity.description}</p>
            </div>
            
            <div className="text-xs text-gray-400 whitespace-nowrap">
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
