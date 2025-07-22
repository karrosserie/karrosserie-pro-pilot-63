import React, { useState, useEffect } from 'react';
import { useCessions } from '@/hooks/use-cessions';
import { CessionDialog } from '@/components/cessions/CessionDialog';
import { CessionsHeader } from '@/components/cessions/CessionsHeader';
import { CessionsFilters } from '@/components/cessions/CessionsFilters';
import { CessionsTable } from '@/components/cessions/CessionsTable';
import { Cession } from '@/services/supabase/cessions';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Cessions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCession, setSelectedCession] = useState<Cession | null>(null);

  const { cessions, isLoading, createCession, updateCession, deleteCession } = useCessions();
  const { toast } = useToast();

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
        cession => cession.status === 'en_attente_signature' && cession.oodrive_contract_id
      );

      console.log('Cessions en attente de signature trouvées:', cessionsEnAttente.length);
      console.log('Détails des cessions en attente:', cessionsEnAttente.map(c => ({
        id: c.id,
        status: c.status,
        oodrive_contract_id: c.oodrive_contract_id
      })));

      for (const cession of cessionsEnAttente) {
        try {
          console.log(`=== APPEL API POUR CESSION ${cession.id} ===`);
          console.log(`Contract ID: ${cession.oodrive_contract_id}`);
          
          const response = await fetch('https://n8n.karrosserie.pro/webhook/e6854e25-9a51-4362-b9d2-9a18af911863', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contractId: parseInt(cession.oodrive_contract_id!)
            })
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
              }
            } else {
              console.log('Format de données inattendu:', data);
            }
          } else {
            console.error('Erreur API:', response.status, await response.text());
          }
        } catch (error) {
          console.error(`Erreur lors de la vérification du statut pour la cession ${cession.id}:`, error);
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
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Error submitting cession:', error);
    }
  };
  
  return (
    <div className="page-container">
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
      />

      <CessionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cession={selectedCession}
        onSubmit={handleSubmitCession}
        isSubmitting={createCession.isPending || updateCession.isPending}
      />
    </div>
  );
};

export default Cessions;
