
import React, { useState } from 'react';
import { useCessions } from '@/hooks/use-cessions';
import { CessionDialog } from '@/components/cessions/CessionDialog';
import { CessionsHeader } from '@/components/cessions/CessionsHeader';
import { CessionsFilters } from '@/components/cessions/CessionsFilters';
import { CessionsTable } from '@/components/cessions/CessionsTable';
import { Cession } from '@/services/supabase/cessions';
import { useToast } from '@/hooks/use-toast';

const Cessions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCession, setSelectedCession] = useState<Cession | null>(null);

  const { cessions, isLoading, createCession, updateCession, deleteCession } = useCessions();
  const { toast } = useToast();

  const filteredCessions = (cessions || []).filter(cession => {
    const matchesSearch = 
      cession.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cession.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cession.vehicles?.car_brands?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cession.vehicles?.car_models?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cession.vehicles?.license_plate?.toLowerCase().includes(searchTerm.toLowerCase());

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
