import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MapPin, Building } from 'lucide-react';

interface AddressConfirmationProps {
  companyName: string;
  address: string;
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const AddressConfirmation = ({ companyName, address, onConfirm, onBack, isLoading }: AddressConfirmationProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-karrosserie-orange" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Confirmation de l'adresse
        </h2>
        <p className="text-gray-600">
          Veuillez vérifier que l'adresse de votre entreprise est correcte
        </p>
      </div>

      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building className="w-5 h-5" />
            Adresse de l'entreprise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Entreprise :</p>
            <p className="text-lg font-semibold text-gray-900">{companyName}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Adresse :</p>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-karrosserie-orange">
              <p className="text-lg text-gray-900 leading-relaxed">{address}</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Pourquoi cette vérification ?</p>
                <p className="text-sm text-blue-700 mt-1">
                  Cette adresse sera utilisée pour vos documents officiels et la correspondance client. 
                  Assurez-vous qu'elle soit correcte et complète.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          Modifier l'adresse
        </Button>
        <Button 
          type="button" 
          onClick={async () => {
            // Onboarding : Adresse validée
            const { onboardingService } = await import('@/services/onboarding/OnboardingService');
            onboardingService.updateOnboardingStep('tunnel1', 'addressValidated', { address });
            onConfirm();
          }}
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Inscription..." : "Confirmer et s'inscrire"}
        </Button>
      </div>
    </div>
  );
};

export default AddressConfirmation;