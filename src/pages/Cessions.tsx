import React, { useState, useEffect, useRef } from 'react';
import { useCessions } from '@/hooks/use-cessions';
import { CessionDialog } from '@/components/cessions/CessionDialog';
import { CessionsHeader } from '@/components/cessions/CessionsHeader';
import { CessionsFilters } from '@/components/cessions/CessionsFilters';
import { CessionsTable } from '@/components/cessions/CessionsTable';
import { Cession } from '@/services/supabase/cessions';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserOnboardingProgress } from '@/hooks/use-user-onboarding-progress';
import { SuccessDialog } from '@/components/ui/success-dialog';

const Cessions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCession, setSelectedCession] = useState<Cession | null>(null);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showCourtesyVehicleDialog, setShowCourtesyVehicleDialog] = useState(false);
  const [cessionJustCreated, setCessionJustCreated] = useState(false);
  
  // Ref pour tracker les cessions en cours de traitement (évite les appels multiples)
  const processingCessionsRef = useRef<Set<string>>(new Set());

  const { cessions, isLoading, createCession, updateCession, deleteCession } = useCessions();
  const { toast } = useToast();
  const { 
    shouldShowCessionHelp, 
    shouldShowCessionInitializeButtonHelp,
    markHelpAsSeen 
  } = useUserOnboardingProgress();

  // Afficher le dialog d'aide si pas encore vu
  useEffect(() => {
    if (shouldShowCessionHelp) {
      setShowHelpDialog(true);
    }
  }, [shouldShowCessionHelp]);

  // Vérifier le statut de signature des cessions en attente
  useEffect(() => {
    console.log('=== DEBUT DE LA VERIFICATION DES SIGNATURES ===');
    console.log('Cessions reçues:', cessions);
    
    const checkSignatureStatus = async () => {
      if (!cessions) {
        console.log('Pas de cessions disponibles');
        return;
      }

      console.log('Nombre total de cessions:', cessions.length);

      const cessionsEnAttente = cessions.filter(
        cession => cession.status === 'en_attente_signature' && 
                  cession.oodrive_contract_id && 
                  cession.document_url // S'assurer que le PDF a été complètement généré
      );

      console.log('Cessions en attente de signature trouvées:', cessionsEnAttente.length);
      console.log('Détails des cessions en attente:', cessionsEnAttente.map(c => ({
        id: c.id,
        status: c.status,
        oodrive_contract_id: c.oodrive_contract_id
      })));

      for (const cession of cessionsEnAttente) {
        // Éviter les appels multiples pour la même cession
        if (processingCessionsRef.current.has(cession.id)) {
          console.log(`Cession ${cession.id} déjà en cours de traitement, skip`);
          continue;
        }
        
        processingCessionsRef.current.add(cession.id);
        
        try {
          console.log(`=== APPEL API POUR CESSION ${cession.id} ===`);
          console.log(`Contract ID: ${cession.oodrive_contract_id}`);
          
          const url = `https://n8n.karrosserie.pro/webhook/e6854e25-9a51-4362-b9d2-9a18af911863?contractId=${cession.oodrive_contract_id}`;
          console.log('URL de l\'appel API:', url);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          console.log('Réponse API statut:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('Données reçues de l\'API:', data);
            
            // Vérifier si les deux entrées ont signature_status = 'SIGNED'
            if (Array.isArray(data) && data.length === 2) {
              const allSigned = data.every(entry => entry.signature_status === 'SIGNED');
              console.log('Toutes les signatures sont-elles complètes?', allSigned);
              
              if (allSigned) {
                console.log('Mise à jour du statut de la cession vers "signee"');
                // Mettre à jour le statut de la cession
                await updateCession.mutateAsync({
                  id: cession.id,
                  data: { status: 'signee' }
                });
                
                // Télécharger le document signé depuis Oodrive et mettre à jour l'OR si nécessaire
                console.log('Téléchargement du document signé et mise à jour de l\'OR');
                try {
                  const { error: downloadError } = await supabase.functions.invoke('download-signed-contract', {
                    body: { cessionId: cession.id }
                  });
                  
                  if (downloadError) {
                    console.error('Erreur lors du téléchargement du document signé:', downloadError);
                  } else {
                    console.log('Document signé téléchargé et OR mis à jour avec succès');
                  }
                } catch (downloadErr) {
                  console.error('Exception lors du téléchargement:', downloadErr);
                }
                
                // Déclencher automatiquement l'envoi du courrier électronique
                console.log('Déclenchement automatique de l\'envoi du courrier électronique');
                
                const { data: sendResult, error: sendError } = await supabase.functions.invoke('send-cession-registered-mail', {
                  body: { cessionId: cession.id }
                });
                
                if (sendError) {
                  console.error('Erreur lors de l\'envoi automatique du courrier:', sendError);
                  toast({
                    title: "Erreur",
                    description: "La cession a été signée mais l'envoi du courrier a échoué. Vous pouvez le renvoyer manuellement.",
                    variant: "destructive"
                  });
                } else if (sendResult?.alreadySent) {
                  console.log('Courrier déjà envoyé pour cette cession');
                } else {
                  console.log('Courrier électronique envoyé automatiquement avec succès');
                  toast({
                    title: "Succès",
                    description: "La cession a été signée et le courrier a été envoyé automatiquement à l'assurance.",
                  });
                }
              }
            } else {
              console.log('Format de données inattendu:', data);
            }
          } else {
            console.error('Erreur API:', response.status, await response.text());
          }
        } catch (error) {
          console.error(`Erreur lors de la vérification du statut pour la cession ${cession.id}:`, error);
        } finally {
          // Retirer de la liste des cessions en cours de traitement
          processingCessionsRef.current.delete(cession.id);
        }
      }
    };

    checkSignatureStatus();
  }, [cessions, updateCession]);

  // Sync insurance companies on component mount
  useEffect(() => {
    const syncInsuranceCompanies = async () => {
      try {
        console.log('Syncing insurance companies...');
        const { data, error } = await supabase.functions.invoke('sync-insurance-companies');
        
        if (error) {
          console.error('Error syncing insurance companies:', error);
          toast({
            title: "Erreur de synchronisation",
            description: "Impossible de synchroniser les compagnies d'assurance",
            variant: "destructive",
          });
        } else {
          console.log('Insurance companies sync result:', data);
          if (data?.stats?.inserted > 0 || data?.stats?.updated > 0) {
            toast({
              title: "Synchronisation réussie",
              description: `${data.stats.inserted} ajoutées, ${data.stats.updated} mises à jour`,
            });
          }
        }
      } catch (error) {
        console.error('Error calling sync function:', error);
      }
    };

    syncInsuranceCompanies();
  }, []); // Run only on mount

  const filteredCessions = (cessions || []).filter(cession => {
    const matchesSearch = 
      cession.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cession.repair_orders?.vehicles?.car_brands?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cession.repair_orders?.vehicles?.car_models?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cession.repair_orders?.vehicles?.license_plate?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || cession.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleCreateCession = () => {
    setSelectedCession(null);
    setDialogOpen(true);
  };

  const handleEditCession = (cession: Cession) => {
    setSelectedCession(cession);
    setDialogOpen(true);
  };

  const handleDeleteCession = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette cession ?')) {
      try {
        await deleteCession.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting cession:', error);
      }
    }
  };

  const handleSubmitCession = async (formData: Partial<Cession>) => {
    try {
      if (selectedCession) {
        await updateCession.mutateAsync({
          id: selectedCession.id,
          data: formData
        });
      } else {
        await createCession.mutateAsync(formData);
        // Déclencher l'aide pour le bouton initialiser après création
        setCessionJustCreated(true);
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Error submitting cession:', error);
    }
  };
  
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-4 md:space-y-6`}>
      <CessionsHeader />
      
      <CessionsFilters
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchTerm}
        onStatusChange={setSelectedStatus}
        onCreateCession={handleCreateCession}
      />
      
      <CessionsTable
        cessions={filteredCessions}
        isLoading={isLoading}
        onEditCession={handleEditCession}
        onDeleteCession={handleDeleteCession}
        onInitializationComplete={() => setShowCourtesyVehicleDialog(true)}
        shouldShowInitializeHelp={cessionJustCreated}
        onInitializeHelpSeen={() => {
          setCessionJustCreated(false);
          markHelpAsSeen('cession_initialize_button_help_seen');
        }}
      />

      <CessionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cession={selectedCession}
        onSubmit={handleSubmitCession}
        isSubmitting={createCession.isPending || updateCession.isPending}
      />

      <SuccessDialog
        open={showHelpDialog}
        onClose={() => {
          setShowHelpDialog(false);
          markHelpAsSeen('cession_help_seen');
        }}
        title="Bienvenue dans les cessions de créance"
        description="Pour créer une nouvelle cession de créance, cliquez sur le bouton « Nouvelle cession » puis sélectionnez l'ordre de réparation souhaité."
        buttonText="J'ai compris"
      />

      <SuccessDialog
        open={showCourtesyVehicleDialog}
        onClose={() => setShowCourtesyVehicleDialog(false)}
        title="Cession initialisée avec succès !"
        description={
          <div>
            La cession de créance a été envoyée pour signature.
            <br /><br />
            💡 <strong>N'oubliez pas :</strong> Vous pouvez également prêter un véhicule de courtoisie au client pendant la durée des réparations via le module "véhicule de courtoisie".
            <br /><br />
            <div className="space-y-2 mt-4">
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Contrat sécurisé en 2 clics</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span><strong>On gère les PV</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span><strong>On demande un paiement pour le prêt de véhicule à l'assurance si c'est possible</strong></span>
              </div>
            </div>
          </div>
        }
        buttonText="J'ai compris"
      />
    </div>
  );
};

export default Cessions;
