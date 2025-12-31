import React from 'react';
import { Check } from 'lucide-react';

interface NewRepairOrderAcceptanceProps {
  orderData: {
    reference?: string;
    date?: string;
    amount?: number;
  };
  vehicleData?: {
    brand?: string;
    model?: string;
    licensePlate?: string;
    start_date?: string;
    end_date?: string;
  };
  expertiseData?: {
    reportNumber?: string;
  };
  clientData?: {
    name?: string;
  };
  signatureData?: {
    signature: string | null;
    clientName: string;
    signatureDate: string | null;
  };
  isForOodrive?: boolean;
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
};


const NewRepairOrderAcceptance: React.FC<NewRepairOrderAcceptanceProps> = ({
  orderData,
  vehicleData,
  expertiseData,
  clientData,
  signatureData,
  isForOodrive = false,
}) => {
  const acceptanceItems = [
    "Je reconnais avoir reçu un exemplaire des conditions générales et en accepte les termes.",
    "Je reconnais avoir été informé de mon droit de rétractation conformément au Code de la consommation.",
    "J'accepte les travaux décrits dans le rapport d'expertise référencé ci-dessus.",
    "J'accepte les délais prévisionnels de réparation indiqués.",
    "Je confirme avoir retiré tous mes effets personnels du véhicule ou les avoir déclarés au prestataire.",
  ];

  return (
    <div className="bg-white p-6 text-black">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">RÉCAPITULATIF ET ACCEPTATION</h2>

      {/* Résumé */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
        <h3 className="text-lg font-bold text-center mb-4 text-gray-800">RÉSUMÉ DE L'ORDRE DE RÉPARATION</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">N° Ordre de Réparation :</span>
            <span className="font-bold text-gray-800">{orderData.reference}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Date :</span>
            <span className="font-bold text-gray-800">{formatDate(orderData.date)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Véhicule :</span>
            <span className="font-bold text-gray-800">
              {vehicleData?.brand} {vehicleData?.model} - {vehicleData?.licensePlate}
            </span>
          </div>
          
          {expertiseData?.reportNumber && (
            <div className="flex justify-between">
              <span className="text-gray-600">N° Rapport Expertise :</span>
              <span className="font-bold text-gray-800">{expertiseData.reportNumber}</span>
            </div>
          )}
          
          {vehicleData?.start_date && vehicleData?.end_date && (
            <div className="flex justify-between">
              <span className="text-gray-600">Délai prévisionnel :</span>
              <span className="font-bold text-gray-800">
                Du {formatDate(vehicleData.start_date)} au {formatDate(vehicleData.end_date)}
              </span>
            </div>
          )}

        </div>
      </div>

      {/* Cases d'acceptation */}
      <h3 className="font-bold text-gray-800 mb-4">ACCEPTATION DU CLIENT</h3>
      
      <div className="space-y-3 mb-8">
        {acceptanceItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 border border-gray-400 bg-gray-100 flex items-center justify-center rounded flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-gray-700" />
            </div>
            <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
          </div>
        ))}
      </div>

      {/* Signature client uniquement */}
      <div className="mt-8 flex justify-center">
        <div className="text-center">
          <h3 className="text-lg font-bold mb-3 text-gray-800">SIGNATURE DU CLIENT</h3>
          
          <div className="border border-gray-300 rounded p-4 w-64 h-24 flex items-center justify-center bg-yellow-50">
            {isForOodrive ? (
              <span className="font-mono text-amber-700 bg-yellow-100 px-2 py-1 rounded">[Signature1/]</span>
            ) : signatureData?.signature ? (
              <img
                src={signatureData.signature}
                alt="Signature client"
                className="max-h-16 object-contain"
              />
            ) : (
              <span className="text-sm text-gray-500">Signature en attente</span>
            )}
          </div>
          
          <p className="text-sm mt-2 text-gray-700">
            {signatureData?.clientName || clientData?.name || ''}
          </p>
          
          {signatureData?.signatureDate && (
            <p className="text-xs text-gray-600 mt-1">
              Signé le {formatDate(signatureData.signatureDate)}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm italic text-center mt-8 text-gray-600">
        « Fait en deux exemplaires originaux »
      </p>

      <div className="mt-6 text-xs text-gray-500 text-center">
        Page 4/4
      </div>
    </div>
  );
};

export default NewRepairOrderAcceptance;
