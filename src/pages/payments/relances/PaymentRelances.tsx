import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useUnpaidInvoices } from '@/hooks/use-unpaid-invoices';
import { 
  Scale, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  Eye,
  FileText,
  Phone,
  Mail,
  Calendar,
  Download,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PaymentRelancesProps {}

const PaymentRelances: React.FC<PaymentRelancesProps> = () => {
  const { formattedInvoices: realInvoices, loading } = useUnpaidInvoices();
  const [filter, setFilter] = useState<string>('all');
  const [drawerData, setDrawerData] = useState<any>(null);

  // Force rebuild - données fictives pour la démonstration
  const mockInvoices = [
    {
      id: 'FAC-2024-001',
      uuid: 'uuid-001',
      client: 'SARL Dupont Transport',
      vehicle: 'Renault Master',
      vehicleRef: 'AB-123-CD',
      garage: 'Garage Martin',
      garageRef: '12345678901234',
      amount: '3 450,00 €',
      dueDate: '15/11/2024',
      lastRelanceDate: '20/12/2024',
      relanceType: 'Relance 2',
      relanceTypeColor: 'bg-orange-100 text-orange-800',
      status: 'relance2',
      availableActions: ['whatsapp', 'sms', 'mail'],
      history: [
        { action: 'Relance email', date: '20/12/2024', status: 'Envoyé' },
        { action: 'SMS de rappel', date: '25/12/2024', status: 'Lu' }
      ],
      clientPhone: '06 12 34 56 78',
      clientEmail: 'contact@dupont-transport.fr',
      clientAddress: '15 rue de la République\n75001 Paris\nFrance',
      daysOverdue: 25,
      autoRelancesDisabled: false,
      clientId: 'client-001'
    },
    {
      id: 'FAC-2024-015',
      uuid: 'uuid-002', 
      client: 'Entreprise Leroy',
      vehicle: 'Peugeot Partner',
      vehicleRef: 'EF-456-GH',
      garage: 'Garage Martin',
      garageRef: '12345678901234',
      amount: '1 250,00 €',
      dueDate: '10/12/2024',
      lastRelanceDate: '15/01/2025',
      relanceType: 'Relance 1',
      relanceTypeColor: 'bg-blue-100 text-blue-800',
      status: 'relance1',
      availableActions: ['whatsapp', 'sms', 'vms', 'mail'],
      history: [
        { action: 'Email automatique', date: '15/01/2025', status: 'Envoyé' }
      ],
      clientPhone: '06 98 76 54 32',
      clientEmail: 'leroy.entreprise@gmail.com',
      clientAddress: '28 avenue des Tilleuls\n69003 Lyon\nFrance',
      daysOverdue: 12,
      autoRelancesDisabled: false,
      clientId: 'client-002'
    },
    {
      id: 'FAC-2024-032',
      uuid: 'uuid-003',
      client: 'SAS Moreau & Fils',
      vehicle: 'Citroën Berlingo',
      vehicleRef: 'IJ-789-KL',
      garage: 'Garage Martin',
      garageRef: '12345678901234',
      amount: '5 680,00 €',
      dueDate: '01/10/2024',
      lastRelanceDate: '15/01/2025',
      relanceType: 'Contentieux',
      relanceTypeColor: 'bg-red-100 text-red-800',
      status: 'contentieux',
      availableActions: ['recommande', 'judiciaire'],
      history: [
        { action: 'Relance email', date: '05/11/2024', status: 'Envoyé' },
        { action: 'SMS de rappel', date: '20/11/2024', status: 'Lu' },
        { action: 'Appel téléphonique', date: '05/12/2024', status: 'Répondeur' },
        { action: 'Mise en demeure', date: '20/12/2024', status: 'Reçu' },
        { action: 'Dépôt dossier tribunal', date: '15/01/2025', status: 'En cours' }
      ],
      clientPhone: '04 78 12 34 56',
      clientEmail: 'contact@moreau-fils.fr',
      clientAddress: '142 route de Grenoble\n38000 Grenoble\nFrance',
      daysOverdue: 95,
      autoRelancesDisabled: false,
      clientId: 'client-003'
    },
    {
      id: 'FAC-2024-067',
      uuid: 'uuid-004',
      client: 'EURL Rousseau Plomberie',
      vehicle: 'Ford Transit',
      vehicleRef: 'MN-012-OP',
      garage: 'Garage Martin',
      garageRef: '12345678901234',
      amount: '890,50 €',
      dueDate: '20/12/2024',
      lastRelanceDate: '10/01/2025',
      relanceType: 'Relance 1',
      relanceTypeColor: 'bg-blue-100 text-blue-800',
      status: 'relance1',
      availableActions: ['whatsapp', 'sms', 'mail'],
      history: [
        { action: 'Email de relance', date: '10/01/2025', status: 'Envoyé' }
      ],
      clientPhone: '02 40 56 78 90',
      clientEmail: 'rousseau.plomberie@orange.fr',
      clientAddress: '7 impasse des Artisans\n44000 Nantes\nFrance',
      daysOverdue: 8,
      autoRelancesDisabled: false,
      clientId: 'client-004'
    },
    {
      id: 'FAC-2024-089',
      uuid: 'uuid-005',
      client: 'Mme Catherine Bernard',
      vehicle: 'Volkswagen Polo',
      vehicleRef: 'QR-345-ST',
      garage: 'Garage Martin',
      garageRef: '12345678901234',
      amount: '2 150,00 €',
      dueDate: '15/11/2024',
      lastRelanceDate: '02/01/2025',
      relanceType: 'Relance 3',
      relanceTypeColor: 'bg-orange-100 text-orange-800',
      status: 'relance3',
      availableActions: ['whatsapp', 'sms', 'vms', 'recommande'],
      history: [
        { action: 'Relance email', date: '20/12/2024', status: 'Envoyé' },
        { action: 'SMS de rappel', date: '28/12/2024', status: 'Lu' },
        { action: 'Appel téléphonique', date: '02/01/2025', status: 'Conversation' }
      ],
      clientPhone: '06 23 45 67 89',
      clientEmail: 'c.bernard@hotmail.fr',
      clientAddress: '3 rue des Roses\n13001 Marseille\nFrance',
      daysOverdue: 42,
      autoRelancesDisabled: false,
      clientId: 'client-005'
    },
    {
      id: 'FAC-2024-103',
      uuid: 'uuid-006',
      client: 'SCI Lambert Immobilier',
      vehicle: 'Mercedes Sprinter',
      vehicleRef: 'UV-678-WX',
      garage: 'Garage Martin',
      garageRef: '12345678901234',
      amount: '4 320,00 €',
      dueDate: '05/11/2024',
      lastRelanceDate: '18/01/2025',
      relanceType: 'Mise en demeure',
      relanceTypeColor: 'bg-red-100 text-red-800',
      status: 'relance4',
      availableActions: ['recommande', 'judiciaire'],
      history: [
        { action: 'Relance email', date: '10/12/2024', status: 'Envoyé' },
        { action: 'SMS de rappel', date: '20/12/2024', status: 'Lu' },
        { action: 'Relance téléphonique', date: '05/01/2025', status: 'Promesse de paiement' },
        { action: 'Mise en demeure', date: '18/01/2025', status: 'Envoyé' }
      ],
      clientPhone: '01 42 78 96 54',
      clientEmail: 'gestion@lambert-immobilier.com',
      clientAddress: '89 boulevard Haussmann\n75008 Paris\nFrance',
      daysOverdue: 68,
      autoRelancesDisabled: false,
      clientId: 'client-006'
    },
    {
      id: 'FAC-2024-124',
      uuid: 'uuid-007',
      client: 'M. Pierre Dubois',
      vehicle: 'Opel Corsa',
      vehicleRef: 'YZ-901-AB',
      garage: 'Garage Martin',
      garageRef: '12345678901234',
      amount: '650,00 €',
      dueDate: '28/12/2024',
      lastRelanceDate: '12/01/2025',
      relanceType: 'Relance 1',
      relanceTypeColor: 'bg-blue-100 text-blue-800',
      status: 'relance1',
      availableActions: ['whatsapp', 'sms', 'mail'],
      history: [
        { action: 'Email automatique', date: '12/01/2025', status: 'Envoyé' }
      ],
      clientPhone: '03 20 45 67 89',
      clientEmail: 'p.dubois@gmail.com',
      clientAddress: '12 rue du Commerce\n59000 Lille\nFrance',
      daysOverdue: 5,
      autoRelancesDisabled: false,
      clientId: 'client-007'
    },
    {
      id: 'FAC-2024-156',
      uuid: 'uuid-008',
      client: 'SARL Petit Électricité',
      vehicle: 'Nissan NV200',
      vehicleRef: 'CD-234-EF',
      garage: 'Garage Martin',
      garageRef: '12345678901234',
      amount: '1 890,00 €',
      dueDate: '03/12/2024',
      lastRelanceDate: '08/01/2025',
      relanceType: 'Relance 2',
      relanceTypeColor: 'bg-orange-100 text-orange-800',
      status: 'relance2',
      availableActions: ['whatsapp', 'sms', 'vms', 'mail'],
      history: [
        { action: 'Relance email', date: '18/12/2024', status: 'Envoyé' },
        { action: 'SMS de rappel', date: '28/12/2024', status: 'Lu' },
        { action: 'Email de relance ferme', date: '08/01/2025', status: 'Envoyé' }
      ],
      clientPhone: '05 56 78 90 12',
      clientEmail: 'petit.electricite@wanadoo.fr',
      clientAddress: '45 avenue de la Libération\n33000 Bordeaux\nFrance',
      daysOverdue: 32,
      autoRelancesDisabled: false,
      clientId: 'client-008'
    }
  ];

  // Utiliser les données fictives au lieu des vraies données
  const formattedInvoices = mockInvoices;

  // Filter invoices based on selected status
  const filteredInvoices = formattedInvoices.filter(invoice => {
    if (filter === 'all') return true;
    if (filter === 'relance') return ['relance1', 'relance2', 'relance3'].includes(invoice.status);
    if (filter === 'demeure') return invoice.status === 'relance4';
    if (filter === 'contentieux') return invoice.status === 'contentieux';
    return invoice.status === filter;
  });

  // Calculate stats
  const stats = {
    enRelance: formattedInvoices.filter(i => ['relance1', 'relance2', 'relance3'].includes(i.status)).length,
    procedureJudiciaire: formattedInvoices.filter(i => ['relance4', 'contentieux'].includes(i.status)).length,
    recupererCeMois: '28 450€', // TODO: Calculate actual recovered amount
    totalImpayes: formattedInvoices.reduce((sum, invoice) => {
      const amount = parseFloat(invoice.amount.replace(' €', '').replace(',', '.'));
      return sum + amount;
    }, 0).toLocaleString('fr-FR') + ' €'
  };

  const showDetails = (invoice: any) => {
    setDrawerData(invoice);
  };

  const closeDrawer = () => {
    setDrawerData(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'relance1': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'relance2': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'relance3': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'relance4': return 'bg-red-100 text-red-800 border-red-200';
      case 'contentieux': return 'bg-red-600 text-white border-red-600';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'relance1': return 'Relance 1';
      case 'relance2': return 'Relance 2';
      case 'relance3': return 'Relance 3';
      case 'relance4': return 'Relance 4';
      case 'contentieux': return 'Contentieux';
      default: return 'Non défini';
    }
  };

  const getOverdueColor = (days: number) => {
    if (days > 90) return 'text-red-600 font-bold';
    if (days > 60) return 'text-orange-500 font-medium';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Scale className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Module Juridique - Recouvrement
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          Gérez vos impayés et procédures judiciaires en toute simplicité
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.enRelance}</div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              EN RELANCE
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.procedureJudiciaire}</div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              PROCÉDURE JUDICIAIRE
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="text-xl sm:text-2xl font-bold text-foreground">{stats.recupererCeMois}</div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              RÉCUPÉRÉ CE MOIS
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalImpayes}</div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              TOTAL IMPAYÉS
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="text-xl font-semibold">Factures impayées</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
                className="text-xs sm:text-sm"
              >
                Toutes
              </Button>
              <Button 
                variant={filter === 'relance1' || filter === 'relance2' || filter === 'relance3' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('relance')}
                className="text-xs sm:text-sm"
              >
                Relance
              </Button>
              <Button 
                variant={filter === 'demeure' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('demeure')}
                className="text-xs sm:text-sm"
              >
                Mise en demeure
              </Button>
              <Button 
                variant={filter === 'contentieux' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('contentieux')}
                className="text-xs sm:text-sm"
              >
                Judiciaire
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Facture</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Retard</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.uuid} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">{invoice.client}</div>
                      <div className="text-sm text-muted-foreground">{invoice.vehicle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">{invoice.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getOverdueColor(invoice.daysOverdue)}>
                        {invoice.daysOverdue} jours
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className={getStatusColor(invoice.status)}>
                        {getStatusText(invoice.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showDetails(invoice)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.uuid} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-semibold text-foreground text-sm">{invoice.client}</div>
                      <div className="text-xs text-muted-foreground">{invoice.vehicle}</div>
                    </div>
                    <Badge variant="outline" className={`${getStatusColor(invoice.status)} text-xs`}>
                      {getStatusText(invoice.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div>
                      <span className="text-muted-foreground">Facture:</span>
                      <div className="font-medium">{invoice.id}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Montant:</span>
                      <div className="font-semibold">{invoice.amount}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Retard:</span>
                      <div className={getOverdueColor(invoice.daysOverdue)}>{invoice.daysOverdue} jours</div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showDetails(invoice)}
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium mb-2">Aucune facture impayée</p>
              <p className="text-sm">Aucune facture ne correspond aux critères sélectionnés.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drawer pour les détails */}
      <Drawer open={!!drawerData} onOpenChange={(open) => !open && closeDrawer()}>
        <DrawerContent className="fixed right-0 top-0 h-screen w-[500px] max-w-[90vw] rounded-none border-l">
          <div className="p-6 h-full overflow-y-auto">
            {drawerData && (
              <>
                {/* Drawer Header */}
                <DrawerHeader className="p-0 mb-6">
                  <div className="flex justify-between items-center">
                    <DrawerTitle className="text-xl font-bold flex items-center">
                      <Eye className="h-6 w-6 mr-2" />
                      Détails de la facture {drawerData.id}
                    </DrawerTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeDrawer}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </DrawerHeader>

                {/* Status Badge */}
                <div className="mb-6">
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(drawerData.status)} text-sm px-3 py-1`}
                  >
                    {getStatusText(drawerData.status)}
                  </Badge>
                </div>

                {/* Relance History */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Historique des relances
                  </h4>
                  <div className="space-y-3">
                    {drawerData.history.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{entry.action}</div>
                          <div className="text-sm text-muted-foreground">{entry.date}</div>
                        </div>
                        <Badge 
                          variant={entry.status === 'Envoyé' ? 'default' : entry.status === 'Lu' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {entry.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* General Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Informations générales
                  </h4>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Client:</span>
                      <div className="font-semibold">{drawerData.client}</div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Montant:</span>
                      <div className="font-semibold">{drawerData.amount}</div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Date d'échéance:</span>
                      <div>{drawerData.dueDate}</div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Retard:</span>
                      <div className="font-medium text-red-600">{drawerData.daysOverdue} jours</div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Informations de contact
                  </h4>
                  <div className="space-y-2 text-sm">
                    {drawerData.clientPhone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{drawerData.clientPhone}</span>
                      </div>
                    )}
                    {drawerData.clientEmail && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{drawerData.clientEmail}</span>
                      </div>
                    )}
                    {drawerData.clientAddress && (
                      <div className="flex items-start">
                        <div className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground">📍</div>
                        <div className="whitespace-pre-line">{drawerData.clientAddress}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Documents disponibles
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: "Facture originale", icon: "📄" },
                      { name: "Devis signé", icon: "📝" },
                      { name: "Historique des relances", icon: "📜" }
                    ].map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{doc.icon}</span>
                          <span className="font-medium">{doc.name}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log(`Téléchargement: ${doc.name}`)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-4 border-t">
                  {drawerData.status === 'relance1' && (
                    <Button className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer relance 2
                    </Button>
                  )}
                  {drawerData.status === 'relance2' && (
                    <Button className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Envoyer relance 3
                    </Button>
                  )}
                  {drawerData.status === 'relance3' && (
                    <Button variant="destructive" className="w-full">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Mise en demeure
                    </Button>
                  )}
                  {drawerData.status === 'contentieux' && (
                    <Button variant="destructive" className="w-full">
                      <Scale className="h-4 w-4 mr-2" />
                      Dossier tribunal
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default PaymentRelances;