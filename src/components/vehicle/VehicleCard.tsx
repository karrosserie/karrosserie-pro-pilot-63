
import React from 'react';
import { Car, Calendar, User, Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehicleCardProps {
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'En réparation' | 'Terminé' | 'En attente' | 'Diagnostic';
  owner: string;
  imageUrl?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  brand,
  model,
  year,
  licensePlate,
  status,
  owner,
  imageUrl,
  onView,
  onEdit,
  onDelete
}) => {
  // Détermine la couleur du statut
  const getStatusColor = () => {
    switch (status) {
      case 'En réparation':
        return 'bg-amber-100 text-amber-800';
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-blue-100 text-blue-800';
      case 'Diagnostic':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card-container flex flex-col h-full animate-fade-in">
      <div className="relative h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={`${brand} ${model}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Car className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor()}`}>
            {status}
          </span>
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-lg">{brand} {model}</h3>
        
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{year}</span>
        </div>
        
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <Car className="h-4 w-4 mr-1" />
          <span>{licensePlate}</span>
        </div>
        
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <User className="h-4 w-4 mr-1" />
          <span>Client: {owner}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between space-x-2">
        {onView && (
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="h-4 w-4 mr-1" />
            Voir
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Modifier
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
