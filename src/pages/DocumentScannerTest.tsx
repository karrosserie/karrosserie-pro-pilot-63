import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import { Badge } from '@/components/ui/badge';
import { FileImage, CheckCircle, AlertCircle, Scan } from 'lucide-react';

interface TestDocument {
  id: string;
  name: string;
  type: 'driver-license' | 'vehicle-registration' | 'receipt';
  description: string;
  autoDetectionEnabled: boolean;
}

const TEST_DOCUMENTS: TestDocument[] = [
  {
    id: 'driver-license-test',
    name: 'Permis de conduire',
    type: 'driver-license',
    description: 'Test de détection automatique pour les permis de conduire avec expansion horizontale.',
    autoDetectionEnabled: true
  },
  {
    id: 'vehicle-registration-test',
    name: 'Certificat d\'immatriculation',
    type: 'vehicle-registration',
    description: 'Test de détection automatique pour les cartes grises avec correction de perspective.',
    autoDetectionEnabled: true
  },
  {
    id: 'receipt-test',
    name: 'Ticket de caisse',
    type: 'receipt',
    description: 'Test de détection automatique pour les reçus avec redressement et amélioration du contraste.',
    autoDetectionEnabled: true
  },
  {
    id: 'other-document-test',
    name: 'Autre document',
    type: 'driver-license', // Utilise un type par défaut mais sans auto-détection
    description: 'Test avec crop manuel standard (pas d\'auto-détection).',
    autoDetectionEnabled: false
  }
];

export default function DocumentScannerTest() {
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('driver-license');
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({});
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error'>>({});

  const currentDocument = TEST_DOCUMENTS.find(doc => doc.type === selectedDocumentType) || TEST_DOCUMENTS[0];

  const handleUploadComplete = (documentType: string) => (url: string) => {
    console.log(`Upload completed for ${documentType}:`, url);
    setUploadedDocuments(prev => ({
      ...prev,
      [documentType]: url
    }));
    setTestResults(prev => ({
      ...prev,
      [documentType]: 'success'
    }));
  };

  const handleUploadError = (documentType: string) => {
    setTestResults(prev => ({
      ...prev,
      [documentType]: 'error'
    }));
  };

  const clearDocument = (documentType: string) => {
    setUploadedDocuments(prev => {
      const newDocs = { ...prev };
      delete newDocs[documentType];
      return newDocs;
    });
    setTestResults(prev => {
      const newResults = { ...prev };
      delete newResults[documentType];
      return newResults;
    });
  };

  const clearAllDocuments = () => {
    setUploadedDocuments({});
    setTestResults({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test du Scanner de Documents Automatique
          </h1>
          <p className="text-gray-600">
            Testez la détection automatique des contours et la correction de perspective pour différents types de documents.
          </p>
        </div>

        {/* Document Type Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Type de Document à Tester
            </CardTitle>
            <CardDescription>
              Sélectionnez le type de document pour tester les différents algorithmes de détection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir le type de document" />
                </SelectTrigger>
                <SelectContent>
                  {TEST_DOCUMENTS.map((doc) => (
                    <SelectItem key={doc.type} value={doc.type}>
                      <div className="flex items-center gap-2">
                        <span>{doc.name}</span>
                        {doc.autoDetectionEnabled && (
                          <Badge variant="secondary" className="text-xs">
                            Auto-détection
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <FileImage className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">{currentDocument.name}</h3>
                    <p className="text-sm text-blue-700 mt-1">{currentDocument.description}</p>
                    {currentDocument.autoDetectionEnabled && (
                      <div className="flex items-center gap-1 mt-2">
                        <Scan className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-green-700 font-medium">
                          Détection automatique activée
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test d'Upload</CardTitle>
            <CardDescription>
              Uploadez une image pour tester la détection automatique des contours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploader
              documentType={selectedDocumentType}
              documentId={`test-${selectedDocumentType}`}
              currentDocumentUrl={uploadedDocuments[selectedDocumentType]}
              onUploadComplete={handleUploadComplete(selectedDocumentType)}
              onDelete={() => clearDocument(selectedDocumentType)}
            />
          </CardContent>
        </Card>

        {/* Results Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Résultats des Tests</CardTitle>
              <CardDescription>
                Statut des tests pour chaque type de document
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllDocuments}
              className="text-gray-600"
            >
              Tout effacer
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEST_DOCUMENTS.slice(0, 3).map((doc) => {
                const hasDocument = uploadedDocuments[doc.type];
                const testResult = testResults[doc.type];

                return (
                  <div
                    key={doc.type}
                    className={`p-4 border rounded-lg ${
                      testResult === 'success'
                        ? 'border-green-200 bg-green-50'
                        : testResult === 'error'
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{doc.name}</h3>
                      {testResult === 'success' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {testResult === 'error' && (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={doc.autoDetectionEnabled ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {doc.autoDetectionEnabled ? 'Auto-détection' : 'Manuel'}
                        </Badge>
                        <span className={`text-xs ${
                          hasDocument ? 'text-green-600 font-medium' : 'text-gray-500'
                        }`}>
                          {hasDocument ? 'Testé' : 'Non testé'}
                        </span>
                      </div>

                      {hasDocument && (
                        <div className="mt-2">
                          <img
                            src={hasDocument}
                            alt={`${doc.name} - résultat`}
                            className="w-full h-20 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Instructions de test :</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Prenez des photos de documents avec différents angles et perspectives</li>
                <li>La détection automatique positionnera le recadrage - vous devrez valider</li>
                <li>Vous pouvez ajuster la zone de recadrage avant de valider</li>
                <li>Testez avec des documents légèrement pliés ou déformés</li>
                <li>Pour les permis : l'expansion horizontale est autorisée</li>
                <li>Vérifiez que le workflow nécessite toujours votre validation finale</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}