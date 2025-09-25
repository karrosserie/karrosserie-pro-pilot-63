import React from 'react';

interface DefaultRepairOrderSignatureFooterProps {
  companyData: any;
  signatureData?: {
    signature: string | null;
    clientName: string;
    signatureDate: string | null;
  };
  isForOodriveSignature?: boolean;
}

const DefaultRepairOrderSignatureFooter: React.FC<DefaultRepairOrderSignatureFooterProps> = ({
  companyData,
  signatureData,
  isForOodriveSignature = false
}) => {
  return (
    <div className="mt-8 space-y-6">
      {/* General Conditions */}
      <div className="text-xs space-y-2">
        <h3 className="font-bold">CONDITIONS GÉNÉRALES :</h3>
        <div className="grid grid-cols-1 gap-1">
          <p>• Les véhicules non retirés dans les 15 jours suivant la fin des travaux seront facturés 5€/jour de gardiennage.</p>
          <p>• Notre responsabilité ne pourra être engagée en cas de vol ou détérioration des objets laissés dans les véhicules.</p>
          <p>• Conformément à l'article 1641 du Code Civil, nous garantissons nos travaux pendant 2 ans.</p>
          <p>• Les pièces de réemploi sont garanties 3 mois ou 10 000 km.</p>
          <p>• En cas de litige, attribution de compétence aux tribunaux de {companyData?.city || 'Paris'}.</p>
          <p>• Les présentes conditions l'emportent sur toutes conditions contraires.</p>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        {/* Garage signature */}
        <div className="text-center">
          <p className="text-sm font-semibold mb-2">Le Garagiste</p>
          <p className="text-sm">{companyData?.name}</p>
          <div className="mt-4 mb-2 border-b border-gray-300 h-12 flex items-end justify-center">
            <span className="text-xs text-gray-500">Signature</span>
          </div>
        </div>

        {/* Client signature */}
        <div className="text-center">
          <p className="text-sm font-semibold mb-2">Le Client</p>
          <p className="text-sm">
            {signatureData?.clientName || 'Nom du client'}
          </p>
          <div className="mt-4 mb-2 border-b border-gray-300 h-12 flex items-center justify-center">
            {isForOodriveSignature ? (
              <span className="text-sm font-mono bg-yellow-100 px-2 py-1 rounded">[Signature1/]</span>
            ) : signatureData?.signature ? (
              <img
                src={signatureData.signature}
                alt="Signature client"
                className="max-h-10 object-contain"
              />
            ) : (
              <span className="text-xs text-gray-500">Signature</span>
            )}
          </div>
          {signatureData?.signatureDate && (
            <p className="text-xs text-gray-600">
              Signé le {new Date(signatureData.signatureDate).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </div>

      {/* Legal mentions */}
      <div className="text-xs text-gray-600 text-center mt-6">
        <p>Document généré par Karrosserie Pro - www.karrosserie.pro</p>
      </div>
    </div>
  );
};

export default DefaultRepairOrderSignatureFooter;