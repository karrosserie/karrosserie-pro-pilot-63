import React, { useState, useEffect } from "react";
import { Users, FileText, Scale, ClipboardList, Paperclip, Euro, Plus, X } from "lucide-react";
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import { useNavigate } from "react-router-dom";
import { useJudicialCases } from "@/hooks/use-judicial-cases";
import { useClients } from "@/hooks/use-clients";
import { useInvoices } from "@/hooks/use-invoices";
import { useCompany } from "@/hooks/use-company";
import { useRepairOrders } from "@/hooks/use-repair-orders";
import { useClientRelances } from "@/hooks/use-client-relances";
import { useQuotes } from "@/hooks/use-quotes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';

const CreationDossierJudiciaire = () => {
  const navigate = useNavigate();
  const { createCase } = useJudicialCases();
  const { clients } = useClients();
  const { invoices } = useInvoices();
  const { companyData, isLoading: isCompanyLoading } = useCompany();
  const { orders: repairOrders } = useRepairOrders();
  const { quotes } = useQuotes();
  const { relances } = useClientRelances();

  const steps = [
    { id: 1, label: "Parties", icon: <Users className="w-5 h-5" />, colorClass: "text-blue-700", bgColorClass: "bg-blue-100" },
    { id: 2, label: "Faits", icon: <FileText className="w-5 h-5" />, colorClass: "text-green-700", bgColorClass: "bg-green-100" },
    { id: 3, label: "Juridique", icon: <Scale className="w-5 h-5" />, colorClass: "text-indigo-700", bgColorClass: "bg-indigo-100" },
    { id: 4, label: "Demandes", icon: <ClipboardList className="w-5 h-5" />, colorClass: "text-teal-700", bgColorClass: "bg-teal-100" },
    { id: 5, label: "Résumé & Pièces", icon: <Paperclip className="w-5 h-5" />, colorClass: "text-orange-700", bgColorClass: "bg-orange-100" },
  ];

  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    demandeur: "",
    defendeur: "",
    relation: "",
    chronologie: "",
    contexte: "",
    obligations: "",
    references_legales: "",
    montant_dossier: "",
    demandes: "",
    interets: false,
    interets_details: "",
    depens: false,
    depens_details: "",
    pieces: "",
    client_id: "",
    invoice_id: "",
  });

  // Auto-fill company data for demandeur field
  useEffect(() => {
    if (!isCompanyLoading && companyData && companyData.name && formData.demandeur === '') {
      const companyInfo = [];
      
      // Add company name
      companyInfo.push(companyData.name);
      
      // Add address
      if (companyData.address) {
        companyInfo.push(companyData.address);
      }
      
      // Add postal code and city
      const cityLine = [];
      if (companyData.zipcode) {
        cityLine.push(companyData.zipcode);
      }
      if (companyData.city) {
        cityLine.push(companyData.city);
      }
      if (cityLine.length > 0) {
        companyInfo.push(cityLine.join(' '));
      }
      
      // Add SIRET or SIREN
      if (companyData.siret) {
        companyInfo.push(`SIRET: ${companyData.siret}`);
      } else if (companyData.siren) {
        companyInfo.push(`SIREN: ${companyData.siren}`);
      }
      
      setFormData(prev => ({
        ...prev,
        demandeur: companyInfo.join('\n')
      }));
    }
  }, [companyData, isCompanyLoading, formData.demandeur]);

  // Auto-fill form data when client or invoice is selected
  useEffect(() => {
    if (selectedClient && clients) {
      const client = clients.find(c => c.id === selectedClient);
      if (client) {
        const addressParts = [];
        
        // Add client name
        const clientName = `${client.firstName} ${client.lastName}`;
        addressParts.push(clientName);
        
        // Add address if available
        if (client.address) {
          addressParts.push(client.address);
        }
        
        // Add postal code and city
        const cityLine = [];
        if (client.zipCode) {
          cityLine.push(client.zipCode);
        }
        if (client.city) {
          cityLine.push(client.city);
        }
        if (cityLine.length > 0) {
          addressParts.push(cityLine.join(' '));
        }
        
        setFormData(prev => ({
          ...prev,
          client_id: client.id,
          defendeur: addressParts.join('\n'),
        }));

        // Reset invoice selection if it doesn't belong to the current client
        if (selectedInvoice && invoices) {
          const currentInvoice = invoices.find(i => i.id === selectedInvoice);
          if (currentInvoice && currentInvoice.client_id !== selectedClient) {
            setSelectedInvoice("");
          }
        }
      }
    }
  }, [selectedClient, clients, selectedInvoice, invoices]);

  // Auto-select client when invoice is selected
  useEffect(() => {
    if (selectedInvoice && invoices && !selectedClient) {
      const invoice = invoices.find(i => i.id === selectedInvoice);
      if (invoice && invoice.client_id) {
        setSelectedClient(invoice.client_id);
      }
    }
  }, [selectedInvoice, invoices, selectedClient]);

  // Filter invoices based on selected client and max amount (10,000€)
  const filteredInvoices = selectedClient && invoices 
    ? invoices.filter(invoice => 
        invoice.client_id === selectedClient && 
        (invoice.amount || 0) <= 10000
      )
    : invoices?.filter(invoice => (invoice.amount || 0) <= 10000);

  useEffect(() => {
    if (selectedInvoice && invoices) {
      const invoice = invoices.find(i => i.id === selectedInvoice);
      if (invoice) {
        setFormData(prev => ({
          ...prev,
          invoice_id: invoice.id,
          montant_dossier: invoice.amount?.toString() || "",
          relation: "Contrat de prestation de services (réparation automobile)",
          chronologie: `${invoice.date || new Date().toLocaleDateString('fr-FR')} : Signature du devis pour la réparation du véhicule, montant de ${invoice.amount || 0} €.\n${new Date().toLocaleDateString('fr-FR')} : Réparation achevée et véhicule remis au client.\n${invoice.date || new Date().toLocaleDateString('fr-FR')} : Facture n°${invoice.reference} émise, payable sous 15 jours.\nLe délai de paiement est dépassé, la facture reste impayée malgré plusieurs relances.`,
          contexte: `Le défendeur refuse de s'acquitter du montant dû pour les travaux de réparation effectués sur son véhicule, malgré les services ayant été rendus et la voiture récupérée.`,
          obligations: "Inexécution contractuelle, non-paiement d'une prestation due.",
          references_legales: "Article 1231-1 du Code civil (réparation du préjudice résultant de l'inexécution d'une obligation contractuelle).",
          demandes: `Paiement de la somme au titre de la facture impayée n°${invoice.reference}.`,
          interets: true,
          interets_details: `Les intérêts de retard sont demandés à compter du ${invoice.date || new Date().toLocaleDateString('fr-FR')} (date d'émission de la facture), conformément aux conditions générales de vente.`,
          depens: true,
          depens_details: "Remboursement des frais de la mise en demeure par LRAR et des frais de procédure.",
          // Ne pas préremplir le champ pieces - il sera rempli automatiquement quand les documents sont trouvés
        }));
      }
    }
  }, [selectedInvoice, invoices]);

  // Helper function to generate documents async
  const generateDocuments = async (client: any, invoice: any) => {
    console.log('Génération des pièces pour facture:', invoice.reference);
    
    // PIÈCES LOGIQUES - Toujours présentes si facture sélectionnée
    // COLLECTE RIGOUREUSE DES DOCUMENTS EXISTANTS UNIQUEMENT
    console.log('=== DÉBUT COLLECTE DOCUMENTS ===');
    
    const existingDocuments: Array<{url: string; type: string; description: string; reference?: string; date?: string}> = [];
    let pieceNumber = 1;
    
    // 1. Devis lié - Générer le PDF à la demande
    const relatedQuote = quotes?.find(quote => 
      quote.client_id === selectedClient && 
      quote.vehicle_id === invoice.vehicle_id
    );
    
    console.log('Quote trouvé:', relatedQuote);
    if (relatedQuote) {
      try {
        const { generateQuotePDFBlob } = await import('@/utils/quotePDFGeneration');
        const blob = await generateQuotePDFBlob(relatedQuote, companyData);
        const fileUrl = URL.createObjectURL(blob);
        
        existingDocuments.push({
          url: fileUrl,
          type: 'quote',
          description: 'Devis signé',
          reference: relatedQuote.reference,
          date: relatedQuote.valid_until || invoice.date
        });
        console.log('✅ Devis PDF généré:', relatedQuote.reference);
      } catch (error) {
        console.error('❌ Erreur génération PDF devis:', error);
      }
    } else {
      console.log('❌ Pas de devis trouvé');
    }
    
    // 2. Ordre de réparation - Recherche par client_id
    console.log('=== RECHERCHE ORDRES DE RÉPARATION ===');
    console.log('Client sélectionné:', selectedClient);
    console.log('Véhicule de la facture:', invoice.vehicle_id);
    
    const relatedRepairOrders = repairOrders?.filter(order => 
      order.client_id === selectedClient
    ) || [];
    
    console.log('Ordres trouvés pour ce client:', relatedRepairOrders.length);
    
    for (const order of relatedRepairOrders) {
      if (order.signed_document_url && order.signed_document_url.trim()) {
        existingDocuments.push({
          url: order.signed_document_url,
          type: 'repair_order',
          description: 'Ordre de réparation signé',
          reference: order.reference
        });
        console.log('✅ OR signé ajouté:', order.reference);
      }
      
      // Générer le PDF de l'ordre de réparation si pas de document signé
      if (!order.signed_document_url || !order.signed_document_url.trim()) {
        try {
          const { generateRepairOrderPDFBlob } = await import('@/utils/repairOrderPDFGeneration');
          const blob = await generateRepairOrderPDFBlob(order, companyData);
          const fileUrl = URL.createObjectURL(blob);
          
          existingDocuments.push({
            url: fileUrl,
            type: 'repair_order',
            description: 'Ordre de réparation',
            reference: order.reference
          });
          console.log('✅ OR PDF généré:', order.reference);
        } catch (error) {
          console.error('❌ Erreur génération PDF OR:', error);
        }
      }
    }
    
    // 3. Facture - Générer le PDF à la demande
    console.log('Invoice data:', invoice);
    try {
      const { generateInvoicePDFBlob } = await import('@/utils/invoicePDFGeneration');
      const blob = await generateInvoicePDFBlob(invoice, companyData);
      const fileUrl = URL.createObjectURL(blob);
      
      existingDocuments.push({
        url: fileUrl,
        type: 'invoice',
        description: 'Facture impayée',
        reference: invoice.reference,
        date: invoice.date
      });
      console.log('✅ Facture PDF générée:', invoice.reference);
    } catch (error) {
      console.error('❌ Erreur génération PDF facture:', error);
    }
    
    // 4. Documents physiques existants
    const physicalDocuments: string[] = [];
    
    // Permis de conduire client
    if (client.driverLicenseFrontUrl && client.driverLicenseFrontUrl.trim()) {
      physicalDocuments.push(client.driverLicenseFrontUrl);
      existingDocuments.push({
        url: client.driverLicenseFrontUrl,
        type: 'driver_license',
        description: 'Permis de conduire (recto)'
      });
    }
    if (client.driverLicenseBackUrl && client.driverLicenseBackUrl.trim()) {
      physicalDocuments.push(client.driverLicenseBackUrl);
      existingDocuments.push({
        url: client.driverLicenseBackUrl,
        type: 'driver_license',
        description: 'Permis de conduire (verso)'
      });
    }
    
    // 5. Photos du véhicule depuis les tables vehicle_photos et task_photos
    console.log('=== RECHERCHE PHOTOS DU VÉHICULE ===');
    console.log('Vehicle ID:', invoice.vehicle_id);
    
    if (invoice.vehicle_id) {
      try {
        // Photos du véhicule
        const { data: vehiclePhotos, error: vehiclePhotosError } = await supabase
          .from('vehicle_photos')
          .select('file_url, file_name, description, photo_type')
          .eq('vehicle_id', invoice.vehicle_id);
        
        if (vehiclePhotosError) {
          console.error('❌ Erreur récupération photos véhicule:', vehiclePhotosError);
        } else if (vehiclePhotos && vehiclePhotos.length > 0) {
          console.log('✅ Photos véhicule trouvées:', vehiclePhotos.length);
          vehiclePhotos.forEach(photo => {
            if (photo.file_url && photo.file_url.trim()) {
              physicalDocuments.push(photo.file_url);
              existingDocuments.push({
                url: photo.file_url,
                type: 'vehicle_photo',
                description: photo.description || 'Photo du véhicule'
              });
            }
          });
        } else {
          console.log('❌ Aucune photo véhicule trouvée');
        }
        
        // Photos des tâches liées au véhicule
        const { data: taskPhotos, error: taskPhotosError } = await supabase
          .from('task_photos')
          .select('file_url, file_name, photo_type')
          .eq('vehicle_id', invoice.vehicle_id);
        
        if (taskPhotosError) {
          console.error('❌ Erreur récupération photos tâches:', taskPhotosError);
        } else if (taskPhotos && taskPhotos.length > 0) {
          console.log('✅ Photos tâches trouvées:', taskPhotos.length);
          taskPhotos.forEach(photo => {
            if (photo.file_url && photo.file_url.trim()) {
              physicalDocuments.push(photo.file_url);
              existingDocuments.push({
                url: photo.file_url,
                type: 'task_photo',
                description: `Photo de travaux (${photo.photo_type || 'tâche'})`
              });
            }
          });
        } else {
          console.log('❌ Aucune photo tâche trouvée');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des photos:', error);
      }
    }
    
    // Photos des travaux des repair orders (dans repairs_data et parts_data)
    relatedRepairOrders.forEach(order => {
      if (order.repairs_data) {
        try {
          const repairsData = typeof order.repairs_data === 'string' ? 
            JSON.parse(order.repairs_data) : order.repairs_data;
          if (Array.isArray(repairsData)) {
            repairsData.forEach((repair: any) => {
              if (repair.photos && Array.isArray(repair.photos)) {
                repair.photos.forEach((photoUrl: string) => {
                  if (photoUrl && photoUrl.trim()) {
                    physicalDocuments.push(photoUrl);
                    existingDocuments.push({
                      url: photoUrl,
                      type: 'work_photo',
                      description: 'Photo de réparation'
                    });
                  }
                });
              }
            });
          }
        } catch (e) {
          console.log('Could not parse repairs_data for photos');
        }
      }
      if (order.parts_data) {
        try {
          const partsData = typeof order.parts_data === 'string' ? 
            JSON.parse(order.parts_data) : order.parts_data;
          if (Array.isArray(partsData)) {
            partsData.forEach((part: any) => {
              if (part.photos && Array.isArray(part.photos)) {
                part.photos.forEach((photoUrl: string) => {
                  if (photoUrl && photoUrl.trim()) {
                    physicalDocuments.push(photoUrl);
                    existingDocuments.push({
                      url: photoUrl,
                      type: 'work_photo',
                      description: 'Photo de pièce'
                    });
                  }
                });
              }
            });
          }
        } catch (e) {
          console.log('Could not parse parts_data for photos');
        }
      }
    });
    
    // Documents de relances
    const clientRelances = relances?.filter(relance => 
      relance.client_id === selectedClient && 
      relance.invoice_id === selectedInvoice
    ) || [];
    
    clientRelances.forEach(relance => {
      if (relance.channel_data) {
        // Document principal de la relance
        if (relance.channel_data.document_url && relance.channel_data.document_url.trim()) {
          physicalDocuments.push(relance.channel_data.document_url);
          existingDocuments.push({
            url: relance.channel_data.document_url,
            type: 'reminder',
            description: 'Document de relance'
          });
        }
        
        // Pièces jointes de la relance
        if (relance.channel_data.attachments && Array.isArray(relance.channel_data.attachments)) {
          relance.channel_data.attachments.forEach((attachment: any) => {
            if (attachment.url && attachment.url.trim()) {
              physicalDocuments.push(attachment.url);
              existingDocuments.push({
                url: attachment.url,
                type: 'reminder_attachment',
                description: attachment.name || 'Pièce jointe de relance'
              });
            }
          });
        }
      }
    });
    
    return existingDocuments;
  };

  // Auto-import supporting documents when both client and invoice are selected
  useEffect(() => {
    if (selectedClient && selectedInvoice && clients && invoices && quotes && companyData) {
      const client = clients.find(c => c.id === selectedClient);
      const invoice = invoices.find(i => i.id === selectedInvoice);
      
      if (client && invoice) {
        generateDocuments(client, invoice).then(existingDocuments => {
          
          // Mise à jour des pièces du dossier avec les documents trouvés et générés
          const foundDocs = existingDocuments.map((doc, index) => {
            // Déterminer la description en fonction du type
            let description = doc.description;
            
            switch (doc.type) {
              case 'quote':
                description = `Devis n°${doc.reference}`;
                break;
              case 'invoice':
                description = `Facture n°${doc.reference} impayée du ${doc.date}`;
                break;
              case 'repair_order':
                description = `Ordre de réparation n°${doc.reference}`;
                break;
              default:
                description = doc.description;
            }
            
            return `Pièce n°${index + 1} : ${description}`;
          });
          
          const foundUrls = existingDocuments.map(doc => doc.url);
          
          console.log('=== DOCUMENTS TRAITÉS ===');
          console.log('Nombre de documents:', existingDocuments.length);
          console.log('URLs:', foundUrls);
          console.log('Descriptions:', foundDocs);
          console.log('========================');
          
          // Mettre à jour les pièces jointes avec les nouveaux documents
          setAttachedFiles(foundUrls);
          setFormData(prev => ({
            ...prev,
            pieces: foundDocs.join('\n')
          }));
        }).catch(error => {
          console.error('Erreur lors de la génération des documents:', error);
        });
      }
    }
  }, [selectedClient, selectedInvoice, clients, invoices, quotes, companyData, repairOrders, relances]);

  // Fonction pour supprimer un fichier attaché
  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const currentStepConfig = steps.find(s => s.id === step);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleToggle = (name: string) => {
    setFormData((prevData) => ({
        ...prevData,
        [name]: !prevData[name as keyof typeof prevData],
    }));
  };

  // Generate pieces list from attached files - only for actually found documents
  const generatePiecesList = (files: string[]) => {
    const validFiles = files.filter(file => file && file.trim());
    if (validFiles.length === 0) return '';
    
    return validFiles.map((file, index) => {
      const fileName = file.split('/').pop() || `document_${index + 1}`;
      const pieceNumber = index + 1;
      
      // Try to identify document type from filename or path
      let description = '';
      if (fileName.toLowerCase().includes('devis') || fileName.toLowerCase().includes('quote')) {
        description = 'Devis signé';
      } else if (fileName.toLowerCase().includes('facture') || fileName.toLowerCase().includes('invoice')) {
        description = 'Facture';
      } else if (fileName.toLowerCase().includes('permis') || fileName.toLowerCase().includes('license') || fileName.toLowerCase().includes('driving')) {
        description = 'Permis de conduire';
      } else if (fileName.toLowerCase().includes('relance') || fileName.toLowerCase().includes('reminder')) {
        description = 'Lettre de relance';
      } else if (fileName.toLowerCase().includes('demeure') || fileName.toLowerCase().includes('mise_en_demeure')) {
        description = 'Mise en demeure';
      } else if (fileName.toLowerCase().includes('ordre') || fileName.toLowerCase().includes('repair') || fileName.toLowerCase().includes('reparation')) {
        description = 'Ordre de réparation signé';
      } else if (fileName.toLowerCase().includes('photo') || fileName.toLowerCase().includes('image') || fileName.toLowerCase().includes('jpg') || fileName.toLowerCase().includes('png')) {
        description = 'Photo de véhicule/travaux';
      } else if (fileName.toLowerCase().includes('bon') && fileName.toLowerCase().includes('sortie')) {
        description = 'Bon de sortie du véhicule';
      } else if (fileName.toLowerCase().includes('preuve') || fileName.toLowerCase().includes('reception')) {
        description = 'Preuve de réception';
      } else {
        description = 'Document justificatif';
      }
      
      return `Pièce n°${pieceNumber} : ${description} (${fileName})`;
    }).join('\n');
  };

  const handleFileAdd = (url: string) => {
    const newFiles = [...attachedFiles, url];
    setAttachedFiles(newFiles);
    
    // Update pieces field with new list
    const newPiecesList = generatePiecesList(newFiles);
    setFormData(prev => ({
      ...prev,
      pieces: newPiecesList
    }));
  };

  const handleFileRemove = (index: number) => {
    const newFiles = attachedFiles.filter((_, i) => i !== index);
    setAttachedFiles(newFiles);
    
    // Update pieces field with new list
    const newPiecesList = generatePiecesList(newFiles);
    setFormData(prev => ({
      ...prev,
      pieces: newPiecesList
    }));
  };

  const handleFileUpdate = (index: number, url: string) => {
    const newFiles = attachedFiles.map((file, i) => (i === index ? url : file));
    setAttachedFiles(newFiles);
    
    // Update pieces field with new list
    const newPiecesList = generatePiecesList(newFiles);
    setFormData(prev => ({
      ...prev,
      pieces: newPiecesList
    }));
  };

  const addNewFileSlot = () => {
    setAttachedFiles(prev => [...prev, '']);
  };

  const handleSubmit = async () => {
    const result = await createCase({
      demandeur: formData.demandeur,
      defendeur: formData.defendeur,
      relation: formData.relation,
      chronologie: formData.chronologie,
      contexte: formData.contexte,
      obligations: formData.obligations,
      references_legales: formData.references_legales,
      montant_dossier: parseFloat(formData.montant_dossier) || 0,
      demandes: formData.demandes,
      interets: formData.interets,
      interets_details: formData.interets_details,
      depens: formData.depens,
      depens_details: formData.depens_details,
      pieces: formData.pieces,
      client_id: formData.client_id && formData.client_id.trim() !== '' ? formData.client_id : null,
      invoice_id: formData.invoice_id && formData.invoice_id.trim() !== '' ? formData.invoice_id : null,
      status: 'draft',
    });

    if (result) {
      navigate('/contentieux/depot-dossier');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-background p-5">
      <div className="w-full max-w-3xl mb-6">
        <h1 className="text-3xl font-extrabold text-foreground mb-2 flex items-center gap-2">
          <Scale className="w-8 h-8 text-primary" />
          Dossier Judiciaire Carrosserie
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Générateur automatique de dossier judiciaire pour les professionnels de la carrosserie
        </p>

        {/* Client and Invoice Selection */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sélectionner un client
                </label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.firstName} {client.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sélectionner une facture
                </label>
                <div className="mb-2">
                  <div className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded p-2">
                    ⚖️ Seules les factures d'un montant inférieur ou égal à 10 000€ peuvent être sélectionnées pour une procédure de jugement sur pièce.
                  </div>
                </div>
                <Select value={selectedInvoice} onValueChange={setSelectedInvoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une facture..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredInvoices?.map((invoice) => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        {invoice.reference} - {invoice.amount}€
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="w-full mb-6">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-2 bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(step / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-t-2xl shadow-xl w-full max-w-3xl flex justify-between p-2 border">
        {steps.map((s) => (
          <button
            key={s.id}
            className={`flex flex-col items-center flex-1 text-center p-2 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 ${
              step === s.id
                ? `${s.bgColorClass} ${s.colorClass} shadow-md`
                : "text-muted-foreground hover:bg-muted"
            }`}
            onClick={() => setStep(s.id)}
          >
            {React.cloneElement(s.icon, { className: `${s.colorClass} w-5 h-5` })}
            <span className="text-xs mt-1 font-medium hidden sm:block">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Card Content */}
      <div className={`rounded-b-2xl shadow-xl w-full max-w-3xl p-6 transition-all duration-500 ease-in-out ${currentStepConfig?.bgColorClass} border border-t-0`}>
        {step === 1 && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${currentStepConfig.colorClass}`}>
              <Users className="w-6 h-6" /> Identification des parties
            </h2>
            <div className="bg-card p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" /> Demandeur
              </label>
              <textarea 
                name="demandeur"
                value={formData.demandeur}
                onChange={handleChange}
                className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow bg-background hover:bg-muted/50" 
                rows={4} 
                placeholder="Nom, prénom / Raison sociale, adresse complète, SIREN le cas échéant."
              />
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" /> Défendeur
              </label>
              <textarea 
                name="defendeur"
                value={formData.defendeur}
                onChange={handleChange}
                className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow bg-background hover:bg-muted/50" 
                rows={4} 
                placeholder="Nom, prénom / Raison sociale, adresse complète, SIREN le cas échéant."
              />
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-700" /> Relation entre les parties
              </label>
              <input 
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow bg-background hover:bg-muted/50" 
                placeholder="contrat de prestation, relation commerciale, relation de travail, voisinage, etc." 
              />
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${currentStepConfig.colorClass}`}>
              <FileText className="w-6 h-6" /> Exposé des faits
            </h2>
            <div className="bg-card p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-green-700" /> Chronologie des événements
              </label>
              <textarea 
                name="chronologie"
                value={formData.chronologie}
                onChange={handleChange}
                className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow bg-background hover:bg-muted/50" 
                rows={8} 
                placeholder="[Date] : [Description de l'événement]."
              />
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-700" /> Contexte global
              </label>
              <textarea 
                name="contexte"
                value={formData.contexte}
                onChange={handleChange}
                className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow bg-background hover:bg-muted/50" 
                rows={4} 
                placeholder="résumé clair de la situation."
              />
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${currentStepConfig.colorClass}`}>
              <Scale className="w-6 h-6" /> Fondements juridiques
            </h2>
            <div className="bg-card p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-700" /> Obligations non respectées
              </label>
              <textarea 
                name="obligations"
                value={formData.obligations}
                onChange={handleChange}
                className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow bg-background hover:bg-muted/50" 
                rows={4} 
                placeholder="exemple : inexécution contractuelle, défaut de paiement, non-respect du Code du travail, trouble de voisinage…"
              />
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-indigo-700" /> Références légales ou contractuelles
              </label>
              <textarea 
                name="references_legales"
                value={formData.references_legales}
                onChange={handleChange}
                className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow bg-background hover:bg-muted/50" 
                rows={4} 
                placeholder="articles du contrat concerné, articles du Code civil / Code du commerce / Code du travail selon le cas."
              />
            </div>
          </div>
        )}
        
        {step === 4 && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${currentStepConfig.colorClass}`}>
              <ClipboardList className="w-6 h-6" /> Demandes présentées au juge
            </h2>
            <div className="bg-card p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <Euro className="w-4 h-4 text-teal-700" /> Montant réclamé
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="montant_dossier"
                  value={formData.montant_dossier}
                  onChange={handleChange}
                  className="w-full border border-input rounded-lg p-3 pl-8 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow bg-background hover:bg-muted/50" 
                  placeholder="2 500 €"
                />
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">€</span>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-teal-700" /> Condamner le défendeur à :
              </label>
              <textarea 
                name="demandes"
                value={formData.demandes}
                onChange={handleChange}
                className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow bg-background hover:bg-muted/50" 
                rows={4} 
                placeholder="Paiement de la somme au titre de [facture, dommages-intérêts, préjudice moral, etc.]."
              />
            </div>
            <div className="space-y-4 mt-6">
              <div className="bg-muted p-4 rounded-lg border flex items-center justify-between">
                <label className="text-base font-semibold text-foreground flex-1">Intérêts de retard et capitalisation des intérêts</label>
                <button
                    onClick={() => handleToggle('interets')}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${formData.interets ? 'bg-primary' : 'bg-muted-foreground focus:ring-muted-foreground'}`}
                >
                    <span
                        className={`inline-block w-4 h-4 transform rounded-full transition-transform ${formData.interets ? 'translate-x-6 bg-primary-foreground' : 'translate-x-1 bg-background'}`}
                    ></span>
                </button>
              </div>
              {formData.interets && (
                  <textarea
                    name="interets_details"
                    value={formData.interets_details}
                    onChange={handleChange}
                    className="w-full border border-input rounded-lg p-3 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow bg-background hover:bg-muted/50"
                    rows={3}
                    placeholder="Précisez la base de calcul ou la date de début des intérêts."
                  />
              )}
              <div className="bg-muted p-4 rounded-lg border flex items-center justify-between">
                <label className="text-base font-semibold text-foreground flex-1">Condamnation aux dépens et frais de procédure</label>
                <button
                    onClick={() => handleToggle('depens')}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${formData.depens ? 'bg-primary' : 'bg-muted-foreground focus:ring-muted-foreground'}`}
                >
                    <span
                        className={`inline-block w-4 h-4 transform rounded-full transition-transform ${formData.depens ? 'translate-x-6 bg-primary-foreground' : 'translate-x-1 bg-background'}`}
                    ></span>
                </button>
              </div>
              {formData.depens && (
                  <textarea
                    name="depens_details"
                    value={formData.depens_details}
                    onChange={handleChange}
                    className="w-full border border-input rounded-lg p-3 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow bg-background hover:bg-muted/50"
                    rows={3}
                    placeholder="Détaillez les frais à rembourser, comme la mise en demeure, etc."
                  />
              )}
            </div>
          </div>
        )}
        
        {step === 5 && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${currentStepConfig.colorClass}`}>
              <Paperclip className="w-6 h-6" /> Résumé et Pièces justificatives
            </h2>
            <div className="bg-card p-4 rounded-lg shadow-sm border">
                <p className="font-semibold text-sm mb-2 text-foreground">Résumé des informations saisies :</p>
                <ul className="text-sm text-foreground space-y-2">
                    <li><span className="font-medium">Demandeur :</span> {formData.demandeur}</li>
                    <li><span className="font-medium">Défendeur :</span> {formData.defendeur}</li>
                    <li><span className="font-medium">Relation :</span> {formData.relation}</li>
                    <li><span className="font-medium">Montant du dossier :</span> {formData.montant_dossier}</li>
                    <li><span className="font-medium">Demandes :</span> {formData.demandes}</li>
                    {formData.interets && 
                      <li>
                        <span className="font-medium">Intérêts de retard :</span> Oui
                        {formData.interets_details && <span className="ml-2 text-muted-foreground">({formData.interets_details})</span>}
                      </li>
                    }
                    {formData.depens && 
                      <li>
                        <span className="font-medium">Condamnation aux dépens :</span> Oui
                        {formData.depens_details && <span className="ml-2 text-muted-foreground">({formData.depens_details})</span>}
                      </li>
                    }
                </ul>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-orange-700" /> Bordereau des pièces jointes au dossier
                </label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addNewFileSlot}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une pièce
                </Button>
              </div>

              <div className="space-y-4">
                {/* Editable pieces list */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Liste des pièces justificatives
                  </label>
                  <textarea
                    name="pieces"
                    value={formData.pieces}
                    onChange={handleChange}
                    className="w-full border border-input rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow bg-background hover:bg-muted/50"
                    rows={8}
                    placeholder="Liste des pièces jointes au dossier..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Cette liste sera automatiquement mise à jour quand vous ajoutez ou supprimez des fichiers ci-dessous.
                  </p>
                </div>
                
                {/* File uploaders */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">Fichiers joints</h4>
                  
                  {attachedFiles.length === 0 && (
                    <DocumentUploader
                      documentType="judicial-document"
                      documentId="new-case-0"
                      currentDocumentUrl=""
                      onUploadComplete={(url) => handleFileAdd(url)}
                      isViewMode={false}
                    />
                  )}
                  
                  {attachedFiles.map((fileUrl, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <DocumentUploader
                            documentType="judicial-document"
                            documentId={`new-case-${index}`}
                            currentDocumentUrl={fileUrl}
                            onUploadComplete={(url) => handleFileUpdate(index, url)}
                            isViewMode={false}
                          />
                        </div>
                        {attachedFiles.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleFileRemove(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={prevStep}
            disabled={step === 1}
            variant="outline"
            className="px-6 py-3"
          >
            ← Précédent
          </Button>
          {step === steps.length ? (
             <Button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 hover:bg-green-700"
            >
              Générer le dossier
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="px-6 py-3"
            >
              Suivant →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreationDossierJudiciaire;