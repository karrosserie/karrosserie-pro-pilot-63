
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
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'User':
        return <User className="h-5 w-5 text-green-600" />;
      case 'Car':
        return <Car className="h-5 w-5 text-orange-600" />;
      case 'CreditCard':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'Receipt':
        return <Receipt className="h-5 w-5 text-green-600" />;
      case 'ClipboardCheck':
        return <ClipboardCheck className="h-5 w-5 text-blue-600" />;
      case 'Wrench':
        return <Wrench className="h-5 w-5 text-gray-600" />;
      case 'RotateCcw':
        return <RotateCcw className="h-5 w-5 text-amber-600" />;
      default:
        return <FileText className="h-5 w-5 text-blue-600" />;
    }
  };

  const getIconBackground = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return 'bg-blue-100';
      case 'User':
        return 'bg-green-100';
      case 'Car':
        return 'bg-orange-100';
      case 'CreditCard':
        return 'bg-purple-100';
      case 'Receipt':
        return 'bg-green-100';
      case 'ClipboardCheck':
        return 'bg-blue-100';
      case 'Wrench':
        return 'bg-gray-100';
      case 'RotateCcw':
        return 'bg-amber-100';
      default:
        return 'bg-blue-100';
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
                className={`${getIconBackground(activity.icon)} p-3 rounded-full mr-3 mt-0.5 flex items-center justify-center`}
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
