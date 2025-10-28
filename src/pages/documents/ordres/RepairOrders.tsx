import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';
import { RepairOrdersTable } from '@/components/repair-orders/RepairOrdersTable';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import RepairOrderEmailDialog from '@/components/repair-orders/RepairOrderEmailDialog';
import RepairOrderSignatureDialog from '@/components/repair-orders/RepairOrderSignatureDialog';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { Invoice } from '@/services/supabase/invoices';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { useToast } from '@/hooks/use-toast';
import RepairOrderViewerModal from '@/components/repair-orders/RepairOrderViewerModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useIsMobile } from '@/hooks/use-mobile';
import RepairOrderMobileCard from '@/components/repair-orders/RepairOrderMobileCard';
import { supabase } from '@/integrations/supabase/client';
import { useUserOnboardingProgress } from '@/hooks/use-user-onboarding-progress';
const RepairOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null);
  const [selectedOrderForEmail, setSelectedOrderForEmail] = useState<RepairOrder | null>(null);
  const [selectedOrderForSignature, setSelectedOrderForSignature] = useState<RepairOrder | null>(null);
  const [selectedOrderForConversion, setSelectedOrderForConversion] = useState<RepairOrder | null>(null);
  const [selectedOrderForDeletion, setSelectedOrderForDeletion] = useState<RepairOrder | null>(null);
  const [prefilledInvoice, setPrefilledInvoice] = useState<Partial<Invoice> | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showSignedDialog, setShowSignedDialog] = useState(false);
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();
  const { shouldShowRepairOrderHelp, markHelpAsSeen } = useUserOnboardingProgress();
  const {
    orders,
    isLoading,
    error,
    deleteOrder,
    archiveOrder,
    restoreOrder,
    updateOrder
  } = useRepairOrders();
  const filteredOrders = orders?.filter(order => {
    const searchLower = searchTerm.toLowerCase();

    // Search by reference
    let matchesSearch = false;
    if (order.reference?.toLowerCase().includes(searchLower)) {
      matchesSearch = true;
    }

    // Search by client name
    if (order.clients && `${order.clients.first_name} ${order.clients.last_name}`.toLowerCase().includes(searchLower)) {
      matchesSearch = true;
    }

    // Search by vehicle info
    if (order.vehicles) {
      const brand = order.vehicles.car_brands?.name || '';
      const model = order.vehicles.car_models?.name || '';
      const licensePlate = order.vehicles.license_plate || '';
      const vehicleInfo = `${brand} ${model} - ${licensePlate}`.toLowerCase();
      if (vehicleInfo.includes(searchLower)) {
        matchesSearch = true;
      }
    }

    // Apply search filter
    if (searchTerm && !matchesSearch) {
      return false;
    }

    // Apply archive filter
    const matchesArchiveStatus = showArchived ? order.archived : !order.archived;
    return matchesArchiveStatus;
  }) || [];

  // Effet pour ouvrir automatiquement un ordre de réparation depuis l'URL
  useEffect(() => {
    const openOrderId = searchParams.get('openOrder');
    if (openOrderId && orders && orders.length > 0) {
      const orderToOpen = orders.find(order => order.id === openOrderId);
      if (orderToOpen) {
        setSelectedOrder(orderToOpen);
        setViewerModalOpen(true); // Ouvrir la fenêtre d'aperçu
        // Nettoyer le paramètre URL après ouverture
        setSearchParams(params => {
          params.delete('openOrder');
          return params;
        });
      }
    }
  }, [orders, searchParams, setSearchParams]);

  // Afficher la pop-up d'information sur la signature si pas encore vue
  useEffect(() => {
    if (shouldShowRepairOrderHelp) {
      setShowInfoDialog(true);
    }
  }, [shouldShowRepairOrderHelp]);

  // Vérifier si un ordre est passé en "Signé" pour afficher la pop-up de félicitation
  useEffect(() => {
    const checkSignedOrders = () => {
      const checkedOrders = JSON.parse(localStorage.getItem('checked-signed-orders') || '[]');
      orders?.forEach(order => {
        if (order.status === 'Signé' && !checkedOrders.includes(order.id)) {
          setShowSignedDialog(true);
          checkedOrders.push(order.id);
          localStorage.setItem('checked-signed-orders', JSON.stringify(checkedOrders));
        }
      });
    };
    if (orders && orders.length > 0) {
      checkSignedOrders();
      const interval = setInterval(checkSignedOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [orders]);

  // Vérifier le statut de signature des ordres de réparation en attente
  useEffect(() => {
    console.log('=== DEBUT DE LA VERIFICATION DES SIGNATURES REPAIR ORDERS ===');
    console.log('Orders reçus:', orders);
    const checkRepairOrderSignatureStatus = async () => {
      if (!orders) {
        console.log('Pas d\'ordres disponibles');
        return;
      }
      console.log('Nombre total d\'ordres:', orders.length);
      const ordersWithSignaturePending = orders.filter(order => order.oodrive_contract_id && order.document_url && !order.signed_document_url);
      console.log('Ordres avec signature en attente trouvés:', ordersWithSignaturePending.length);
      console.log('Détails des ordres avec signature en attente:', ordersWithSignaturePending.map(o => ({
        id: o.id,
        reference: o.reference,
        oodrive_contract_id: o.oodrive_contract_id
      })));
      for (const order of ordersWithSignaturePending) {
        try {
          console.log(`=== APPEL API POUR ORDRE DE REPARATION ${order.id} ===`);
          console.log(`Contract ID: ${order.oodrive_contract_id}`);
          const url = `https://n8n.karrosserie.pro/webhook/e6854e25-9a51-4362-b9d2-9a18af911863?contractId=${order.oodrive_contract_id}`;
          console.log('URL de l\'appel API:', url);
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('Réponse API statut:', response.status);
          if (response.ok) {
            const data = await response.json();
            console.log('Données reçues de l\'API pour repair order:', data);

            // Vérifier si l'entrée unique (client) a signature_status = 'SIGNED'
            if (Array.isArray(data) && data.length === 1) {
              const isSigned = data[0].signature_status === 'SIGNED';
              console.log('La signature est-elle complète?', isSigned);
              if (isSigned) {
                console.log('Signature détectée, téléchargement du document signé depuis Oodrive...');
                try {
                  // Appeler la fonction edge pour télécharger le document signé depuis Oodrive
                  const downloadResponse = await supabase.functions.invoke('download-signed-repair-order', {
                    body: {
                      repairOrderId: order.id
                    }
                  });
                  if (downloadResponse.error) {
                    console.error('Erreur lors du téléchargement du document signé:', downloadResponse.error);
                    throw new Error(`Téléchargement échoué: ${downloadResponse.error.message}`);
                  }
                  if (downloadResponse.data.success) {
                    console.log('Document signé téléchargé avec succès:', downloadResponse.data.documentUrl);
                    // La fonction edge met déjà à jour l'ordre de réparation
                    // On n'a pas besoin de faire updateOrder.mutateAsync ici
                  } else {
                    throw new Error(downloadResponse.data.error || 'Erreur inconnue');
                  }
                } catch (downloadError) {
                  console.error('Erreur lors du téléchargement:', downloadError);
                  // En cas d'erreur de téléchargement, on met quand même à jour le statut
                  await updateOrder.mutateAsync({
                    id: order.id,
                    data: {
                      status: 'Signé'
                    }
                  });
                }
              }
            } else {
              console.log('Format de données inattendu pour repair order:', data);
            }
          } else {
            console.error('Erreur API:', response.status, await response.text());
          }
        } catch (error) {
          console.error(`Erreur lors de la vérification du statut pour l'ordre de réparation ${order.id}:`, error);
        }
      }
    };
    checkRepairOrderSignatureStatus();
  }, [orders, updateOrder]);
  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setDialogOpen(true);
  };
  const handleEditOrder = (order: RepairOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };
  const handleDownload = async (order: RepairOrder) => {
    try {
      // Si l'ordre a un document signé, le télécharger directement
      if (order.signed_document_url) {
        toast({
          title: "Téléchargement du document signé",
          description: "Téléchargement en cours..."
        });
        try {
          // Télécharger le fichier signé depuis Supabase Storage
          const response = await fetch(order.signed_document_url);
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `ordre-reparation-${order.reference}-signe.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast({
            title: "Téléchargement réussi",
            description: `Le document signé de l'ordre ${order.reference} a été téléchargé.`
          });
          return;
        } catch (downloadError) {
          console.error('Erreur lors du téléchargement du document signé:', downloadError);
          toast({
            title: "Erreur",
            description: "Impossible de télécharger le document signé. Génération d'un nouveau PDF...",
            variant: "destructive"
          });
          // Continue avec la génération normale si le téléchargement échoue
        }
      }

      // Génération normale d'un nouveau PDF
      toast({
        title: "Génération du PDF",
        description: "Génération du PDF en cours..."
      });
      const {
        generateRepairOrderPDFWithTemplate
      } = await import('@/utils/repairOrderPDFGeneration');
      const result = await generateRepairOrderPDFWithTemplate(order, {});
      if (result.success) {
        toast({
          title: "Téléchargement réussi",
          description: `L'ordre de réparation ${order.reference} a été téléchargé.`
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  const handlePrint = async (order: RepairOrder) => {
    try {
      toast({
        title: "Ouverture pour impression",
        description: `Ouverture de l'ordre de réparation ${order.reference} pour impression...`
      });
      const {
        printRepairOrderPDFWithTemplate
      } = await import('@/utils/repairOrderPDFGeneration');
      const result = await printRepairOrderPDFWithTemplate(order, {});
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le PDF pour impression. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  const handleSendEmail = (order: RepairOrder) => {
    setSelectedOrderForEmail(order);
    setEmailDialogOpen(true);
  };
  const handleSignOrder = (order: RepairOrder) => {
    setSelectedOrderForSignature(order);
    setSignatureDialogOpen(true);
  };
  const handleSendForOodriveSignature = async (order: RepairOrder) => {
    try {
      // Vérifier que le client a un numéro de téléphone
      if (!order.clients?.phone) {
        toast({
          title: "Numéro de téléphone manquant",
          description: "Le client doit avoir un numéro de téléphone pour recevoir la signature électronique.",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Préparation de la signature",
        description: "Génération du document en cours..."
      });

      // Importer les services nécessaires
      const {
        generateRepairOrderSignaturePDF
      } = await import('@/services/pdf/repairOrderSignaturePDFService');
      const {
        sendRepairOrderForSignature
      } = await import('@/services/api/repairOrderSignatureService');
      const {
        companyService
      } = await import('@/services/supabase/company');
      const {
        clientsService
      } = await import('@/services/supabase/clients');
      const {
        repairOrdersService
      } = await import('@/services/supabase/repair-orders');

      // Récupérer les données de la société
      const companyData = await companyService.getCompanyInfo();
      if (!companyData) {
        throw new Error('Données de l\'entreprise non trouvées');
      }

      // Récupérer les données complètes du client
      const clientData = await clientsService.getById(order.client_id);
      if (!clientData) {
        throw new Error('Données du client non trouvées');
      }

      // Récupérer l'ordre de réparation complet avec les données du devis
      const fullOrder = await repairOrdersService.getById(order.id);

      // Déterminer si on doit afficher les détails des items
      let showItemsDetails = true;

      // Vérifier si l'OR est lié à un rapport d'expertise
      const hasReportLink = fullOrder.source_report_id || fullOrder.modificatif_report_id;

      // Si pas de lien direct, vérifier si le devis associé est lié à un rapport
      if (!hasReportLink && fullOrder.quotes) {
        const quote = fullOrder.quotes;
        if (quote.source_report_id || quote.modificatif_report_id || quote.report_id) {
          showItemsDetails = false;
        }
      } else if (hasReportLink) {
        showItemsDetails = false;
      }

      console.log('Génération du PDF avec showItemsDetails:', showItemsDetails);

      // Générer le PDF avec ou sans détails selon le cas
      const documentUrl = await generateRepairOrderSignaturePDF(
        fullOrder, 
        companyData, 
        clientData,
        showItemsDetails
      );

      // Envoyer pour signature via Oodrive
      const signatureResponse = await sendRepairOrderForSignature(order.id, documentUrl, clientData);

      // Mettre à jour l'ordre de réparation avec l'URL du document et le contract_id
      await repairOrdersService.update(order.id, {
        document_url: documentUrl,
        oodrive_contract_id: signatureResponse.contract.contract_id.toString()
      } as any);

      // Mettre à jour le client avec l'ID Oodrive si pas encore fait
      if (!clientData.oodrive_recipient_id && signatureResponse.recipients.length > 0) {
        await clientsService.update(clientData.id, {
          oodrive_recipient_id: signatureResponse.recipients[0].id.toString()
        });
      }
      toast({
        title: "Document envoyé pour signature",
        description: `L'ordre de réparation ${order.reference} a été envoyé au client pour signature électronique.`
      });
    } catch (error: any) {
      console.error('Error sending repair order for signature:', error);
      toast({
        title: "Erreur",
        description: `Impossible d'envoyer l'ordre de réparation pour signature: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  const handleRequestDocuments = async (order: RepairOrder) => {
    try {
      const {
        tokensService
      } = await import('@/services/supabase/tokens');
      await tokensService.createToken({
        company_id: order.company_id!,
        client_id: order.client_id,
        vehicule_id: order.vehicle_id
      });
      toast({
        title: "Demande de justificatifs",
        description: `Demande de justificatifs envoyée pour l'ordre de réparation ${order.reference}. Token créé avec succès.`
      });
    } catch (error) {
      console.error('Erreur lors de la création du token:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le token pour la demande de justificatifs.",
        variant: "destructive"
      });
    }
  };
  const handleConvertToInvoice = (order: RepairOrder) => {
    // Préparer les données de la facture à partir de l'ordre de réparation
    const today = new Date().toISOString().split('T')[0];
    const prefilledData: Partial<Invoice> = {
      client_id: order.client_id,
      vehicle_id: order.vehicle_id,
      repair_order_id: order.id,
      status: 'En attente de paiement',
      date: today,
      due_date: today,
      notes: order.notes || '',
      // Informations du sinistre depuis l'ordre de réparation
      claim_number: order.claim_number || '',
      policy_number: order.policy_number || '',
      report_date: order.report_date || '',
      expert_name: order.expert_name || '',
      report_number: order.report_number || '',
      incident_date: order.incident_date || '',
      // Inclure les données de réparations, pièces et remises de l'ordre de réparation
      // Convertir Json en string si nécessaire
      repairs_data: order.repairs_data ? typeof order.repairs_data === 'string' ? order.repairs_data : JSON.stringify(order.repairs_data) : undefined,
      parts_data: order.parts_data ? typeof order.parts_data === 'string' ? order.parts_data : JSON.stringify(order.parts_data) : undefined,
      discounts_data: order.discounts_data ? typeof order.discounts_data === 'string' ? order.discounts_data : JSON.stringify(order.discounts_data) : undefined
      // Ne pas inclure l'ID pour forcer la création d'une nouvelle facture
    };
    console.log('Converting repair order to invoice with data:', prefilledData);
    console.log('Original repair order data:', order);

    // Passer les données de pré-remplissage pour la création d'une nouvelle facture
    setPrefilledInvoice(prefilledData);
    setInvoiceDialogOpen(true);
  };
  const handleArchiveOrder = async (order: RepairOrder) => {
    try {
      await archiveOrder.mutateAsync(order.id);
      toast({
        title: "Ordre de réparation archivé",
        description: "L'ordre de réparation a été archivé avec succès."
      });
    } catch (error: any) {
      console.error('Error archiving repair order:', error);
      toast({
        title: "Erreur",
        description: `Impossible d'archiver l'ordre de réparation: ${error?.message || 'Erreur inconnue'}`,
        variant: "destructive"
      });
    }
  };
  const handleRestoreOrder = async (order: RepairOrder) => {
    try {
      await restoreOrder.mutateAsync(order.id);
      toast({
        title: "Ordre de réparation restauré",
        description: "L'ordre de réparation a été restauré avec succès."
      });
    } catch (error: any) {
      console.error('Error restoring repair order:', error);
      toast({
        title: "Erreur",
        description: `Impossible de restaurer l'ordre de réparation: ${error?.message || 'Erreur inconnue'}`,
        variant: "destructive"
      });
    }
  };
  const handleDeleteOrder = (order: RepairOrder) => {
    setSelectedOrderForDeletion(order);
    setDeleteDialogOpen(true);
  };
  const handleViewOrder = (order: RepairOrder) => {
    setSelectedOrder(order);
    setViewerModalOpen(true);
  };
  const confirmDeleteOrder = () => {
    if (selectedOrderForDeletion) {
      if (showArchived) {
        deleteOrder.mutate(selectedOrderForDeletion.id);
      } else {
        handleArchiveOrder(selectedOrderForDeletion);
      }
      setDeleteDialogOpen(false);
      setSelectedOrderForDeletion(null);
    }
  };
  if (isLoading) {
    return <div className="p-6 space-y-6">
        <LoadingSpinner />
      </div>;
  }
  if (error) {
    return <div className="p-6 space-y-6">
        <ErrorMessage message="Erreur lors du chargement des ordres de réparation" />
      </div>;
  }
  return <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Ordres de réparation</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez les ordres de réparation
        </p>
        
        {/* Onglets pour basculer entre actifs et archivés */}
        <div className="flex space-x-1 mt-4 bg-gray-100 p-1 rounded-lg w-fit">
          <button onClick={() => setShowArchived(false)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!showArchived ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            Ordres actifs
          </button>
          <button onClick={() => setShowArchived(true)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${showArchived ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            Documents archivés
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">      
        <div className="flex-1" />
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Rechercher un ordre..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          {!showArchived && <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90" onClick={handleCreateOrder}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel ordre
            </Button>}
        </div>
      </div>
      
      {isMobile ? <div className="space-y-3">
          {filteredOrders.length > 0 ? filteredOrders.map(order => <RepairOrderMobileCard key={order.id} order={order} onViewOrder={handleViewOrder} onEditOrder={handleEditOrder} onArchiveOrder={showArchived ? handleDeleteOrder : handleArchiveOrder} contextMenuProps={{
        onDownload: handleDownload,
        onPrint: handlePrint,
        onSendEmail: handleSendEmail,
        onSignOrder: handleSignOrder,
        onSendForOodriveSignature: handleSendForOodriveSignature,
        onRequestDocuments: handleRequestDocuments,
        onConvertToInvoice: handleConvertToInvoice
      }} />) : <div className="card-container">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-10 w-10 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                <p className="text-gray-500 mt-1">
                  Aucun ordre de réparation correspondant à votre recherche n'a été trouvé.
                </p>
              </div>
            </div>}
        </div> : <RepairOrdersTable orders={filteredOrders} onEditOrder={handleEditOrder} onDeleteOrder={handleDeleteOrder} onRestoreOrder={handleRestoreOrder} onViewOrder={handleViewOrder} contextMenuProps={{
      onDownload: handleDownload,
      onPrint: handlePrint,
      onSendEmail: handleSendEmail,
      onSignOrder: handleSignOrder,
      onSendForOodriveSignature: handleSendForOodriveSignature,
      onRequestDocuments: handleRequestDocuments,
      onConvertToInvoice: handleConvertToInvoice
    }} />}

      <RepairOrderDialog order={selectedOrder} open={dialogOpen} onOpenChange={setDialogOpen} />

      <RepairOrderEmailDialog repairOrder={selectedOrderForEmail} open={emailDialogOpen} onOpenChange={setEmailDialogOpen} />

      <RepairOrderSignatureDialog repairOrder={selectedOrderForSignature} open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen} />

      <InvoiceDialog invoice={null} open={invoiceDialogOpen} onOpenChange={open => {
      setInvoiceDialogOpen(open);
      if (!open) {
        setPrefilledInvoice(null);
      }
    }} prefillData={prefilledInvoice} onSuccess={() => {
      navigate('/documents/factures');
    }} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showArchived ? 'Supprimer définitivement l\'ordre de réparation' : 'Archiver l\'ordre de réparation'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {showArchived ? 'Êtes-vous sûr de vouloir supprimer définitivement cet ordre de réparation ? Cette action est irréversible et supprimera définitivement toutes les données associées.' : 'Êtes-vous sûr de vouloir archiver cet ordre de réparation ? Vous pourrez le restaurer depuis l\'onglet "Documents archivés".'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteOrder} className={showArchived ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"}>
              {showArchived ? 'Supprimer' : 'Archiver'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RepairOrderViewerModal repairOrder={selectedOrder} open={viewerModalOpen} onOpenChange={setViewerModalOpen} />

      <AlertDialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-4xl text-center mb-6">📝 Signature électronique offerte !</AlertDialogTitle>
            <AlertDialogDescription className="text-2xl text-center">
              Nous t'avons offert un pack de signatures électroniques.
              <br /><br />
              Fait signer ton OR tout de suite par ton client !
              <br /><br />
              <strong>OR SIGNÉ, PLUS DE SOUCIS JURIDIQUE</strong>
              <br /><br />
              FONCE !
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => {
              setShowInfoDialog(false);
              markHelpAsSeen('repair_order_help_seen');
            }}>
              J'ai compris
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSignedDialog} onOpenChange={setShowSignedDialog}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-4xl text-center">🎉 Félicitations ! Ordre de réparation signé !</AlertDialogTitle>
            <AlertDialogDescription className="text-base space-y-3 text-center">
              <p className="font-bold text-lg text-primary">💰 Maintenant fait toi payer en direct par l'assurance même si tu n'es pas agréé !</p>
              <p>Etape suivante : création de la cession de créance</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Plus tard</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
            setShowSignedDialog(false);
            navigate('/cessions');
          }}>
              Créer une cession maintenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default RepairOrders;