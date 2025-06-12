
import React, { useEffect } from 'react';
import { FileText, User, Car, CreditCard, Receipt, ClipboardCheck, Wrench, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActivityInfinite } from '@/hooks/use-activity-infinite';

const Activity = () => {
  const { activities, hasMore, loadMore, isLoading } = useActivityInfinite();

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

  // Detect when user scrolls near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        if (hasMore && !isLoading) {
          loadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Activité complète</h1>
        <p className="text-gray-600 mt-1">Historique de toutes les activités du système</p>
      </div>

      <div className="card-container">
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start border-b border-gray-100 pb-4 last:border-0"
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
              Aucune activité trouvée
            </div>
          )}
          
          {hasMore && (
            <div className="text-center pt-4">
              <Button 
                onClick={loadMore} 
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Charger plus'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;
