import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search, FolderOpen, Link } from 'lucide-react';
import { useDossiers, useLinkToDossier } from '@/hooks/useDossiers';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface LinkToDossierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: 'expertise_report' | 'quote' | 'repair_order' | 'cession' | 'fleet_reservation';
  entityId: string;
  onSuccess?: () => void;
}

export const LinkToDossierModal = ({ 
  open, 
  onOpenChange, 
  entityType,
  entityId,
  onSuccess
}: LinkToDossierModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);
  
  const { data: dossiers, isLoading } = useDossiers({
    archived: false,
  });
  const linkToDossier = useLinkToDossier();

  const filteredDossiers = dossiers?.filter(dossier => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const clientName = dossier.clients 
      ? `${dossier.clients.first_name || ''} ${dossier.clients.last_name || ''}`.toLowerCase()
      : '';
    const vehiclePlate = dossier.vehicles?.license_plate?.toLowerCase() || '';
    const reference = dossier.reference?.toLowerCase() || '';
    const claimNumber = dossier.claim_number?.toLowerCase() || '';
    
    return (
      clientName.includes(search) ||
      vehiclePlate.includes(search) ||
      reference.includes(search) ||
      claimNumber.includes(search)
    );
  }) || [];

  const handleLink = async () => {
    if (!selectedDossierId) return;
    
    try {
      await linkToDossier.mutateAsync({
        dossierId: selectedDossierId,
        entityType,
        entityId,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      // Error handled by the hook
    }
  };

  const getEntityLabel = () => {
    switch (entityType) {
      case 'expertise_report': return "rapport d'expertise";
      case 'quote': return 'devis';
      case 'repair_order': return 'ordre de réparation';
      case 'cession': return 'cession';
      case 'fleet_reservation': return 'réservation flotte';
      default: return 'document';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Lier à un dossier
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Sélectionnez le dossier auquel lier ce {getEntityLabel()}.
        </p>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par client, véhicule, référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Dossiers List */}
          <ScrollArea className="h-[300px] border rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredDossiers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <FolderOpen className="h-8 w-8 mb-2" />
                <p className="text-sm">Aucun dossier trouvé</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredDossiers.map((dossier) => {
                  const clientName = dossier.clients
                    ? dossier.clients.company_name || `${dossier.clients.first_name || ''} ${dossier.clients.last_name || ''}`.trim()
                    : 'Client inconnu';
                  const vehicleInfo = dossier.vehicles
                    ? `${dossier.vehicles.car_brands?.name || ''} ${dossier.vehicles.car_models?.name || ''} - ${dossier.vehicles.license_plate || ''}`.trim()
                    : '';
                  const reference = dossier.reference || `DOS-${dossier.id.slice(0, 8).toUpperCase()}`;
                  
                  return (
                    <div
                      key={dossier.id}
                      onClick={() => setSelectedDossierId(dossier.id)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-colors border",
                        selectedDossierId === dossier.id
                          ? "border-[hsl(var(--karrosserie-orange))] bg-[hsl(var(--karrosserie-orange))]/10"
                          : "border-transparent hover:bg-muted"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm text-foreground">{reference}</p>
                          <p className="text-sm text-muted-foreground">{clientName}</p>
                          {vehicleInfo && (
                            <p className="text-xs text-muted-foreground">{vehicleInfo}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {dossier.created_at && format(new Date(dossier.created_at), 'dd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleLink}
            disabled={!selectedDossierId || linkToDossier.isPending}
            className="flex-1 bg-[hsl(var(--karrosserie-orange))] hover:bg-[hsl(var(--karrosserie-orange))]/90"
          >
            {linkToDossier.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Liaison en cours...
              </>
            ) : (
              <>
                <Link className="h-4 w-4 mr-2" />
                Lier au dossier
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
