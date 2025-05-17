
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
import { Search, FileText, Plus, Filter, Download, Eye, Pencil, Trash, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Données mockées pour les PV d'expertise
const mockReports = [
  { 
    id: 1, 
    reference: 'PV-2023-001', 
    date: '15/05/2023', 
    client: 'Jean Dupont',
    vehicle: 'Peugeot 308 - AB-123-CD', 
    expert: 'Marc Expert', 
    amount: '3 500,00 €',
    status: 'Importé' 
  },
  { 
    id: 2, 
    reference: 'PV-2023-002', 
    date: '12/05/2023', 
    client: 'Marie Martin',
    vehicle: 'Renault Clio - EF-456-GH', 
    expert: 'Sophie Expertise', 
    amount: '2 800,00 €',
    status: 'En attente' 
  },
  { 
    id: 3, 
    reference: 'PV-2023-003', 
    date: '10/05/2023', 
    client: 'Pierre Durand',
    vehicle: 'Citroën C3 - IJ-789-KL', 
    expert: 'Marc Expert', 
    amount: '1 950,00 €',
    status: 'Validé' 
  },
];

const ExpertiseReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  const filteredReports = mockReports.filter(report => 
    report.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Importé':
        return 'bg-blue-100 text-blue-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Validé':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">PV d'expertise</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez les procès-verbaux d'expertise automobile.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Button variant="outline" size="sm" className="mr-2">
            Tous
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            Importés
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            En attente
          </Button>
          <Button variant="outline" size="sm">
            Validés
          </Button>
        </div>
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un PV..." 
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
            onClick={() => setImportDialogOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer un PV
          </Button>
        </div>
      </div>
      
      <div className="card-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Expert</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.reference}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.client}</TableCell>
                  <TableCell>{report.vehicle}</TableCell>
                  <TableCell>{report.expert}</TableCell>
                  <TableCell>{report.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                      {report.status}
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
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                    <p className="text-gray-500 mt-1">
                      Aucun PV d'expertise correspondant à votre recherche n'a été trouvé.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Import PV Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer un PV d'expertise</DialogTitle>
            <DialogDescription>
              Importez un procès verbal d'expertise au format PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="pv-upload" className="text-sm font-medium">
                Fichier PDF
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="pv-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-karrosserie-orange hover:text-karrosserie-orange/80"
                    >
                      <span>Télécharger un fichier</span>
                      <input id="pv-upload" name="pv-upload" type="file" className="sr-only" accept=".pdf" />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF jusqu'à 10MB
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                Annuler
              </Button>
              <Button>Importer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertiseReports;
