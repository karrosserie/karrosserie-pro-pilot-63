import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Building2, Euro, Calendar, AlertTriangle, CheckCircle, Clock, Download, Eye } from 'lucide-react';
import { useJudicialCases } from '@/hooks/use-judicial-cases';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const DepotDossier = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { cases, loading } = useJudicialCases();
  const [selectedCase, setSelectedCase] = useState(null);
  const [depositStep, setDepositStep] = useState(2);
  const [isDepositing, setIsDepositing] = useState(false);

  useEffect(() => {
    if (id && cases) {
      const foundCase = cases.find(c => c.id === id);
      setSelectedCase(foundCase);
    }
  }, [id, cases]);

  const steps = [
    { id: 1, label: "Dossier généré", icon: "✓", completed: true },
    { id: 2, label: "Vérification", icon: "2", current: true },
    { id: 3, label: "Tribunal compétent", icon: "3", completed: false },
    { id: 4, label: "Dépôt", icon: "4", completed: false },
    { id: 5, label: "Suivi", icon: "5", completed: false },
  ];

  const documents = [
    {
      name: "Facture originale",
      description: "Facture impayée • 15/11/2024 • 125 Ko",
      icon: "📄",
      type: "facture"
    },
    {
      name: "Devis signé", 
      description: "Preuve d'accord contractuel • 02/11/2024 • 89 Ko",
      icon: "✍️",
      type: "devis"
    },
    {
      name: "Mise en demeure avec AR",
      description: "LRE du 03/01/2025 • Accusé réception • 234 Ko", 
      icon: "📮",
      type: "mise_en_demeure"
    },
    {
      name: "Historique des relances",
      description: "5 relances automatiques • Emails, SMS • 156 Ko",
      icon: "📧", 
      type: "relances"
    },
    {
      name: "Requête en injonction de payer",
      description: "Document généré automatiquement • 198 Ko",
      icon: "⚖️",
      type: "requete",
      primary: true
    }
  ];

  const handleProceedToDeposit = async () => {
    setIsDepositing(true);
    
    // Simulate deposit process
    const loadingSteps = [
      'Vérification des documents...',
      'Connexion au portail du tribunal...',
      'Téléchargement des pièces jointes...',
      'Validation de la requête...',
      'Paiement des frais de greffe...',
      'Confirmation du dépôt...'
    ];

    for (let i = 0; i < loadingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDepositStep(i + 3);
    }

    setIsDepositing(false);
    // Show success message and redirect
    setTimeout(() => {
      navigate('/contentieux/suivi-procedures');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Chargement des dossiers...</p>
        </div>
      </div>
    );
  }

  if (!id) {
    // List view of all cases
    return (
      <div className="container mx-auto p-6 space-y-6">
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
          {cases?.map((judicialCase) => (
            <Card key={judicialCase.id} className="hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={() => navigate(`/contentieux/depot-dossier/${judicialCase.id}`)}>
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
                  <div className="text-right">
                    <Button variant="outline" size="sm">
                      Voir le dossier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {(!cases || cases.length === 0) && (
            <Card>
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
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (!selectedCase) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Dossier non trouvé</p>
          <Button variant="outline" className="mt-2" onClick={() => navigate('/contentieux/depot-dossier')}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">🏛️ Dépôt de Requête Tribunal</h1>
        <p className="opacity-90">Procédure d'injonction de payer simplifiée</p>
      </div>

      {/* Breadcrumb */}
      <div className="bg-card border-b px-6 py-4">
        <Button variant="ghost" onClick={() => navigate('/contentieux/depot-dossier')} className="p-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
        <span className="text-muted-foreground ml-2">
          / Dépôt tribunal / {selectedCase.reference}
        </span>
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        {/* Process Steps */}
        <div className="flex justify-center mb-8 relative">
          <div className="absolute top-5 left-1/4 right-1/4 h-0.5 bg-border"></div>
          <div className="flex justify-between w-full max-w-2xl relative z-10">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step.completed ? 'bg-green-600 text-white' : 
                  step.current ? 'bg-red-600 text-white' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {step.icon}
                </div>
                <span className={`text-sm mt-2 text-center ${
                  step.current ? 'text-red-600 font-semibold' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader className="bg-muted">
            <CardTitle>Requête en Injonction de Payer</CardTitle>
            <p className="text-muted-foreground">
              {selectedCase.defendeur?.split('\n')[0]} - {selectedCase.reference} - {selectedCase.montant_dossier}€
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Info Alert */}
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Votre dossier a été automatiquement généré avec tous les documents requis. 
                Vérifiez les informations ci-dessous avant le dépôt au tribunal.
              </AlertDescription>
            </Alert>

            {/* Case Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📋 Récapitulatif de la créance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Débiteur</label>
                  <p className="font-medium">{selectedCase.defendeur?.split('\n')[0]}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Montant principal</label>
                  <p className="font-medium">{selectedCase.montant_dossier}€</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pénalités de retard</label>
                  <p className="font-medium">287,00 €</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total réclamé</label>
                  <p className="font-semibold text-lg text-primary">
                    {(parseFloat(selectedCase.montant_dossier) + 287 + 40).toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📎 Documents joints au dossier
              </h3>
              <div className="bg-muted p-4 rounded-lg space-y-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-card p-4 rounded border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded flex items-center justify-center text-sm">
                        {doc.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{doc.name}</h4>
                        <p className="text-xs text-muted-foreground">{doc.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Prévisualiser
                      </Button>
                      {doc.primary && (
                        <Button size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tribunal */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🏛️ Tribunal compétent
              </h3>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Tribunal automatiquement déterminé basé sur l'adresse du débiteur et le montant de la créance
                </AlertDescription>
              </Alert>
              
              <Card className="mt-4 border-2 border-primary">
                <CardContent className="p-4">
                  <h4 className="font-semibold">Tribunal Judiciaire de Marseille</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Adresse :</strong> 6 Rue Joseph Autran, 13006 Marseille
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Compétence :</strong> Créances jusqu'à 10 000€
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Délai moyen :</strong> 3-4 semaines
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Cost Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                💰 Frais de procédure
              </h3>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Droit de greffe (injonction de payer)</span>
                  <span className="font-medium">38,00 €</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Frais de signification (si nécessaire)</span>
                  <span className="font-medium">~80,00 €</span>
                </div>
                <div className="flex justify-between py-2 font-semibold text-lg">
                  <span>Total estimé</span>
                  <span>118,00 €</span>
                </div>
              </div>
              
              <Alert className="mt-4" variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Les frais de procédure seront à votre charge. En cas de succès, vous pourrez demander 
                  leur remboursement au débiteur lors de l'exécution du jugement.
                </AlertDescription>
              </Alert>
            </div>

            {isDepositing && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold mb-4">🏛️ Dépôt en cours...</h3>
                    <p className="text-muted-foreground mb-4">
                      Connexion au portail du tribunal...
                    </p>
                    <Progress value={75} className="w-full" />
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>

          {/* Actions Footer */}
          <div className="bg-muted p-6 flex items-center justify-between border-t">
            <div className="text-sm text-muted-foreground">
              Étape 2/5 - Vérification du dossier
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/contentieux/depot-dossier')}>
                ← Précédent
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleProceedToDeposit}
                disabled={isDepositing}
              >
                {isDepositing ? 'Dépôt en cours...' : 'Procéder au dépôt →'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DepotDossier;