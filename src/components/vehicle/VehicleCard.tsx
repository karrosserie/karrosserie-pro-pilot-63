
import React from 'react';
import { Car, User, Edit, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';

interface VehicleCardProps {
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'En réparation' | 'Terminé' | 'En attente' | 'Diagnostic';
  owner: string;
  imageUrl?: string;
  vehicleImages?: string[];
  registrationFrontUrl?: string;
  registrationBackUrl?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  brand,
  model,
  licensePlate,
  status,
  owner,
  imageUrl,
  vehicleImages,
  registrationFrontUrl,
  registrationBackUrl,
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

  // Obtenir la première image disponible
  const getFirstImage = () => {
    if (imageUrl) return imageUrl;
    
    if (vehicleImages && vehicleImages.length > 0) {
      // Parse les images si c'est une chaîne JSON
      if (typeof vehicleImages === 'string') {
        try {
          const parsed = JSON.parse(vehicleImages);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
        } catch {
          return null;
        }
      }
      // Si c'est déjà un tableau
      return Array.isArray(vehicleImages) && vehicleImages.length > 0 ? vehicleImages[0] : null;
    }
    
    return null;
  };

  const firstImage = getFirstImage();
  
  // Check if registration certificate is complete
  const hasCompleteRegistration = registrationFrontUrl && registrationBackUrl;

  return (
    <div className="card-container flex flex-col h-full animate-fade-in">
      <div className="relative h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
        {firstImage ? (
          <img 
            src={firstImage} 
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
          <Car className="h-4 w-4 mr-1" />
          <span>{licensePlate}</span>
        </div>
        
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <User className="h-4 w-4 mr-1" />
          <span>Client: {owner}</span>
        </div>
        
        <div className="mt-2">
          <StatusBadge 
            status={hasCompleteRegistration ? "Certificat d'immatriculation importé" : "Pas de certificat d'immatriculation"}
          />
        </div>
      </div>
      
      <div className="border-t border-gray-100 mt-4 pt-4 flex justify-end space-x-1">
        {onView && (
          <Button variant="ghost" size="icon" onClick={onView}>
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              Créer un devis
            </ContextMenuItem>
            <ContextMenuItem>
              Créer une facture
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </div>
  );
};

export default VehicleCard;
