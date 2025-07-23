import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MoreHorizontal, Edit, Trash, Check, X } from 'lucide-react';
import { useInterventionSheetsByClient, useDeleteInterventionSheet } from '@/hooks/use-intervention-sheets';
import { InterventionSheet } from '@/services/supabase/intervention-sheets/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import InterventionDialog from '@/components/intervention/InterventionDialog';

interface ClientInterventionSheetsTabProps {
  clientId: string;
  client?: any;
}

const ClientInterventionSheetsTab: React.FC<ClientInterventionSheetsTabProps> = ({ clientId, client }) => {
  const [selectedSheet, setSelectedSheet] = useState<InterventionSheet | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const { data: sheets, isLoading } = useInterventionSheetsByClient(clientId);
  const deleteSheet = useDeleteInterventionSheet();

  const handleEditSheet = (sheet: InterventionSheet) => {
    setSelectedSheet(sheet);
    setEditDialogOpen(true);
  };

  const handleDeleteSheet = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche d\'intervention ?')) {
      await deleteSheet.mutateAsync(id);
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

  if (!sheets || sheets.length === 0) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Aucune fiche d'intervention trouvée pour ce client.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sheets.map((sheet) => (
        <Card key={sheet.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Fiche d'intervention - {format(new Date(sheet.created_at), 'dd/MM/yyyy', { locale: fr })}
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
                      onClick={() => handleDeleteSheet(sheet.id)}
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
        client={client}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        existingSheet={selectedSheet}
      />
    </div>
  );
};

export default ClientInterventionSheetsTab;