import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, FileText, Euro, Signature, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useCompany } from '@/hooks/use-company';
import { useAuth } from '@/contexts/AuthContext';
import SignaturePad from '@/components/shared/SignaturePad';
import { generateDenunciationPDF } from '@/utils/pdfGenerator';

interface DenunciationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  violationData: {
    violation: any;
    reservation: any;
    conductor: any;
  } | null;
}

export const DenunciationDialog: React.FC<DenunciationDialogProps> = ({
  open,
  onOpenChange,
  violationData
}) => {
  const { toast } = useToast();
  const { companyData } = useCompany();
  const { profile } = useAuth();
  
  const [signature, setSignature] = useState('');
  const [signatoryName, setSignatoryName] = useState(
    profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}`
      : companyData?.name || ''
  );
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleSignatureChange = (signatureData: string) => {
    setSignature(signatureData);
  };

  const handleGeneratePDF = async () => {
    if (!signature) {
      toast({
        title: "Signature requise",
        description: "Vous devez signer le document avant de le générer.",
        variant: "destructive"
      });
      return;
    }

    if (!violationData || !companyData) {
      toast({
        title: "Données manquantes",
        description: "Impossible de générer le PDF sans les données complètes.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      await generateDenunciationPDF(violationData, companyData, signature, signatoryName);
      
      toast({
        title: "Dossier de dénonciation généré",
        description: "Le dossier complet (courrier, attestation de prêt et photo) a été téléchargé avec succès. Une facture de 15€ TTC sera créée."
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le courrier de dénonciation.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!violationData) return null;

  const { violation, reservation, conductor } = violationData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Courrier de dénonciation ANTAI</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations de l'infraction */}
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Détails de l'infraction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(violation.violation_date), 'dd MMMM yyyy', { locale: fr })}
                  {violation.violation_time && ` à ${violation.violation_time}`}
                </span>
              </div>
              {violation.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{violation.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Véhicule:</span>
                <span className="text-sm">{violation.license_plate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{violation.fine_amount}€</span>
                {violation.points_lost && violation.points_lost > 0 && (
                  <Badge variant="destructive" className="text-xs">-{violation.points_lost} pts</Badge>
                )}
              </div>
            </div>
            <div className="mt-3">
              <span className="font-medium">Type d'infraction:</span>
              <span className="ml-2">{violation.violation_type}</span>
            </div>
            {violation.reference_number && (
              <div className="mt-2">
                <span className="font-medium">Référence:</span>
                <span className="ml-2">{violation.reference_number}</span>
              </div>
            )}
          </div>

          {/* Informations du conducteur */}
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Conducteur identifié</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Nom:</span>
                <span className="ml-2">{conductor.first_name} {conductor.last_name}</span>
              </div>
              <div>
                <span className="font-medium">Email:</span>
                <span className="ml-2">{conductor.email}</span>
              </div>
              <div>
                <span className="font-medium">Téléphone:</span>
                <span className="ml-2">{conductor.phone}</span>
              </div>
              {conductor.license_number && (
                <div>
                  <span className="font-medium">Permis n°:</span>
                  <span className="ml-2">{conductor.license_number}</span>
                </div>
              )}
              {conductor.date_of_birth && (
                <div>
                  <span className="font-medium">Date de naissance:</span>
                  <span className="ml-2">
                    {format(new Date(conductor.date_of_birth), 'dd/MM/yyyy', { locale: fr })}
                  </span>
                </div>
              )}
              {conductor.place_of_birth && (
                <div>
                  <span className="font-medium">Lieu de naissance:</span>
                  <span className="ml-2">{conductor.place_of_birth}</span>
                </div>
              )}
              {conductor.prefecture && (
                <div>
                  <span className="font-medium">Préfecture:</span>
                  <span className="ml-2">{conductor.prefecture}</span>
                </div>
              )}
            </div>
          </div>

          {/* Période de prêt */}
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Période de prêt</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Début du prêt:</span>
                <span className="ml-2">
                  {format(new Date(reservation.start_date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </span>
              </div>
              <div>
                <span className="font-medium">Fin prévue:</span>
                <span className="ml-2">
                  {reservation.expected_return_date ? 
                    format(new Date(reservation.expected_return_date), 'dd/MM/yyyy HH:mm', { locale: fr }) :
                    'Non définie'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Aperçu du courrier ANTAI */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Aperçu du courrier ANTAI</h3>
            <div className="bg-white border p-6 rounded space-y-4 text-sm">
              <div className="text-center font-bold">
                COURRIER DE DÉNONCIATION
                <br />
                À L'AGENCE NATIONALE DE TRAITEMENT AUTOMATISÉ DES INFRACTIONS
              </div>
              
              <div className="space-y-2">
                <p><strong>Objet :</strong> Dénonciation du conducteur au moment de l'infraction</p>
                <p><strong>Référence de l'avis :</strong> {violation.reference_number}</p>
                <p><strong>Date de l'infraction :</strong> {format(new Date(violation.violation_date), 'dd/MM/yyyy', { locale: fr })}</p>
                <p><strong>Heure :</strong> {violation.violation_time || 'Non précisée'}</p>
                <p><strong>Lieu :</strong> {violation.location || 'Non précisé'}</p>
                <p><strong>Véhicule :</strong> {violation.license_plate}</p>
              </div>

              <p>Madame, Monsieur,</p>
              
              <p>
                Par la présente, je vous informe que le véhicule immatriculé <strong>{violation.license_plate}</strong> 
                était conduit au moment de l'infraction par :
              </p>

              <div className="ml-4 space-y-1">
                <p><strong>Nom et prénom :</strong> {conductor.first_name} {conductor.last_name}</p>
                <p><strong>Date de naissance :</strong> {conductor.date_of_birth ? format(new Date(conductor.date_of_birth), 'dd/MM/yyyy', { locale: fr }) : 'Non renseignée'}</p>
                <p><strong>Lieu de naissance :</strong> {conductor.place_of_birth || 'Non renseigné'}</p>
                <p><strong>Numéro de permis :</strong> {conductor.license_number || 'Non renseigné'}</p>
                <p><strong>Préfecture de délivrance :</strong> {conductor.prefecture || 'Non renseignée'}</p>
              </div>

              <p>
                Ce véhicule était prêté dans le cadre d'un service de courtoisie de notre établissement.
                La période de prêt s'étendait du {format(new Date(reservation.start_date), 'dd/MM/yyyy', { locale: fr })} 
                au {reservation.expected_return_date ? format(new Date(reservation.expected_return_date), 'dd/MM/yyyy', { locale: fr }) : 'date non définie'}.
              </p>

              <p>
                Je certifie sur l'honneur l'exactitude des renseignements ci-dessus et joins à ce courrier :
              </p>
              
              <div className="ml-4 space-y-1">
                <p>• Une copie du permis de conduire du conducteur désigné</p>
                <p>• L'attestation de prêt signée du véhicule</p>
                <p>• La photo de la contravention</p>
              </div>

              <div className="mt-8 text-right">
                <p>Fait le {format(new Date(), 'dd/MM/yyyy', { locale: fr })}</p>
                <p>Signature du responsable :</p>
              </div>
            </div>
          </div>

          {/* Section signature du carrossier */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Signature du responsable</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nom et prénom du signataire
                </label>
                <input
                  type="text"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Nom et prénom du responsable"
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                En signant ce document, vous certifiez sur l'honneur l'exactitude des informations fournies 
                et attestez que le véhicule était bien conduit par la personne désignée au moment de l'infraction.
              </p>
              
              <SignaturePad
                value={signature}
                onSignatureChange={handleSignatureChange}
              />
              
              {signature && (
                <div className="text-sm text-green-600 flex items-center space-x-2">
                  <Signature className="h-4 w-4" />
                  <span>Document signé électroniquement</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 space-x-0 sm:space-x-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              📦 Un dossier complet sera téléchargé avec le courrier, l'attestation de prêt et la photo de la contravention • 💰 Une facture de 15€ TTC sera automatiquement créée pour le client
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF || !signature}
                className="bg-primary hover:bg-primary/90"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Génération...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le dossier complet
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};