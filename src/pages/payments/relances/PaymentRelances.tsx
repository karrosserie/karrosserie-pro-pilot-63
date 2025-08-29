import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const { formattedInvoices, loading } = useUnpaidInvoices();
  const [filter, setFilter] = useState<string>('all');
  const [modalData, setModalData] = useState<any>(null);

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
    relance1: formattedInvoices.filter(i => i.status === 'relance1').length,
    relance2: formattedInvoices.filter(i => i.status === 'relance2').length,
    relance3: formattedInvoices.filter(i => i.status === 'relance3').length,
    contentieux: formattedInvoices.filter(i => i.status === 'contentieux').length,
    totalAmount: formattedInvoices.reduce((sum, invoice) => {
      const amount = parseFloat(invoice.amount.replace(' €', '').replace(',', '.'));
      return sum + amount;
    }, 0).toLocaleString('fr-FR') + ' €'
  };

  const showDetails = (invoice: any) => {
    setModalData(invoice);
  };

  const closeModal = () => {
    setModalData(null);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.relance1}</div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Relance 1
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.relance2}</div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Relance 2
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.relance3}</div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Relance 3
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.contentieux}</div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Contentieux
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalAmount}</div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Total impayés
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

      {/* Modal */}
      {modalData && (
        <InvoiceDetailModal 
          invoice={modalData} 
          isOpen={!!modalData} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

// Modal Component
interface InvoiceDetailModalProps {
  invoice: any;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ invoice, isOpen, onClose }) => {
  const processSteps = [
    { step: 1, text: 'Facture émise', status: 'facture' },
    { step: 2, text: 'Relance 1', status: 'relance1' },
    { step: 3, text: 'Relance 2', status: 'relance2' },
    { step: 4, text: 'Relance 3', status: 'relance3' },
    { step: 5, text: 'Contentieux', status: 'contentieux' }
  ];

  const currentStatusIndex = processSteps.findIndex(step => step.status === invoice.status);

  const handleDownload = (documentName: string) => {
    console.log(`Téléchargement simulé: ${documentName} pour ${invoice.id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-foreground">
            Détail de la facture {invoice.id}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Process Steps */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">Progression du recouvrement</h4>
            <div className="flex justify-between items-center mb-6 relative">
              {processSteps.map((step, index) => (
                <div key={step.step} className="flex flex-col items-center flex-1 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                    index < currentStatusIndex ? 'bg-green-500' : 
                    index === currentStatusIndex ? 'bg-orange-500' : 'bg-gray-300'
                  }`}>
                    {step.step}
                  </div>
                  <div className={`mt-2 text-center text-xs ${
                    index < currentStatusIndex ? 'text-green-600 font-medium' : 
                    index === currentStatusIndex ? 'text-orange-600 font-medium' : 'text-gray-500'
                  }`}>
                    {step.text}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div 
                      className={`absolute top-4 w-full h-0.5 transition-colors ${
                        index < currentStatusIndex ? 'bg-green-500' : 'bg-gray-300'
                      }`} 
                      style={{ 
                        left: '50%', 
                        width: `calc(100% - 32px)`, 
                        zIndex: -1 
                      }}
                    />
                  )}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Client:</span>
                <div className="font-semibold">{invoice.client}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Montant:</span>
                <div className="font-semibold">{invoice.amount}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Date d'échéance:</span>
                <div>{invoice.dueDate}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Retard:</span>
                <div className="font-medium text-red-600">{invoice.daysOverdue} jours</div>
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
              {invoice.clientPhone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{invoice.clientPhone}</span>
                </div>
              )}
              {invoice.clientEmail && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{invoice.clientEmail}</span>
                </div>
              )}
              {invoice.clientAddress && (
                <div className="flex items-start">
                  <div className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground">📍</div>
                  <div className="whitespace-pre-line">{invoice.clientAddress}</div>
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
                    onClick={() => handleDownload(doc.name)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Télécharger
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            {invoice.status === 'relance1' && (
              <Button className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Envoyer relance 2
              </Button>
            )}
            {invoice.status === 'relance2' && (
              <Button className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Envoyer relance 3
              </Button>
            )}
            {invoice.status === 'relance3' && (
              <Button variant="destructive" className="flex-1">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Mise en demeure
              </Button>
            )}
            {invoice.status === 'contentieux' && (
              <Button variant="destructive" className="flex-1">
                <Scale className="h-4 w-4 mr-2" />
                Dossier tribunal
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRelances;