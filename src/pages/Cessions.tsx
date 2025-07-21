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
