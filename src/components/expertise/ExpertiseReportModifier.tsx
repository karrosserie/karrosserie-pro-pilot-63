import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, X, AlertTriangle, FileWarning, Loader2, RefreshCw } from 'lucide-react';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { useExpertiseReportModify } from '@/hooks/use-expertise-report-modify';
import { Badge } from '@/components/ui/badge';

interface ExpertiseReportModifierProps {
  report: ExpertiseReport | null;
  open: boolean;
  onClose: () => void;
}

interface Dependencies {
  hasSignedRepairOrder: boolean;
  quotes: { id: string; reference: string }[];
  repairOrders: { id: string; reference: string; status: string }[];
}

export const ExpertiseReportModifier: React.FC<ExpertiseReportModifierProps> = ({
  report,
  open,
  onClose
}) => {
  const { modifyReport, checkDependencies, isCheckingDependencies, isModifying } = useExpertiseReportModify();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dependencies, setDependencies] = useState<Dependencies | null>(null);
  const [dependencyError, setDependencyError] = useState<string | null>(null);

  // Vérifier les dépendances à l'ouverture
  useEffect(() => {
    if (open && report) {
      setSelectedFile(null);
      setDependencies(null);
      setDependencyError(null);
      
      checkDependencies(report.id)
        .then(deps => {
          setDependencies(deps);
          if (deps.hasSignedRepairOrder) {
            setDependencyError('Ce rapport est lié à un ordre de réparation signé. La modification n\'est pas autorisée.');
          }
        })
        .catch(err => {
          console.error('Error checking dependencies:', err);
          setDependencyError('Erreur lors de la vérification des dépendances');
        });
    }
  }, [open, report]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleModify = async () => {
    if (!report || !selectedFile) return;

    await modifyReport.mutateAsync({ report, file: selectedFile });
    onClose();
  };

  const canModify = !dependencies?.hasSignedRepairOrder && selectedFile && !isModifying;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-orange-500" />
            Modifier le rapport d'expertise
          </DialogTitle>
          <DialogDescription>
            Téléchargez un nouveau PDF pour remplacer le document actuel et relancer l'analyse.
          </DialogDescription>
        </DialogHeader>

        {report && (
          <div className="space-y-4">
            {/* Infos du rapport */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rapport</span>
                <Badge variant="outline">{report.report_number || 'Non défini'}</Badge>
              </div>
              {report.vehicles && (
                <div className="text-sm text-muted-foreground">
                  {report.vehicles.car_brands?.name} {report.vehicles.car_models?.name} - {report.vehicles.license_plate}
                </div>
              )}
              {report.clients && (
                <div className="text-sm text-muted-foreground">
                  Client: {report.clients.first_name} {report.clients.last_name}
                </div>
              )}
            </div>

            {/* Chargement des dépendances */}
            {isCheckingDependencies && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Vérification des dépendances...
              </div>
            )}

            {/* Erreur de dépendance (OR signé) */}
            {dependencyError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{dependencyError}</AlertDescription>
              </Alert>
            )}

            {/* Warning si devis/OR non signés existent */}
            {dependencies && !dependencies.hasSignedRepairOrder && (dependencies.quotes.length > 0 || dependencies.repairOrders.length > 0) && (
              <Alert>
                <FileWarning className="h-4 w-4" />
                <AlertDescription>
                  Ce rapport a des documents liés qui seront impactés par la modification:
                  {dependencies.quotes.length > 0 && (
                    <div className="mt-1">
                      <strong>Devis:</strong> {dependencies.quotes.map(q => q.reference).join(', ')}
                    </div>
                  )}
                  {dependencies.repairOrders.length > 0 && (
                    <div className="mt-1">
                      <strong>Ordres de réparation:</strong> {dependencies.repairOrders.map(ro => ro.reference).join(', ')}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Zone d'upload (si pas bloqué) */}
            {!dependencies?.hasSignedRepairOrder && (
              <>
                {selectedFile ? (
                  <div className="flex items-center justify-between p-3 border-2 border-solid border-gray-300 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedFile(null)}
                      disabled={isModifying}
                      className="h-8 w-8 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('modify-file-upload')?.click()}
                  >
                    <Upload className="h-10 w-10 mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700 text-center">
                      Cliquez ou glissez-déposez un fichier
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      PDF, JPEG, PNG jusqu'à 10MB
                    </p>
                    <input 
                      id="modify-file-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isModifying}>
            Annuler
          </Button>
          <Button 
            onClick={handleModify}
            disabled={!canModify}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isModifying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Modification...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Modifier le PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
