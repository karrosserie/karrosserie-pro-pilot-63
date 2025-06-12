import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuotes } from '@/hooks/use-quotes';
import { useInvoices } from '@/hooks/use-invoices';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useCredits } from '@/hooks/use-credits';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import ExpertiseReportDialog from '@/components/expertise/ExpertiseReportDialog';
import { CreditDialog } from '@/components/credits/CreditDialog';

const DocumentItem = ({ 
  icon, 
  title, 
  date, 
  customer, 
  vehicle, 
  status, 
  statusColor,
  onView,
  onEdit
}: { 
  icon: React.ReactNode; 
  title: string; 
  date: string; 
  customer: string; 
  vehicle: string; 
  status: string; 
  statusColor: string; 
  onView: () => void;
  onEdit: () => void;
}) => {
  return (
    <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <div className="bg-gray-100 p-3 rounded-lg mr-4">
        {icon}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded inline-block ${statusColor}`}>
            {status}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mt-1">
          Client: {customer} | Véhicule: {vehicle}
        </p>
        
        <p className="text-xs text-gray-400 mt-2">{date}</p>
      </div>
      
      <div className="ml-4">
        <Button variant="outline" size="sm" className="mb-2 w-full" onClick={onView}>
          Voir
        </Button>
        <Button size="sm" className="w-full" onClick={onEdit}>
          Éditer
        </Button>
      </div>
    </div>
  );
};

const Documents = () => {
  // États pour les dialogues
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isRepairOrderDialogOpen, setIsRepairOrderDialogOpen] = useState(false);
  const [isExpertiseDialogOpen, setIsExpertiseDialogOpen] = useState(false);
  const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false);

  // États pour les dialogues de visualisation/édition
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedRepairOrder, setSelectedRepairOrder] = useState(null);
  const [selectedExpertiseReport, setSelectedExpertiseReport] = useState(null);
  const [selectedCredit, setSelectedCredit] = useState(null);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Hooks pour récupérer les données
  const { reports: expertiseReports, isLoading: expertiseLoading } = useExpertiseReports();
  const { quotes, isLoading: quotesLoading } = useQuotes();
  const { orders: repairOrders, isLoading: ordersLoading } = useRepairOrders();
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const { credits, isLoading: creditsLoading } = useCredits();

  // Compter les documents et gérer le pluriel
  const expertiseCount = expertiseReports?.length || 0;
  const quotesCount = quotes?.length || 0;
  const repairOrdersCount = repairOrders?.length || 0;
  const invoicesCount = invoices?.length || 0;
  const creditsCount = credits?.length || 0;

  const getDocumentLabel = (count: number) => {
    return count <= 1 ? 'document' : 'documents';
  };

  // Créer une liste de tous les documents récents
  const allRecentDocuments = React.useMemo(() => {
    const documents = [];

    // Ajouter les rapports d'expertise
    if (expertiseReports) {
      expertiseReports.slice(0, 2).forEach(report => {
        documents.push({
          id: `expertise-${report.id}`,
          originalId: report.id,
          icon: <FileText className="h-5 w-5 text-blue-600" />,
          title: `Rapport d'expertise`,
          date: `Créé le ${new Date(report.created_at).toLocaleDateString('fr-FR')}`,
          customer: report.clients ? `${report.clients.first_name} ${report.clients.last_name}` : 'Client non spécifié',
          vehicle: report.vehicles ? `${report.vehicles.brand} ${report.vehicles.model} - ${report.vehicles.license_plate}` : 'Véhicule non spécifié',
          status: 'Importé',
          statusColor: 'bg-blue-100 text-blue-800',
          timestamp: new Date(report.created_at).getTime(),
          type: 'expertise'
        });
      });
    }

    // Ajouter les devis
    if (quotes) {
      quotes.slice(0, 2).forEach(quote => {
        documents.push({
          id: `quote-${quote.id}`,
          originalId: quote.id,
          icon: <FileText className="h-5 w-5 text-amber-600" />,
          title: `Devis`,
          date: `Créé le ${new Date(quote.created_at).toLocaleDateString('fr-FR')}`,
          customer: quote.clients ? `${quote.clients.first_name} ${quote.clients.last_name}` : 'Client non spécifié',
          vehicle: quote.vehicles ? `${quote.vehicles.brand} ${quote.vehicles.model} - ${quote.vehicles.license_plate}` : 'Véhicule non spécifié',
          status: quote.status === 'draft' ? 'En attente' : 'Validé',
          statusColor: quote.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800',
          timestamp: new Date(quote.created_at).getTime(),
          type: 'quote'
        });
      });
    }

    // Ajouter les ordres de réparation
    if (repairOrders) {
      repairOrders.slice(0, 2).forEach(order => {
        documents.push({
          id: `order-${order.id}`,
          originalId: order.id,
          icon: <FileText className="h-5 w-5 text-green-600" />,
          title: `Ordre de réparation`,
          date: `Créé le ${new Date(order.created_at).toLocaleDateString('fr-FR')}`,
          customer: order.clients ? `${order.clients.first_name} ${order.clients.last_name}` : 'Client non spécifié',
          vehicle: order.vehicles ? `${order.vehicles.brand} ${order.vehicles.model} - ${order.vehicles.license_plate}` : 'Véhicule non spécifié',
          status: order.status === 'signed' ? 'Signé' : 'En attente',
          statusColor: order.status === 'signed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800',
          timestamp: new Date(order.created_at).getTime(),
          type: 'order'
        });
      });
    }

    // Ajouter les factures
    if (invoices) {
      invoices.slice(0, 2).forEach(invoice => {
        documents.push({
          id: `invoice-${invoice.id}`,
          originalId: invoice.id,
          icon: <FileText className="h-5 w-5 text-purple-600" />,
          title: `Facture`,
          date: `Créé le ${new Date(invoice.created_at).toLocaleDateString('fr-FR')}`,
          customer: invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Client non spécifié',
          vehicle: invoice.vehicles ? `${invoice.vehicles.brand} ${invoice.vehicles.model} - ${invoice.vehicles.license_plate}` : 'Véhicule non spécifié',
          status: 'Payé',
          statusColor: 'bg-purple-100 text-purple-800',
          timestamp: new Date(invoice.created_at).getTime(),
          type: 'invoice'
        });
      });
    }

    // Ajouter les avoirs
    if (credits) {
      credits.slice(0, 2).forEach(credit => {
        documents.push({
          id: `credit-${credit.id}`,
          originalId: credit.id,
          icon: <FileText className="h-5 w-5 text-red-600" />,
          title: `Avoir`,
          date: `Créé le ${new Date(credit.created_at).toLocaleDateString('fr-FR')}`,
          customer: credit.clients ? `${credit.clients.first_name} ${credit.clients.last_name}` : 'Client non spécifié',
          vehicle: credit.vehicles ? `${credit.vehicles.brand} ${credit.vehicles.model} - ${credit.vehicles.license_plate}` : 'Véhicule non spécifié',
          status: 'Émis',
          statusColor: 'bg-red-100 text-red-800',
          timestamp: new Date(credit.created_at).getTime(),
          type: 'credit'
        });
      });
    }

    // Filtrer selon le terme de recherche
    const filtered = documents.filter(doc => 
      searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Trier par date (plus récent en premier) et prendre les 4 plus récents
    return filtered
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 4);
  }, [expertiseReports, quotes, repairOrders, invoices, credits, searchTerm]);

  const handleViewDocument = (document) => {
    switch (document.type) {
      case 'expertise':
        const expertiseReport = expertiseReports?.find(r => r.id === document.originalId);
        setSelectedExpertiseReport(expertiseReport);
        setIsExpertiseDialogOpen(true);
        break;
      case 'quote':
        const quote = quotes?.find(q => q.id === document.originalId);
        setSelectedQuote(quote);
        setIsQuoteDialogOpen(true);
        break;
      case 'order':
        const order = repairOrders?.find(o => o.id === document.originalId);
        setSelectedRepairOrder(order);
        setIsRepairOrderDialogOpen(true);
        break;
      case 'invoice':
        const invoice = invoices?.find(i => i.id === document.originalId);
        setSelectedInvoice(invoice);
        setIsInvoiceDialogOpen(true);
        break;
      case 'credit':
        const credit = credits?.find(c => c.id === document.originalId);
        setSelectedCredit(credit);
        setIsCreditDialogOpen(true);
        break;
    }
  };

  const handleEditDocument = (document) => {
    // Même logique que pour la visualisation, mais en mode édition
    handleViewDocument(document);
  };

  const isLoading = expertiseLoading || quotesLoading || ordersLoading || invoicesLoading || creditsLoading;

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestion des documents</h1>
          <p className="text-gray-600 mt-1">Consultez et gérez tous vos documents: rapports d'expertise, devis, ordres de réparation, factures et avoirs.</p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des documents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestion des documents</h1>
        <p className="text-gray-600 mt-1">Consultez et gérez tous vos documents: rapports d'expertise, devis, ordres de réparation, factures et avoirs.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="card-container text-center flex flex-col">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="font-bold">Rapports d'expertise</h3>
          <p className="text-sm text-gray-600 mt-1">{expertiseCount} {getDocumentLabel(expertiseCount)}</p>
          <div className="flex-1"></div>
          <Link to="/documents/expertise" className="mt-3">
            <Button className="w-full" variant="outline">
              Voir tout
            </Button>
          </Link>
        </div>
        
        <div className="card-container text-center flex flex-col">
          <div className="flex justify-center mb-2">
            <div className="bg-amber-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <h3 className="font-bold">Devis</h3>
          <p className="text-sm text-gray-600 mt-1">{quotesCount} {getDocumentLabel(quotesCount)}</p>
          <div className="flex-1"></div>
          <Link to="/documents/devis" className="mt-3">
            <Button className="w-full" variant="outline">
              Voir tout
            </Button>
          </Link>
        </div>
        
        <div className="card-container text-center flex flex-col">
          <div className="flex justify-center mb-2">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="font-bold">Ordres de réparation</h3>
          <p className="text-sm text-gray-600 mt-1">{repairOrdersCount} {getDocumentLabel(repairOrdersCount)}</p>
          <div className="flex-1"></div>
          <Link to="/documents/ordres" className="mt-3">
            <Button className="w-full" variant="outline">
              Voir tout
            </Button>
          </Link>
        </div>
        
        <div className="card-container text-center flex flex-col">
          <div className="flex justify-center mb-2">
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="font-bold">Factures</h3>
          <p className="text-sm text-gray-600 mt-1">{invoicesCount} {getDocumentLabel(invoicesCount)}</p>
          <div className="flex-1"></div>
          <Link to="/documents/factures" className="mt-3">
            <Button className="w-full" variant="outline">
              Voir tout
            </Button>
          </Link>
        </div>

        <div className="card-container text-center flex flex-col">
          <div className="flex justify-center mb-2">
            <div className="bg-red-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h3 className="font-bold">Avoirs</h3>
          <p className="text-sm text-gray-600 mt-1">{creditsCount} {getDocumentLabel(creditsCount)}</p>
          <div className="flex-1"></div>
          <Link to="/documents/avoirs" className="mt-3">
            <Button className="w-full" variant="outline">
              Voir tout
            </Button>
          </Link>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
            />
          </div>
          
          <Button 
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="btn-primary">
                <FileText className="h-4 w-4 mr-2" />
                Nouveau
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => { setSelectedExpertiseReport(null); setIsExpertiseDialogOpen(true); }}>
                <FileText className="mr-2 h-4 w-4" />
                Rapport d'expertise
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedQuote(null); setIsQuoteDialogOpen(true); }}>
                <FileText className="mr-2 h-4 w-4" />
                Devis
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedRepairOrder(null); setIsRepairOrderDialogOpen(true); }}>
                <FileText className="mr-2 h-4 w-4" />
                Ordre de réparation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedInvoice(null); setIsInvoiceDialogOpen(true); }}>
                <FileText className="mr-2 h-4 w-4" />
                Facture
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedCredit(null); setIsCreditDialogOpen(true); }}>
                <FileText className="mr-2 h-4 w-4" />
                Avoir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="space-y-4">
        {allRecentDocuments.length > 0 ? (
          allRecentDocuments.map((document) => (
            <DocumentItem 
              key={document.id}
              icon={document.icon}
              title={document.title}
              date={document.date}
              customer={document.customer}
              vehicle={document.vehicle}
              status={document.status}
              statusColor={document.statusColor}
              onView={() => handleViewDocument(document)}
              onEdit={() => handleEditDocument(document)}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Aucun document</h3>
            <p>Commencez par créer votre premier document.</p>
          </div>
        )}
      </div>

      {/* Dialogues pour la création de documents */}
      <ExpertiseReportDialog
        report={selectedExpertiseReport}
        open={isExpertiseDialogOpen}
        onOpenChange={setIsExpertiseDialogOpen}
      />

      <QuoteDialog
        quote={selectedQuote}
        open={isQuoteDialogOpen}
        onOpenChange={setIsQuoteDialogOpen}
      />

      <RepairOrderDialog
        order={selectedRepairOrder}
        open={isRepairOrderDialogOpen}
        onOpenChange={setIsRepairOrderDialogOpen}
      />

      <InvoiceDialog
        invoice={selectedInvoice}
        open={isInvoiceDialogOpen}
        onOpenChange={setIsInvoiceDialogOpen}
      />

      <CreditDialog
        credit={selectedCredit}
        open={isCreditDialogOpen}
        onOpenChange={setIsCreditDialogOpen}
      />
    </div>
  );
};

export default Documents;
