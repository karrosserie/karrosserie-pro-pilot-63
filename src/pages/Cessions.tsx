
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, FileText, Plus, Filter, Download, Eye, Pencil, Trash } from 'lucide-react';
import { useCessions } from '@/hooks/use-cessions';
import { CessionDialog } from '@/components/cessions/CessionDialog';
import { Cession } from '@/services/supabase/cessions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      cession.vehicles?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cession.vehicles?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cession.vehicles?.license_plate?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || cession.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-gray-100 text-gray-800';
      case 'envoyee':
        return 'bg-purple-100 text-purple-800';
      case 'signee':
        return 'bg-blue-100 text-blue-800';
      case 'payee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'En attente d\'envoi';
      case 'envoyee':
        return 'Envoyée à l\'assurance';
      case 'signee':
        return 'Signée';
      case 'payee':
        return 'Payée';
      default:
        return status;
    }
  };

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

  const statusButtons = [
    { key: 'all', label: 'Toutes' },
    { key: 'en_attente', label: 'En attente d\'envoi' },
    { key: 'envoyee', label: 'Envoyées' },
    { key: 'signee', label: 'Signées' },
    { key: 'payee', label: 'Payées' }
  ];
  
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Cession de créance</h1>
        <p className="text-gray-600 mt-1">
          Gérez vos cessions de créance avec les compagnies d'assurance.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0 overflow-x-auto pb-2">
          {statusButtons.map(({ key, label }) => (
            <Button 
              key={key}
              variant={selectedStatus === key ? "default" : "outline"} 
              size="sm" 
              className="mr-2 whitespace-nowrap"
              onClick={() => setSelectedStatus(key)}
            >
              {label}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher une cession..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={handleCreateCession}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle cession
          </Button>
        </div>
      </div>
      
      <div className="card-container">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Acheteur</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCessions.length > 0 ? (
                filteredCessions.map((cession) => (
                  <TableRow key={cession.id}>
                    <TableCell className="font-medium">{cession.reference}</TableCell>
                    <TableCell>
                      {cession.sale_date ? format(new Date(cession.sale_date), 'dd/MM/yyyy', { locale: fr }) : '-'}
                    </TableCell>
                    <TableCell>{cession.buyer_name}</TableCell>
                    <TableCell>
                      {cession.vehicles ? 
                        `${cession.vehicles.brand} ${cession.vehicles.model} - ${cession.vehicles.license_plate}` 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>{Number(cession.sale_amount).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(cession.status || '')}`}>
                        {getStatusLabel(cession.status || '')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditCession(cession)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteCession(cession.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    <div className="flex flex-col items-center justify-center py-8">
                      <FileText className="h-10 w-10 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                      <p className="text-gray-500 mt-1">
                        Aucune cession de créance correspondant à votre recherche n'a été trouvée.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

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
