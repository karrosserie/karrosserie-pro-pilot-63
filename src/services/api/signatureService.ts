
interface SignatureData {
  firstname: string;
  lastname: string;
  company_name?: string;
  civility?: string;
  address_1: string;
  postal_code: string;
  city: string;
  cell_phone: string;
  email: string;
  signature_mode: number;
  transport_mode: number;
}

interface SignatureRequest {
  contractName: string;
  messageTitle: string;
  messageBody: string;
  filePath: string;
  data: SignatureData[];
}

export const sendForSignature = async (
  cessionId: string,
  documentUrl: string,
  companyData: any,
  clientData: any
): Promise<boolean> => {
  try {
    console.log('Sending cession for signature:', { cessionId, documentUrl, companyData, clientData });

    // Préparer les données de l'entreprise
    const companyName = companyData?.name || '';
    const companyWords = companyName.split(' ').filter(word => word.trim());
    const companyFirstName = companyWords.length >= 2 ? companyWords[0] : 'Société';
    const companyLastName = companyWords.length >= 2 ? companyWords.slice(1).join(' ') : companyName || 'CAR COOL';

    // Préparer les données du client
    const clientPhone = clientData?.phone || '';
    const formattedClientPhone = clientPhone.startsWith('+33') ? clientPhone : `+33${clientPhone.replace(/^0/, '')}`;
    
    const companyPhone = companyData?.phone || '';
    const formattedCompanyPhone = companyPhone.startsWith('+33') ? companyPhone : `+33${companyPhone.replace(/^0/, '')}`;

    const requestData: SignatureRequest = {
      contractName: `${cessionId}.pdf`,
      messageTitle: "Votre cession de créance",
      messageBody: "Dans le cadre du processus de cession de créance, nous vous invitons à signer le document ci-joint. Cette signature est nécessaire pour autoriser votre compagnie d'assurance à nous verser directement le montant dû.",
      filePath: documentUrl,
      data: [
        {
          firstname: companyFirstName,
          lastname: companyLastName,
          company_name: companyName,
          address_1: companyData?.address || '123 Boulevard Michelet',
          postal_code: companyData?.zipcode || '13008',
          city: companyData?.city || 'MARSEILLE',
          cell_phone: formattedCompanyPhone || '+33646465242',
          email: 'archive@karrosserie.pro',
          signature_mode: 15,
          transport_mode: 2
        },
        {
          civility: 'Monsieur',
          firstname: clientData?.first_name || 'Geoffrey',
          lastname: clientData?.last_name || 'GOBEYN',
          address_1: clientData?.address || '83 Boulevard du redon',
          postal_code: clientData?.postal_code || '13009',
          city: clientData?.city || 'MARSEILLE',
          cell_phone: formattedClientPhone || '+33646465242',
          email: 'archive2@karrosserie.pro',
          signature_mode: 15,
          transport_mode: 2
        }
      ]
    };

    console.log('Signature request data:', requestData);

    const response = await fetch('https://n8n.karrosserie.pro/webhook/3a2a91a0-2ff5-4c42-a37e-3568ae7cf5dc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Signature API response:', responseData);

    return true;
  } catch (error) {
    console.error('Error sending for signature:', error);
    throw error;
  }
};
