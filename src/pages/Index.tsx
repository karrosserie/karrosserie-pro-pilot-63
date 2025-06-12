
import React from 'react';
import { Car, FileText, Users, CreditCard } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useDashboardData } from '@/hooks/use-dashboard-data';

const Index = () => {
  const { dashboardStats, recentVehicles, recentDocuments, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue sur Karrosserie Pro, votre outil de gestion automobile.</p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement du tableau de bord...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">Bienvenue sur Karrosserie Pro, votre outil de gestion automobile.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Véhicules en réparation" 
          value={dashboardStats?.vehiclesInRepair || 0} 
          icon={<Car className="h-6 w-6" />}
        />
        <StatsCard 
          title="Clients actifs" 
          value={dashboardStats?.activeClients || 0}
          change="+15%" 
          icon={<Users className="h-6 w-6" />}
          iconBg="bg-blue-500"
        />
        <StatsCard 
          title="Devis en attente" 
          value={dashboardStats?.pendingQuotes || 0} 
          icon={<FileText className="h-6 w-6" />}
          iconBg="bg-purple-500"
        />
        <StatsCard 
          title="Chiffre d'affaires" 
          value={(dashboardStats?.revenue || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} 
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
                  {recentVehicles && recentVehicles.length > 0 ? (
                    recentVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{vehicle.model}</td>
                        <td className="px-4 py-3 text-gray-600">{vehicle.licensePlate}</td>
                        <td className="px-4 py-3">{vehicle.client}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                            vehicle.status === 'en_reparation' ? 'bg-amber-100 text-amber-800' :
                            vehicle.status === 'termine' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {vehicle.status === 'en_reparation' ? 'En réparation' :
                             vehicle.status === 'termine' ? 'Terminé' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{vehicle.lastUpdate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Aucun véhicule récent
                      </td>
                    </tr>
                  )}
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
              {recentDocuments && recentDocuments.length > 0 ? (
                recentDocuments.map((document) => (
                  <div key={document.id} className="border border-gray-200 rounded-lg p-4 flex items-start">
                    <div className={`p-3 rounded-lg mr-3 ${
                      document.type === 'invoice' ? 'bg-green-100' :
                      document.type === 'quote' ? 'bg-blue-100' :
                      'bg-purple-100'
                    }`}>
                      <FileText className={`h-5 w-5 ${
                        document.type === 'invoice' ? 'text-green-600' :
                        document.type === 'quote' ? 'text-blue-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{document.title}</h4>
                      <p className="text-sm text-gray-600">{document.client}</p>
                      <p className="text-xs text-gray-400 mt-1">Créé le {document.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  Aucun document récent
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <RecentActivity />
          
          <div className="card-container animate-fade-in">
            <h3 className="section-title">Raccourcis</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Link to="/vehicles">
                <Button variant="outline" className="flex-col h-20 p-2 w-full">
                  <Car className="h-6 w-6 mb-1" />
                  <span className="text-xs">Nouveau véhicule</span>
                </Button>
              </Link>
              
              <Link to="/documents/devis">
                <Button variant="outline" className="flex-col h-20 p-2 w-full">
                  <FileText className="h-6 w-6 mb-1" />
                  <span className="text-xs">Nouveau devis</span>
                </Button>
              </Link>
              
              <Link to="/clients">
                <Button variant="outline" className="flex-col h-20 p-2 w-full">
                  <Users className="h-6 w-6 mb-1" />
                  <span className="text-xs">Nouveau client</span>
                </Button>
              </Link>
              
              <Link to="/payments/receipts">
                <Button variant="outline" className="flex-col h-20 p-2 w-full">
                  <CreditCard className="h-6 w-6 mb-1" />
                  <span className="text-xs">Encaisser</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
