import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Search, Filter } from 'lucide-react';

const DocumentItem = ({ 
  icon, 
  title, 
  date, 
  customer, 
  vehicle, 
  status, 
  statusColor 
}: { 
  icon: React.ReactNode; 
  title: string; 
  date: string; 
  customer: string; 
  vehicle: string; 
  status: string; 
  statusColor: string; 
}) => {
  return (
    <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <div className="bg-gray-100 p-3 rounded-lg mr-4">
        {icon}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${statusColor}`}>
            {status}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mt-1">
          Client: {customer} | Véhicule: {vehicle}
        </p>
        
        <p className="text-xs text-gray-400 mt-2">{date}</p>
      </div>
      
      <div className="ml-4">
        <Button variant="outline" size="sm" className="mb-2 w-full">
          Voir
        </Button>
        <Button size="sm" className="w-full">
          Éditer
        </Button>
      </div>
    </div>
  );
};

const Documents = () => {
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestion des documents</h1>
        <p className="text-gray-600 mt-1">Consultez et gérez tous vos documents: rapports d'expertise, devis, ordres de réparation et factures.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card-container text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="font-bold">Rapports d'expertise</h3>
          <p className="text-sm text-gray-600 mt-1">12 documents</p>
          <Button className="mt-3 w-full" variant="outline">
            Voir tout
          </Button>
        </div>
        
        <div className="card-container text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-amber-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <h3 className="font-bold">Devis</h3>
          <p className="text-sm text-gray-600 mt-1">8 documents</p>
          <Button className="mt-3 w-full" variant="outline">
            Voir tout
          </Button>
        </div>
        
        <div className="card-container text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="font-bold">Ordres de réparation</h3>
          <p className="text-sm text-gray-600 mt-1">15 documents</p>
          <Button className="mt-3 w-full" variant="outline">
            Voir tout
          </Button>
        </div>
        
        <div className="card-container text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="font-bold">Factures</h3>
          <p className="text-sm text-gray-600 mt-1">23 documents</p>
          <Button className="mt-3 w-full" variant="outline">
            Voir tout
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Documents récents</h2>
        
        <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un document..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
            />
          </div>
          
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <DocumentItem 
          icon={<FileText className="h-5 w-5 text-blue-600" />}
          title="Rapport d'expertise - Peugeot 308"
          date="Créé le 17/05/2023"
          customer="Jean Dupont"
          vehicle="Peugeot 308 - AB-123-CD"
          status="Importé"
          statusColor="bg-blue-100 text-blue-800"
        />
        
        <DocumentItem 
          icon={<FileText className="h-5 w-5 text-amber-600" />}
          title="Devis #D2023-045"
          date="Créé le 16/05/2023"
          customer="Marie Martin"
          vehicle="Renault Clio - EF-456-GH"
          status="En attente"
          statusColor="bg-amber-100 text-amber-800"
        />
        
        <DocumentItem 
          icon={<FileText className="h-5 w-5 text-green-600" />}
          title="Ordre de réparation #OR2023-032"
          date="Créé le 15/05/2023"
          customer="Pierre Durand"
          vehicle="Citroën C3 - IJ-789-KL"
          status="Signé"
          statusColor="bg-green-100 text-green-800"
        />
        
        <DocumentItem 
          icon={<FileText className="h-5 w-5 text-purple-600" />}
          title="Facture #F2023-056"
          date="Créé le 14/05/2023"
          customer="Sophie Bernard"
          vehicle="Toyota Yaris - MN-012-OP"
          status="Payé"
          statusColor="bg-purple-100 text-purple-800"
        />
      </div>
    </div>
  );
};

export default Documents;
