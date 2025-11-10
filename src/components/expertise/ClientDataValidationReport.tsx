import { Database } from '@/integrations/supabase/types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

type Client = Database['public']['Tables']['clients']['Row'];

interface ValidationResults {
  missing: { 
    missingFields: string[]; 
    missingCount: number;
  };
  validation: { 
    errors: string[]; 
    warnings: string[];
  };
}

interface ClientDataValidationReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  validationResults: ValidationResults;
  onRequestDocuments: () => void;
  onEditClient: () => void;
}

export function ClientDataValidationReport({
  open,
  onOpenChange,
  client,
  validationResults,
  onRequestDocuments,
  onEditClient
}: ClientDataValidationReportProps) {
  const hasIssues = 
    validationResults.missing.missingCount > 0 ||
    validationResults.validation.errors.length > 0 ||
    validationResults.validation.warnings.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {hasIssues ? (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            Rapport de validation - {client.first_name} {client.last_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Section : Données manquantes */}
          {validationResults.missing.missingCount > 0 && (
            <div className="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20 p-4 rounded-r">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Données manquantes ({validationResults.missing.missingCount})
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {validationResults.missing.missingFields.map(field => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Section : Erreurs de validation */}
          {validationResults.validation.errors.length > 0 && (
            <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 p-4 rounded-r">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                Erreurs critiques ({validationResults.validation.errors.length})
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-400">
                {validationResults.validation.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Section : Avertissements */}
          {validationResults.validation.warnings.length > 0 && (
            <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-r">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                Avertissements ({validationResults.validation.warnings.length})
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                {validationResults.validation.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section : Tout est valide */}
          {!hasIssues && (
            <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 p-4 rounded-r">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                Données complètes et valides
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                Toutes les informations client sont présentes et ont été vérifiées avec succès.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onEditClient}>
            Corriger manuellement
          </Button>
          <Button 
            onClick={onRequestDocuments} 
            disabled={validationResults.validation.errors.length > 0}
          >
            Demander les documents au client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
