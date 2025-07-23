import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, Edit, Trash, Check, X } from 'lucide-react';
import { useInterventionSheetsByClient, useDeleteInterventionSheet } from '@/hooks/use-intervention-sheets';
import { InterventionSheet } from '@/services/supabase/intervention-sheets/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import InterventionDialog from '@/components/intervention/InterventionDialog';

interface VehicleInterventionSheetsTabProps {
  vehicleId: string;
  vehicle?: any;
}

const VehicleInterventionSheetsTab: React.FC<VehicleInterventionSheetsTabProps> = ({ vehicleId, vehicle }) => {
  const [selectedSheet, setSelectedSheet] = useState<InterventionSheet | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sheetToDelete, setSheetToDelete] = useState<InterventionSheet | null>(null);
  
  const { data: sheets, isLoading } = useInterventionSheetsByClient(vehicle?.client_id || '');
  const deleteSheet = useDeleteInterventionSheet();

  // Filter sheets for this specific vehicle
  const vehicleSheets = sheets?.filter(sheet => sheet.vehicle_id === vehicleId) || [];

  const handleEditSheet = (sheet: InterventionSheet) => {
    setSelectedSheet(sheet);
    setEditDialogOpen(true);
  };

  const handleDeleteSheet = (sheet: InterventionSheet) => {
    setSheetToDelete(sheet);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSheet = async () => {
    if (sheetToDelete) {
      await deleteSheet.mutateAsync(sheetToDelete.id);
      setDeleteDialogOpen(false);
      setSheetToDelete(null);
    }
  };

  const getApprovalBadge = (isApproved: boolean) => {
    return isApproved ? (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        <Check className="h-3 w-3 mr-1" />
        Approuvée
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
        <X className="h-3 w-3 mr-1" />
        En attente
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="p-4">Chargement des fiches d'intervention...</div>;
  }

  if (vehicleSheets.length === 0) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Aucune fiche d'intervention trouvée pour ce véhicule.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vehicleSheets.map((sheet) => (
        <Card key={sheet.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Fiche d'intervention
                </CardTitle>
                <CardDescription>
                  Créée le {format(new Date(sheet.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {getApprovalBadge(sheet.is_approved)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditSheet(sheet)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteSheet(sheet)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Rapport carrosserie</h4>
                {sheet.carrosserie_reports.length > 0 ? (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {sheet.carrosserie_reports.map((report, index) => (
                      <li key={index}>• {report.text}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun élément</p>
                )}
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Rapport mécanique</h4>
                {sheet.mecanique_reports.length > 0 ? (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {sheet.mecanique_reports.map((report, index) => (
                      <li key={index}>• {report.text}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun élément</p>
                )}
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Rapport électrique</h4>
                {sheet.electrique_reports.length > 0 ? (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {sheet.electrique_reports.map((report, index) => (
                      <li key={index}>• {report.text}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun élément</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Dialog */}
      <InterventionDialog
        client={vehicle?.clients}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        existingSheet={selectedSheet}
        preselectedVehicle={vehicle}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la fiche d'intervention</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette fiche d'intervention ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteSheet}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VehicleInterventionSheetsTab;