import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Search, Filter, Eye, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useQuotes } from '@/hooks/use-quotes';
import { useInvoices } from '@/hooks/use-invoices';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useCredits } from '@/hooks/use-credits';
import { useVehicles } from '@/hooks/use-vehicles';
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
  onView,
  onEdit
}: { 
  icon: React.ReactNode; 
  title: string; 
  date: string; 
  customer: string; 
  vehicle: string; 
  onView: () => void;
  onEdit: () => void;
}) => {
  return (
    <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-white">
      <div className="bg-gray-100 p-3 rounded-lg mr-4">
        {icon}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        
        <p className="text-sm text-gray-600 mt-1">
          Client: {customer} | Véhicule: {vehicle}
        </p>
        
        <p className="text-xs text-gray-400 mt-2">{date}</p>
      </div>
      
      <div className="ml-4 flex space-x-2">
        <Button variant="outline" size="icon" onClick={onView}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          onClick={onEdit}
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
        >
          <Pencil className="h-4 w-4" />
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

  // États pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    expertise: true,
    quotes: true,
    orders: true,
    invoices: true,
    credits: true
  });

  // États pour la pagination
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Hooks pour récupérer les données
  const { reports: expertiseReports, isLoading: expertiseLoading } = useExpertiseReports();
  const { quotes, isLoading: quotesLoading } = useQuotes();
  const { orders: repairOrders, isLoading: ordersLoading } = useRepairOrders();
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const { credits, isLoading: creditsLoading } = useCredits();
  const { vehicles } = useVehicles();

  // Compter les documents et gérer le pluriel
  const expertiseCount = expertiseReports?.length || 0;
  const quotesCount = quotes?.length || 0;
  const repairOrdersCount = repairOrders?.length || 0;
  const invoicesCount = invoices?.length || 0;
  const creditsCount = credits?.length || 0;

  const getDocumentLabel = (count: number) => {
    return count <= 1 ? 'document' : 'documents';
  };

  // Créer une liste de tous les documents avec la logique de véhicule du tableau de bord
  const allDocuments = React.useMemo(() => {
    const documents = [];

    // Fonction pour obtenir les informations du véhicule comme dans le tableau de bord
    const getVehicleInfo = (vehicleId: string) => {
      if (!vehicleId || !vehicles) return 'Véhicule non spécifié';
      
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (!vehicle) return 'Véhicule non spécifié';
      
      return `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''} - ${vehicle.license_plate || ''}`.replace(/^\s*-\s*/, '').replace(/\s*-\s*$/, '');
    };

    // Ajouter les rapports d'expertise
    if (expertiseReports && activeFilters.expertise) {
      expertiseReports.forEach(report => {
        const createdDate = new Date(report.created_at);
        documents.push({
          id: `expertise-${report.id}`,
          originalId: report.id,
          icon: <FileText className="h-5 w-5 text-blue-600" />,
          title: `Rapport d'expertise`,
          date: `Créé le ${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
          customer: report.clients ? `${report.clients.first_name} ${report.clients.last_name}` : 'Client non spécifié',
          vehicle: getVehicleInfo(report.vehicle_id),
          status: 'Importé',
          statusColor: 'bg-blue-100 text-blue-800',
          timestamp: new Date(report.created_at).getTime(),
          type: 'expertise'
        });
      });
    }

    // Ajouter les devis
    if (quotes && activeFilters.quotes) {
      quotes.forEach(quote => {
        const createdDate = new Date(quote.created_at);
        documents.push({
          id: `quote-${quote.id}`,
          originalId: quote.id,
          icon: <FileText className="h-5 w-5 text-amber-600" />,
          title: `Devis`,
          date: `Créé le ${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
          customer: quote.clients ? `${quote.clients.first_name} ${quote.clients.last_name}` : 'Client non spécifié',
          vehicle: getVehicleInfo(quote.vehicle_id),
          status: quote.status === 'draft' ? 'En attente' : 'Validé',
          statusColor: quote.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800',
          timestamp: new Date(quote.created_at).getTime(),
          type: 'quote'
        });
      });
    }

    // Ajouter les ordres de réparation
    if (repairOrders && activeFilters.orders) {
      repairOrders.forEach(order => {
        const createdDate = new Date(order.created_at);
        documents.push({
          id: `order-${order.id}`,
          originalId: order.id,
          icon: <FileText className="h-5 w-5 text-green-600" />,
          title: `Ordre de réparation`,
          date: `Créé le ${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
          customer: order.clients ? `${order.clients.first_name} ${order.clients.last_name}` : 'Client non spécifié',
          vehicle: getVehicleInfo(order.vehicle_id),
          status: order.status === 'signed' ? 'Signé' : 'En attente',
          statusColor: order.status === 'signed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800',
          timestamp: new Date(order.created_at).getTime(),
          type: 'order'
        });
      });
    }

    // Ajouter les factures
    if (invoices && activeFilters.invoices) {
      invoices.forEach(invoice => {
        const createdDate = new Date(invoice.created_at);
        documents.push({
          id: `invoice-${invoice.id}`,
          originalId: invoice.id,
          icon: <FileText className="h-5 w-5 text-purple-600" />,
          title: `Facture`,
          date: `Créé le ${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
          customer: invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Client non spécifié',
          vehicle: getVehicleInfo(invoice.vehicle_id),
          status: 'Payé',
          statusColor: 'bg-purple-100 text-purple-800',
          timestamp: new Date(invoice.created_at).getTime(),
          type: 'invoice'
        });
      });
    }

    // Ajouter les avoirs
    if (credits && activeFilters.credits) {
      credits.forEach(credit => {
        const createdDate = new Date(credit.created_at);
        
        // Pour les avoirs, utiliser directement les données de véhicule récupérées
        let vehicleDisplay = 'Véhicule non spécifié';
        if (credit.vehicles) {
          const vehicle = credit.vehicles as any; // Cast pour éviter les erreurs TypeScript
          const brand = vehicle.car_brands?.name || '';
          const model = vehicle.car_models?.name || '';
          const licensePlate = vehicle.license_plate || '';
          
          if (brand || model || licensePlate) {
            const parts = [];
            if (brand || model) {
              parts.push(`${brand} ${model}`.trim());
            }
            if (licensePlate) {
              parts.push(licensePlate);
            }
            vehicleDisplay = parts.join(' - ');
          }
        }
        
        documents.push({
          id: `credit-${credit.id}`,
          originalId: credit.id,
          icon: <FileText className="h-5 w-5 text-red-600" />,
          title: `Avoir`,
          date: `Créé le ${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
          customer: credit.clients ? `${credit.clients.first_name} ${credit.clients.last_name}` : 'Client non spécifié',
          vehicle: vehicleDisplay,
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

    // Trier par date (plus récent en premier)
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [expertiseReports, quotes, repairOrders, invoices, credits, vehicles, searchTerm, activeFilters]);

  // Documents à afficher (avec pagination)
  const displayedDocuments = allDocuments.slice(0, displayCount);

  // Fonction pour charger plus de documents
  const loadMoreDocuments = useCallback(() => {
    if (isLoadingMore || displayCount >= allDocuments.length) {
      console.log('Cannot load more:', { isLoadingMore, displayCount, totalDocuments: allDocuments.length });
      return;
    }
    
    console.log('Loading more documents...', { 
      currentCount: displayCount, 
      totalDocuments: allDocuments.length 
    });
    setIsLoadingMore(true);
    
    setTimeout(() => {
      setDisplayCount(prev => {
        const newCount = Math.min(prev + 5, allDocuments.length);
        console.log('New document count:', newCount);
        return newCount;
      });
      setIsLoadingMore(false);
    }, 500);
  }, [displayCount, allDocuments.length, isLoadingMore]);

  // Fonction pour gérer le scroll
  const handleScroll = useCallback(() => {
    // Vérifier si on est proche du bas de la page
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 200;
    
    console.log('Scroll event:', { 
      scrollTop: Math.round(scrollTop), 
      scrollHeight, 
      clientHeight, 
      scrolledToBottom,
      canLoadMore: displayCount < allDocuments.length
    });
    
    if (scrolledToBottom && displayCount < allDocuments.length && !isLoadingMore) {
      console.log('Triggering load more documents');
      loadMoreDocuments();
    }
  }, [displayCount, allDocuments.length, isLoadingMore, loadMoreDocuments]);

  // Écouter les événements de scroll
  useEffect(() => {
    console.log('Setting up scroll listener');
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      console.log('Removing scroll listener');
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Reset pagination when filters or search change
  useEffect(() => {
    console.log('Resetting pagination due to filter/search change');
    setDisplayCount(10);
  }, [searchTerm, activeFilters]);

  const handleViewDocument = async (document) => {
    try {
      switch (document.type) {
        case 'expertise':
          const expertiseReport = expertiseReports?.find(r => r.id === document.originalId);
          if (expertiseReport?.document_url) {
            window.open(expertiseReport.document_url, '_blank');
          }
          break;
        case 'quote':
          const quote = quotes?.find(q => q.id === document.originalId);
          if (quote) {
            await openPDFInNewTab('quote', quote);
          }
          break;
        case 'order':
          const order = repairOrders?.find(o => o.id === document.originalId);
          if (order) {
            await openPDFInNewTab('order', order);
          }
          break;
        case 'invoice':
          const invoice = invoices?.find(i => i.id === document.originalId);
          if (invoice) {
            await openPDFInNewTab('invoice', invoice);
          }
          break;
        case 'credit':
          const credit = credits?.find(c => c.id === document.originalId);
          if (credit) {
            await openPDFInNewTab('credit', credit);
          }
          break;
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du PDF:', error);
    }
  };

  const openPDFInNewTab = async (type: string, data: any) => {
    try {
      let doc;
      
      switch (type) {
        case 'quote': {
          const { prepareQuoteDataForPDF } = await import('@/utils/quotePDFGeneration');
          const preparedData = await prepareQuoteDataForPDF(data, {});
          const { default: InvoicePDF } = await import('@/components/invoices/InvoicePDF');
          doc = InvoicePDF({ 
            invoice: preparedData.quote as any,
            companyData: preparedData.companyData, 
            receipts: [],
            clientData: preparedData.clientData,
            vehicleData: preparedData.vehicleData,
            template: preparedData.template || 'default',
            documentType: 'quote'
          });
          break;
        }
        case 'order': {
          const { prepareRepairOrderDataForPDF } = await import('@/utils/repairOrderPDFGeneration');
          const preparedData = await prepareRepairOrderDataForPDF(data, {});
          const { default: InvoicePDF } = await import('@/components/invoices/InvoicePDF');
          doc = InvoicePDF({ 
            invoice: preparedData.repairOrder as any,
            companyData: preparedData.companyData, 
            receipts: [],
            clientData: preparedData.clientData,
            vehicleData: preparedData.vehicleData,
            template: preparedData.template || 'default',
            documentType: 'repair_order'
          });
          break;
        }
        case 'invoice': {
          const { prepareInvoiceDataForPDF } = await import('@/utils/invoicePDFGeneration');
          const preparedData = await prepareInvoiceDataForPDF(data, {});
          const { default: InvoicePDF } = await import('@/components/invoices/InvoicePDF');
          
          // Adapter les données comme dans generateInvoicePDFWithTemplate
          const pdfData = {
            ...preparedData.clientData,
            number: preparedData.invoiceData.number,
            billingDate: preparedData.invoiceData.billingDate,
            dueDate: preparedData.invoiceData.dueDate,
            claimNumber: preparedData.invoiceData.claimNumber,
            vehicle: preparedData.invoiceData.vehicle,
            licensePlate: preparedData.invoiceData.licensePlate,
            mileage: preparedData.invoiceData.mileage,
            items: preparedData.items,
            totals: preparedData.totals
          };
          
          doc = InvoicePDF({ 
            invoice: data,
            companyData: preparedData.companyData, 
            receipts: [],
            clientData: pdfData,
            vehicleData: null,
            template: preparedData.template || 'default',
            documentType: 'invoice'
          });
          break;
        }
        case 'credit': {
          const { prepareCreditDataForPDF } = await import('@/utils/creditPDFGeneration');
          const preparedData = await prepareCreditDataForPDF(data, {});
          const { default: InvoicePDF } = await import('@/components/invoices/InvoicePDF');
          doc = InvoicePDF({ 
            invoice: preparedData.credit as any,
            companyData: preparedData.companyData, 
            receipts: [],
            clientData: preparedData.clientData,
            vehicleData: preparedData.vehicleData,
            template: preparedData.template || 'default',
            documentType: 'credit'
          });
          break;
        }
        default:
          return;
      }

      // Générer le blob PDF
      const { pdf } = await import('@react-pdf/renderer');
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      
      // Créer une URL pour le blob et l'ouvrir dans un nouvel onglet
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Nettoyer l'URL après un délai pour permettre l'ouverture
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    }
  };

  const handleEditDocument = (document) => {
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

  const handleFilterChange = (filterType: string, checked: boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: checked
    }));
  };

  const isLoading = expertiseLoading || quotesLoading || ordersLoading || invoicesLoading || creditsLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
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
    <div className="p-6 space-y-6">
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-white border-gray-200">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                checked={activeFilters.expertise}
                onCheckedChange={(checked) => setActiveFilters(prev => ({ ...prev, expertise: checked }))}
              >
                Rapports d'expertise
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.quotes}
                onCheckedChange={(checked) => setActiveFilters(prev => ({ ...prev, quotes: checked }))}
              >
                Devis
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.orders}
                onCheckedChange={(checked) => setActiveFilters(prev => ({ ...prev, orders: checked }))}
              >
                Ordres de réparation
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.invoices}
                onCheckedChange={(checked) => setActiveFilters(prev => ({ ...prev, invoices: checked }))}
              >
                Factures
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.credits}
                onCheckedChange={(checked) => setActiveFilters(prev => ({ ...prev, credits: checked }))}
              >
                Avoirs
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white">
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
        {displayedDocuments.length > 0 ? (
          <>
            {displayedDocuments.map((document) => (
              <DocumentItem 
                key={document.id}
                icon={document.icon}
                title={document.title}
                date={document.date}
                customer={document.customer}
                vehicle={document.vehicle}
                onView={() => handleViewDocument(document)}
                onEdit={() => handleEditDocument(document)}
              />
            ))}
            
            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            )}
            
            {displayCount < allDocuments.length && !isLoadingMore && (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">
                  Faites défiler vers le bas pour charger plus de documents ({displayedDocuments.length}/{allDocuments.length})
                </p>
                <Button 
                  variant="outline" 
                  onClick={loadMoreDocuments}
                  className="mt-2"
                >
                  Charger plus
                </Button>
              </div>
            )}
            
            {displayCount >= allDocuments.length && allDocuments.length > 10 && (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">
                  Tous les documents ont été chargés ({allDocuments.length} au total)
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Aucun document</h3>
            <p>
              {searchTerm || Object.values(activeFilters).some(f => !f) 
                ? 'Aucun document ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre premier document.'
              }
            </p>
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
