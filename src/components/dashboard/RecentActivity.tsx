
import React from 'react';
import { FileText, User, Car, CreditCard, Receipt, ClipboardCheck, Wrench, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ActivityItem {
  id: string;
  icon: string;
  iconBackground: string;
  title: string;
  description: string;
  time: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const RecentActivity = ({ activities = [] }: RecentActivityProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="h-4 w-4 text-white" />;
      case 'User':
        return <User className="h-4 w-4 text-white" />;
      case 'Car':
        return <Car className="h-4 w-4 text-white" />;
      case 'CreditCard':
        return <CreditCard className="h-4 w-4 text-white" />;
      case 'Receipt':
        return <Receipt className="h-4 w-4 text-white" />;
      case 'ClipboardCheck':
        return <ClipboardCheck className="h-4 w-4 text-white" />;
      case 'Wrench':
        return <Wrench className="h-4 w-4 text-white" />;
      case 'RotateCcw':
        return <RotateCcw className="h-4 w-4 text-white" />;
      default:
        return <FileText className="h-4 w-4 text-white" />;
    }
  };

  return (
    <div className="card-container animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="section-title">Activité récente</h3>
        <Link to="/activity">
          <Button variant="link" className="text-karrosserie-orange">
            Voir tous
          </Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-start border-b border-gray-100 pb-3 last:border-0"
            >
              <div 
                className={`${activity.iconBackground} p-2 rounded-full mr-3 mt-0.5`}
              >
                {getIcon(activity.icon)}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucune activité récente
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
