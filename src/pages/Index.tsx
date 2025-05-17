
import React from 'react';
import { Car, FileText, Users, CreditCard } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">Bienvenue sur Karrosserie Pro, votre outil de gestion automobile.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Véhicules en réparation" 
          value="12" 
          icon={<Car className="h-6 w-6" />}
        />
        <StatsCard 
          title="Clients actifs" 
          value="48"
          change="+15%" 
          icon={<Users className="h-6 w-6" />}
          iconBg="bg-blue-500"
        />
        <StatsCard 
          title="Devis en attente" 
          value="8" 
          icon={<FileText className="h-6 w-6" />}
          iconBg="bg-purple-500"
        />
        <StatsCard 
          title="Chiffre d'affaires" 
          value="24 500 €" 
          change="+22%" 
          icon={<CreditCard className="h-6 w-6" />}
          iconBg="bg-green-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-container animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="section-title">Véhicules récemment modifiés</h3>
              <Link to="/vehicles">
                <Button variant="link" className="text-karrosserie-orange">
                  Voir tous
                </Button>
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Véhicule</th>
                    <th className="px-4 py-3">Immatriculation</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 rounded-tr-lg">Dernière mise à jour</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Peugeot 308</td>
                    <td className="px-4 py-3 text-gray-600">AB-123-CD</td>
                    <td className="px-4 py-3">Jean Dupont</td>
                    <td className="px-4 py-3">
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        En réparation
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">Aujourd'hui, 10:23</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Renault Clio</td>
                    <td className="px-4 py-3 text-gray-600">EF-456-GH</td>
                    <td className="px-4 py-3">Marie Martin</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Terminé
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">Hier, 15:47</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Citroën C3</td>
                    <td className="px-4 py-3 text-gray-600">IJ-789-KL</td>
                    <td className="px-4 py-3">Pierre Durand</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        En attente
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">17/05/2023, 09:15</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="card-container animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="section-title">Documents récents</h3>
              <Link to="/documents">
                <Button variant="link" className="text-karrosserie-orange">
                  Voir tous
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">PV d'expertise - Peugeot 308</h4>
                  <p className="text-sm text-gray-600">Jean Dupont</p>
                  <p className="text-xs text-gray-400 mt-1">Créé le 17/05/2023</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                <div className="bg-amber-100 p-3 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium">Devis - Renault Clio</h4>
                  <p className="text-sm text-gray-600">Marie Martin</p>
                  <p className="text-xs text-gray-400 mt-1">Créé le 16/05/2023</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                <div className="bg-green-100 p-3 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">OR - Citroën C3</h4>
                  <p className="text-sm text-gray-600">Pierre Durand</p>
                  <p className="text-xs text-gray-400 mt-1">Créé le 15/05/2023</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Facture - Toyota Yaris</h4>
                  <p className="text-sm text-gray-600">Sophie Bernard</p>
                  <p className="text-xs text-gray-400 mt-1">Créé le 14/05/2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <RecentActivity />
          
          <div className="card-container animate-fade-in">
            <h3 className="section-title">Raccourcis</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex-col h-20 p-2">
                <Car className="h-6 w-6 mb-1" />
                <span className="text-xs">Nouveau véhicule</span>
              </Button>
              
              <Button variant="outline" className="flex-col h-20 p-2">
                <FileText className="h-6 w-6 mb-1" />
                <span className="text-xs">Nouveau devis</span>
              </Button>
              
              <Button variant="outline" className="flex-col h-20 p-2">
                <Users className="h-6 w-6 mb-1" />
                <span className="text-xs">Nouveau client</span>
              </Button>
              
              <Button variant="outline" className="flex-col h-20 p-2">
                <CreditCard className="h-6 w-6 mb-1" />
                <span className="text-xs">Encaisser</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
