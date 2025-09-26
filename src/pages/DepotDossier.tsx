import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Building2, AlertTriangle, CheckCircle, Clock, Download, Eye } from 'lucide-react';
import { useJudicialCases } from '@/hooks/use-judicial-cases';
import { useClients } from '@/hooks/use-clients';
import { useInvoices } from '@/hooks/use-invoices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CalendrierProcedure from '@/components/CalendrierProcedure';
const DepotDossier = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { cases, loading } = useJudicialCases();
  const { clients } = useClients();
  const { invoices } = useInvoices();
  const { toast } = useToast();
  const [selectedCase, setSelectedCase] = useState(null);
  const [relatedClient, setRelatedClient] = useState(null);
  const [relatedInvoice, setRelatedInvoice] = useState(null);
  const [currentStep, setCurrentStep] = useState(2);
  const [isDepositing, setIsDepositing] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedTribunal, setSelectedTribunal] = useState('marseille');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRecapModal, setShowRecapModal] = useState(false);
  const [depositResult, setDepositResult] = useState({
    number: 'RIP-2025-001234',
    tribunal: 'TJ Marseille',
    date: new Date().toLocaleDateString('fr-FR')
  });
  useEffect(() => {
    if (id && cases) {
      const foundCase = cases.find(c => c.id === id);
      setSelectedCase(foundCase);
      
      // Récupérer les données du client associé
      if (foundCase?.client_id && clients) {
        const client = clients.find(c => c.id === foundCase.client_id);
        setRelatedClient(client);
      }
      
      // Récupérer les données de la facture associée
      if (foundCase?.invoice_id && invoices) {
        const invoice = invoices.find(i => i.id === foundCase.invoice_id);
        setRelatedInvoice(invoice);
      }
    }
  }, [id, cases, clients, invoices]);
  const steps = [{
    id: 1,
    label: "Dossier généré",
    icon: "✓",
    completed: true
  }, {
    id: 2,
    label: "Vérification",
    icon: "2",
    current: currentStep === 2,
    completed: currentStep >= 2
  }, {
    id: 3,
    label: "Envoyé",
    icon: "3",
    current: currentStep === 3,
    completed: currentStep >= 3
  }, {
    id: 4,
    label: "Reçu",
    icon: "4",
    current: currentStep === 4,
    completed: currentStep >= 4
  }, {
    id: 5,
    label: "Suivi",
    icon: "5",
    current: currentStep === 5,
    completed: currentStep >= 5
  }];
  // État pour les documents réels
  const [realDocuments, setRealDocuments] = useState([]);

  // Fonction pour récupérer les documents réels
  const fetchRealDocuments = useCallback(async () => {
    const docs = [];
    
    try {
      // Ajouter la facture si elle existe
      if (relatedInvoice) {
        docs.push({
          name: `Facture ${relatedInvoice.reference}`,
          description: `Facture originale • ${new Date(relatedInvoice.date).toLocaleDateString('fr-FR')} • Montant: ${relatedInvoice.amount}€`,
          icon: "📄", 
          type: "facture",
          url: relatedInvoice.document_url,
          hasUrl: !!relatedInvoice.document_url
        });
      }

      // Récupérer l'ordre de réparation associé à la facture
      if (relatedInvoice?.repair_order_id) {
        const { data: repairOrder } = await supabase
          .from('repair_orders')
          .select('*')
          .eq('id', relatedInvoice.repair_order_id)
          .single();
          
        if (repairOrder) {
          docs.push({
            name: `Ordre de réparation ${repairOrder.reference}`,
            description: `Document de travaux • Pièce n°2 : Ordre de réparation n°${repairOrder.reference}`,
            icon: "🔧",
            type: "repair_order",
            url: repairOrder.document_url,
            hasUrl: !!repairOrder.document_url
          });
        }
      }

      // Récupérer le devis associé s'il existe
      if (relatedInvoice?.vehicle_id && relatedInvoice?.client_id) {
        const { data: quotes } = await supabase
          .from('quotes')
          .select('*')
          .eq('vehicle_id', relatedInvoice.vehicle_id)
          .eq('client_id', relatedInvoice.client_id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (quotes && quotes.length > 0) {
          const quote = quotes[0];
          docs.push({
            name: `Devis signé`,
            description: `Document contractuel • Pièce n°1 : Devis n°${quote.reference}`,
            icon: "✍️", 
            type: "devis",
            url: quote.document_url,
            hasUrl: !!quote.document_url
          });
        }
      }

      // Ajouter d'autres documents basés sur les pièces du dossier judiciaire
      if (selectedCase?.pieces) {
        const pieces = selectedCase.pieces.split('\n').filter(p => p.trim());
        pieces.forEach((piece, index) => {
          // Éviter les doublons avec les documents déjà ajoutés
          if (!piece.includes('Facture') && !piece.includes('Devis') && !piece.includes('Ordre de réparation')) {
            docs.push({
              name: `Document ${index + 1}`,
              description: piece,
              icon: "📎",
              type: "other",
              url: null,
              hasUrl: false
            });
          }
        });
      }

      setRealDocuments(docs);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les documents du dossier.",
        variant: "destructive"
      });
    }
  }, [relatedInvoice, selectedCase, supabase, toast]);

  // Fonction pour prévisualiser un document
  const previewDocument = (doc) => {
    if (doc.hasUrl && doc.url) {
      window.open(doc.url, '_blank');
    } else if (doc.type === 'facture' && relatedInvoice?.id) {
      // Générer l'URL de prévisualisation de la facture
      window.open(`/invoices/${relatedInvoice.id}/preview`, '_blank');
    } else if (doc.type === 'devis') {
      // Logique pour prévisualiser le devis
      toast({
        title: "Prévisualisation",
        description: "Génération du devis en cours...",
      });
    } else if (doc.type === 'repair_order') {
      // Logique pour prévisualiser l'ordre de réparation
      toast({
        title: "Prévisualisation",
        description: "Génération de l'ordre de réparation en cours...",
      });
    } else {
      toast({
        title: "Document non disponible",
        description: "Ce document n'est pas encore disponible pour la prévisualisation.",
        variant: "destructive"
      });
    }
  };

  // Récupérer les documents réels au chargement
  useEffect(() => {
    if (selectedCase && relatedInvoice) {
      fetchRealDocuments();
    }
  }, [selectedCase, relatedInvoice, fetchRealDocuments]);
  const tribunals = [{
    id: 'marseille',
    name: 'Tribunal Judiciaire de Marseille',
    address: '6 Rue Joseph Autran, 13006 Marseille',
    competence: 'Créances jusqu\'à 10 000€',
    delay: '3-4 semaines',
    mode: 'Téléprocédure disponible'
  }];
  const handleProceedToDeposit = () => {
    setShowRecapModal(true);
  };
  const confirmDeposit = async () => {
    setShowConfirmModal(false);
    setIsDepositing(true);
    setProgress(0);
    setCurrentStep(3); // Avancer immédiatement jusqu'à "Envoyé"
    const loadingSteps = ['Vérification des documents...', 'Connexion au portail du tribunal...', 'Téléchargement des pièces jointes...', 'Validation de la requête...', 'Paiement des frais de greffe...', 'Confirmation du dépôt...'];
    
    for (let i = 0; i < loadingSteps.length; i++) {
      setLoadingText(loadingSteps[i]);
      setProgress((i + 1) / loadingSteps.length * 100);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Progresser uniquement jusqu'à l'étape "Envoyé" (étape 3)
      if (i === 1) setCurrentStep(3); // Étape Envoyé
    }
    
    setIsDepositing(false);

    // Préparer les données de résultat
    const today = new Date().toLocaleDateString('fr-FR');
    setDepositResult({
      number: 'RIP-2025-001234',
      tribunal: 'TJ Marseille',
      date: today
    });
    setShowSuccessModal(true);
  };
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    toast({
      title: "Dépôt réussi",
      description: "Votre requête a été déposée avec succès au tribunal."
    });
    navigate('/contentieux/depot-dossier');
  };
  const selectTribunal = tribunalId => {
    setSelectedTribunal(tribunalId);
  };
  if (loading) {
    return <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Chargement des dossiers...</p>
        </div>
      </div>;
  }
  if (!id) {
    // List view of all cases
    return <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dépôt de dossiers judiciaires</h1>
              <p className="text-muted-foreground">Gérez les dépôts de vos dossiers auprès des tribunaux</p>
            </div>
          </div>
          <Button onClick={() => navigate('/contentieux/creation-dossier')}>
            <FileText className="w-4 h-4 mr-2" />
            Créer un dossier
          </Button>
        </div>

        <div className="grid gap-4">
          {cases?.map(judicialCase => <Card key={judicialCase.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/contentieux/depot-dossier/${judicialCase.id}`)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{judicialCase.reference}</h3>
                      <Badge variant={judicialCase.status === 'draft' ? 'secondary' : 'default'}>
                        {judicialCase.status === 'draft' ? 'Brouillon' : judicialCase.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {judicialCase.defendeur?.split('\n')[0]} • {judicialCase.montant_dossier}€
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Créé le {new Date(judicialCase.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right flex gap-2">
                    <Button variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/contentieux/depot-dossier/${judicialCase.id}`);
                    }}>
                      Voir le dossier
                    </Button>
                    <Button 
                      size="sm" 
                      variant={judicialCase.status === 'deposited' ? 'secondary' : 'default'}
                      disabled={judicialCase.status === 'deposited'}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/contentieux/depot-dossier/${judicialCase.id}`);
                      }}
                    >
                      {judicialCase.status === 'deposited' ? 'Dépôt effectué' : 'Effectuer le dépôt'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>)}
          
          {(!cases || cases.length === 0) && <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Aucun dossier judiciaire</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par créer votre premier dossier judiciaire
                </p>
                <Button onClick={() => navigate('/contentieux/creation-dossier')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Créer un dossier
                </Button>
              </CardContent>
            </Card>}
        </div>
      </div>;
  }
  if (!selectedCase) {
    return <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Dossier non trouvé</p>
          <Button variant="outline" className="mt-2" onClick={() => navigate('/contentieux/depot-dossier')}>
            Retour à la liste
          </Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-2">🏛️ Dépôt de Requête Tribunal</h1>
        
      </div>

      {/* Breadcrumb */}
      <div className="bg-white p-4 border-b border-slate-200">
        <button onClick={() => navigate('/contentieux/depot-dossier')} className="text-blue-600 hover:underline flex items-center gap-2">
          ← Retour au tableau de bord
        </button>
        <span className="text-slate-600"> / Dépôt tribunal / {selectedCase.reference}</span>
      </div>

      <div className="container mx-auto p-8 max-w-5xl">
        {/* Calendrier précis - Procédure Tribunal */}
        {depositResult && <div className="bg-white border border-slate-200 rounded-xl p-8 mb-8 shadow-sm">
            <CalendrierProcedure />
          </div>}

        {/* Process Steps */}
        <div className="flex justify-center mb-12 relative">
          <div className="absolute top-5 left-1/4 right-1/4 h-0.5 bg-slate-300 z-0"></div>
          <div className="flex justify-between w-full max-w-3xl items-center relative z-10">
            {steps.map(step => <div key={step.id} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 ${step.completed ? 'bg-green-600 text-white' : step.current ? 'bg-red-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                  {step.completed ? '✓' : step.icon}
                </div>
                <span className={`text-sm mt-2 text-center font-medium max-w-24 ${step.current ? 'text-red-600' : 'text-slate-600'}`}>
                  {step.label}
                </span>
              </div>)}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Content Header */}
          <div className="p-8 border-b border-slate-200 bg-slate-50">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Requête au tribunal de jugement sur pièces</h2>
            <p className="text-slate-600 text-base">
              {relatedClient ? `${relatedClient.first_name} ${relatedClient.last_name}` : selectedCase.defendeur?.split('\n')[0]} • 
              Facture {relatedInvoice?.reference || selectedCase.reference} • 
              {relatedInvoice?.amount || selectedCase.montant_dossier || '0,00'} €
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8 space-y-8">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-blue-800 text-sm font-semibold mb-2 flex items-center gap-2">
                ℹ️ Procédure automatisée
              </h4>
              <p className="text-blue-700 text-sm">
                Votre dossier a été automatiquement généré avec tous les documents requis. Vérifiez les informations ci-dessous avant le dépôt au tribunal.
              </p>
            </div>

            {/* Case Summary */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-slate-900 flex items-center gap-2">
                📋 Récapitulatif de la créance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2 text-slate-900">Débiteur</label>
                  <input 
                    type="text" 
                    value={relatedClient ? `${relatedClient.first_name} ${relatedClient.last_name}` : selectedCase.defendeur?.split('\n')[0] || "Non renseigné"} 
                    readOnly 
                    className="w-full p-3 border border-slate-300 rounded-md bg-slate-50 text-sm" 
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-slate-900">Adresse</label>
                  <input 
                    type="text" 
                    value={relatedClient ? `${relatedClient.address || ''} ${relatedClient.postal_code || ''} ${relatedClient.city || ''}`.trim() : "Non renseignée"} 
                    readOnly 
                    className="w-full p-3 border border-slate-300 rounded-md bg-slate-50 text-sm" 
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-slate-900">Email</label>
                  <input 
                    type="text" 
                    value={relatedClient?.email || "Non renseigné"} 
                    readOnly 
                    className="w-full p-3 border border-slate-300 rounded-md bg-slate-50 text-sm" 
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-slate-900">Téléphone</label>
                  <input 
                    type="text" 
                    value={relatedClient?.phone || "Non renseigné"} 
                    readOnly 
                    className="w-full p-3 border border-slate-300 rounded-md bg-slate-50 text-sm" 
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-slate-900">Montant principal</label>
                  <input 
                    type="text" 
                    value={`${relatedInvoice?.amount || selectedCase.montant_dossier || '0,00'} €`} 
                    readOnly 
                    className="w-full p-3 border border-slate-300 rounded-md bg-slate-50 text-sm" 
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-slate-900">Pénalités de retard</label>
                  <input 
                    type="text" 
                    value={selectedCase.interets ? `${Math.round((relatedInvoice?.amount || selectedCase.montant_dossier || 0) * 0.035)} €` : "0,00 €"} 
                    readOnly 
                    className="w-full p-3 border border-slate-300 rounded-md bg-slate-50 text-sm" 
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-slate-900">Indemnité forfaitaire</label>
                  <input 
                    type="text" 
                    value="40,00 €" 
                    readOnly 
                    className="w-full p-3 border border-slate-300 rounded-md bg-slate-50 text-sm" 
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-slate-900">Total réclamé</label>
                  <input 
                    type="text" 
                    value={`${(
                      (relatedInvoice?.amount || selectedCase.montant_dossier || 0) + 
                      (selectedCase.interets ? Math.round((relatedInvoice?.amount || selectedCase.montant_dossier || 0) * 0.035) : 0) + 
                      40
                    ).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`} 
                    readOnly 
                    className="w-full p-3 border border-slate-300 rounded-md bg-slate-50 text-sm font-semibold" 
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-slate-900 flex items-center gap-2">
                📎 Documents joints au dossier
              </h3>
              <div className="bg-slate-50 p-6 rounded-lg">
                <div className="space-y-4">
                  {realDocuments.length > 0 ? (
                    realDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-4 rounded-md border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center text-sm">
                            {doc.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-slate-900">{doc.name}</h4>
                            <p className="text-xs text-slate-600">{doc.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => previewDocument(doc)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                              doc.hasUrl || doc.type === 'facture' 
                                ? 'bg-slate-600 text-white hover:bg-slate-700' 
                                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            }`}
                            disabled={!doc.hasUrl && doc.type !== 'facture'}
                          >
                            Prévisualiser
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        📄
                      </div>
                      <p className="text-slate-600">Chargement des documents...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tribunal Selection */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-slate-900 flex items-center gap-2">
                🏛️ Tribunal compétent
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-blue-800 text-sm font-semibold mb-2 flex items-center gap-2">
                  ✅ Tribunal automatiquement déterminé
                </h4>
                <p className="text-blue-700 text-sm">
                  Basé sur l'adresse du débiteur et le montant de la créance (&lt; 10 000€)
                </p>
              </div>

              <div className="grid gap-4">
                {tribunals.map(tribunal => <div key={tribunal.id} className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:bg-slate-50 ${selectedTribunal === tribunal.id ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`} onClick={() => selectTribunal(tribunal.id)}>
                    <h4 className="font-semibold text-slate-900 mb-2">{tribunal.name}</h4>
                    <p className="text-sm text-slate-600 mb-1">
                      <strong>Adresse :</strong> {tribunal.address}
                    </p>
                    <p className="text-sm text-slate-600 mb-1">
                      <strong>Compétence :</strong> {tribunal.competence}
                    </p>
                    <p className="text-sm text-slate-600 mb-1">
                      <strong>Délai moyen :</strong> {tribunal.delay}
                    </p>
                    <p className="text-sm text-slate-600">
                      <strong>Mode de dépôt :</strong> {tribunal.mode}
                    </p>
                  </div>)}
              </div>
            </div>

            {/* Cost Breakdown */}
            
          </div>

          {/* Actions Footer */}
          <div className="bg-slate-50 p-8 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Étape 2/5 - Vérification du dossier
            </div>
            <div className="flex gap-4">
              <button onClick={() => navigate('/contentieux/depot-dossier')} className="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors">
                ← Précédent
              </button>
              <button onClick={handleProceedToDeposit} disabled={isDepositing} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50">
                {isDepositing ? 'Dépôt en cours...' : 'Procéder au dépôt →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recap Modal */}
      <Dialog open={showRecapModal} onOpenChange={setShowRecapModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              📋 Récapitulatif de la demande
            </DialogTitle>
          </DialogHeader>
          {selectedCase && (
            <div className="space-y-6">
              {/* Parties */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-sm text-slate-700 mb-2">👥 PARTIES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-slate-600">Demandeur :</p>
                    <div className="text-slate-800 whitespace-pre-line">{selectedCase.demandeur}</div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-600">Défendeur :</p>
                    <div className="text-slate-800 whitespace-pre-line">{selectedCase.defendeur}</div>
                  </div>
                </div>
              </div>

              {/* Montant et demandes */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-sm text-slate-700 mb-2">💰 DEMANDES</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Montant du dossier :</span>
                    <span className="text-slate-800 font-semibold">{selectedCase.montant_dossier}€</span>
                  </div>
                  {selectedCase.demandes && (
                    <div>
                      <p className="font-medium text-slate-600">Demandes :</p>
                      <div className="text-slate-800 whitespace-pre-line">{selectedCase.demandes}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Intérêts et dépens */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-sm text-slate-700 mb-2">⚖️ COMPLÉMENTS</h3>
                <div className="space-y-2 text-sm">
                  {selectedCase.interets && (
                    <div>
                      <p className="font-medium text-slate-600">✓ Intérêts demandés</p>
                      {selectedCase.interets_details && (
                        <div className="text-slate-700 ml-4">{selectedCase.interets_details}</div>
                      )}
                    </div>
                  )}
                  {selectedCase.depens && (
                    <div>
                      <p className="font-medium text-slate-600">✓ Dépens demandés</p>
                      {selectedCase.depens_details && (
                        <div className="text-slate-700 ml-4">{selectedCase.depens_details}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Références légales */}
              {selectedCase.references_legales && (
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-sm text-slate-700 mb-2">📚 RÉFÉRENCES LÉGALES</h3>
                  <div className="text-sm text-slate-800 whitespace-pre-line">{selectedCase.references_legales}</div>
                </div>
              )}

              {/* Chronologie */}
              {selectedCase.chronologie && (
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-sm text-slate-700 mb-2">📅 CHRONOLOGIE</h3>
                  <div className="text-sm text-slate-800 whitespace-pre-line max-h-32 overflow-y-auto">{selectedCase.chronologie}</div>
                </div>
              )}

              {/* Documents */}
              <div>
                <h3 className="font-semibold text-sm text-slate-700 mb-2">📎 PIÈCES JOINTES</h3>
                <div className="grid grid-cols-1 gap-2">
                  {realDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded text-sm">
                      <span className="text-lg">{doc.icon}</span>
                      <div>
                        <div className="font-medium text-slate-800">{doc.name}</div>
                        <div className="text-slate-600 text-xs">{doc.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowRecapModal(false)}>
              Modifier
            </Button>
            <Button onClick={() => {
              setShowRecapModal(false);
              setShowConfirmModal(true);
            }} className="bg-red-600 hover:bg-red-700">
              Confirmer et procéder au dépôt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🏛️ Confirmer le dépôt
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Voulez-vous procéder au dépôt de la requête au tribunal ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Annuler
            </Button>
            <Button onClick={confirmDeposit} className="bg-red-600 hover:bg-red-700">
              Confirmer le dépôt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              ✅ Requête déposée avec succès !
            </DialogTitle>
          </DialogHeader>
          {depositResult && <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">📋 Numéro de dossier :</span>
                    <span>{depositResult.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">🏛️ Tribunal :</span>
                    <span>{depositResult.tribunal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">📅 Date de dépôt :</span>
                    <span>{depositResult.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-slate-600 space-y-2">
                <p className="font-medium">📧 Vous recevrez une confirmation par email avec :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Le récépissé de dépôt</li>
                  <li>Le numéro de suivi</li>
                  <li>Les prochaines étapes</li>
                </ul>
                
                <p className="font-medium mt-4">⏱️ Délai de traitement estimé : 3-4 semaines</p>
                <p className="text-xs">🔔 Vous serez automatiquement notifié de l'évolution de votre dossier.</p>
              </div>
            </div>}
          <DialogFooter>
            <Button onClick={handleSuccessModalClose} className="w-full">
              Retour au tableau de bord
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Modal */}
      {isDepositing && <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4 text-center">
            <h3 className="text-lg font-semibold mb-4">🏛️ Dépôt en cours...</h3>
            <div className="text-slate-600 mb-4">{loadingText}</div>
            <div className="bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-300" style={{
            width: `${progress}%`
          }}></div>
            </div>
          </div>
        </div>}
    </div>;
};
export default DepotDossier;