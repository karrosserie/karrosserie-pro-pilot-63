
import React from 'react';
import { Car, User, Eye, Pencil, Trash, MoreVertical, FileText, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface VehicleCardProps {
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'En attente' | 'Réservé' | 'En cours' | 'Terminé' | 'Annulé';
  owner: string;
  imageUrl?: string;
  vehicleImages?: string[];
  registrationDocumentFrontUrl?: string;
  registrationDocumentBackUrl?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCreateQuote?: () => void;
  onCreateInvoice?: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  brand,
  model,
  licensePlate,
  status,
  owner,
  imageUrl,
  vehicleImages,
  registrationDocumentFrontUrl,
  registrationDocumentBackUrl,
  onView,
  onEdit,
  onDelete,
  onCreateQuote,
  onCreateInvoice
}) => {
  // Détermine la couleur du statut
  const getStatusColor = () => {
    switch (status) {
      case 'En cours':
        return 'bg-amber-100 text-amber-800';
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-blue-100 text-blue-800';
      case 'Réservé':
        return 'bg-purple-100 text-purple-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFirstImage = () => {
    if (imageUrl) return imageUrl;
    
    if (vehicleImages && vehicleImages.length > 0) {
      if (typeof vehicleImages === 'string') {
        try {
          const parsed = JSON.parse(vehicleImages);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
        } catch {
          return null;
        }
      }
      return Array.isArray(vehicleImages) && vehicleImages.length > 0 ? vehicleImages[0] : null;
    }
    
    return null;
  };

  const firstImage = getFirstImage();
  
  // Vérification correcte des certificats d'immatriculation
  const hasCompleteRegistration = registrationDocumentFrontUrl && 
                                  registrationDocumentFrontUrl.trim() !== '' && 
                                  registrationDocumentBackUrl && 
                                  registrationDocumentBackUrl.trim() !== '';

  const handleCreateQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCreateQuote) {
      onCreateQuote();
    } else {
      console.log('Create quote for vehicle:', licensePlate);
    }
  };

  const handleCreateInvoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCreateInvoice) {
      onCreateInvoice();
    } else {
      console.log('Create invoice for vehicle:', licensePlate);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) {
      onView();
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

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
            className={hasCompleteRegistration ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}
          />
        </div>
      </div>
      
      <div className="border-t border-gray-100 mt-4 pt-4 flex justify-center">
        <div className="flex items-center space-x-1">
          {onView && (
            <Button variant="ghost" size="icon" onClick={handleView}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon"
              className="text-red-500 hover:text-red-700" 
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={handleCreateQuote}>
                <FileText className="h-4 w-4 mr-2" />
                Créer un devis
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreateInvoice}>
                <Receipt className="h-4 w-4 mr-2" />
                Créer une facture
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
