import { formatToInternational, validateAndFormatForWebhook } from '@/utils/phoneValidation';

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
  recipient_id?: string;
}

interface SignatureRequest {
  contractName: string;
  messageTitle: string;
  messageBody: string;
  filePath: string;
  data: SignatureData[];
}

interface SignatureResponse {
  recipients: Array<{
    id: number;
    email: string;
  }>;
  contract: {
    contract_id: number;
  };
}

export const sendForSignature = async (
  cessionId: string,
  documentUrl: string,
  companyData: any,
  clientData: any
): Promise<SignatureResponse> => {
  try {
    console.log('Sending cession for signature:', { cessionId, documentUrl, companyData, clientData });

    // Logs détaillés pour diagnostiquer le problème des recipient_id
    console.log('=== DIAGNOSTIC RECIPIENT_ID ===');
    console.log('CompanyData structure:', {
      id: companyData?.id,
      name: companyData?.name,
      oodrive_recipient_id: companyData?.oodrive_recipient_id,
      hasOodriveId: !!companyData?.oodrive_recipient_id
    });
    
    console.log('ClientData structure:', {
      id: clientData?.id,
      first_name: clientData?.first_name,
      last_name: clientData?.last_name,
      oodrive_recipient_id: clientData?.oodrive_recipient_id,
      hasOodriveId: !!clientData?.oodrive_recipient_id,
      fullClientData: clientData
    });

    // Valider le téléphone du client AVANT de construire la requête
    const clientPhone = clientData?.phone || '';
    const clientPhoneValidation = validateAndFormatForWebhook(clientPhone);
    if (!clientPhoneValidation.valid) {
      throw new Error(`Téléphone du client invalide : ${clientPhoneValidation.error}`);
    }
    console.log('✅ Téléphone client validé:', clientPhoneValidation.formatted);

    // Valider le téléphone de l'entreprise AVANT de construire la requête
    const companyPhone = companyData?.phone || '';
    const companyPhoneValidation = validateAndFormatForWebhook(companyPhone);
    if (!companyPhoneValidation.valid) {
      throw new Error(`Téléphone de l'entreprise invalide : ${companyPhoneValidation.error}`);
    }
    console.log('✅ Téléphone entreprise validé:', companyPhoneValidation.formatted);

    const formattedClientPhone = clientPhoneValidation.formatted!;
    const formattedCompanyPhone = companyPhoneValidation.formatted!;

    // Préparer les données de l'entreprise
    const companyName = companyData?.name || '';
    const companyWords = companyName.split(' ').filter((word: string) => word.trim());
    const companyFirstName = companyWords.length >= 2 ? companyWords[0] : 'Société';
    const companyLastName = companyWords.length >= 2 ? companyWords.slice(1).join(' ') : companyName || '';

    // Préparer les données de l'entreprise avec l'ID Oodrive si disponible
    const companySignatureData: SignatureData = {
      firstname: companyFirstName,
      lastname: companyLastName,
      company_name: companyName,
      address_1: companyData?.address || '',
      postal_code: companyData?.zipcode || '',
      city: companyData?.city || '',
      cell_phone: formattedCompanyPhone || '',
      email: 'archive@karrosserie.pro',
      signature_mode: 15,
      transport_mode: 2
    };

    // Ajouter l'ID Oodrive de l'entreprise si disponible
    if (companyData?.oodrive_recipient_id) {
      companySignatureData.recipient_id = companyData.oodrive_recipient_id;
      console.log('✅ Including company recipient_id:', companyData.oodrive_recipient_id);
    } else {
      console.log('❌ No company recipient_id found');
    }

    // Préparer les données du client avec l'ID Oodrive si disponible
    const clientSignatureData: SignatureData = {
      firstname: clientData?.first_name || '',
      lastname: clientData?.last_name || '',
      address_1: clientData?.address || '',
      postal_code: clientData?.postal_code || '',
      city: clientData?.city || '',
      cell_phone: formattedClientPhone || '',
      email: 'karrosserie.p@gmail.com',
      signature_mode: 15,
      transport_mode: 2
    };

    // Ajouter l'ID Oodrive du client si disponible
    if (clientData?.oodrive_recipient_id) {
      clientSignatureData.recipient_id = clientData.oodrive_recipient_id;
      console.log('✅ Including client recipient_id:', clientData.oodrive_recipient_id);
    } else {
      console.log('❌ No client recipient_id found');
    }

    const requestData: SignatureRequest = {
      contractName: `${cessionId}.pdf`,
      messageTitle: "Votre cession de créance",
      messageBody: "Dans le cadre du processus de cession de créance, nous vous invitons à signer le document ci-joint. Cette signature est nécessaire pour autoriser votre compagnie d'assurance à nous verser directement le montant dû.",
      filePath: documentUrl,
      data: [companySignatureData, clientSignatureData]
    };

    console.log('=== FINAL REQUEST DATA ===');
    console.log('Company signature data:', companySignatureData);
    console.log('Client signature data:', clientSignatureData);
    console.log('Full request data:', requestData);

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

    const responseData: SignatureResponse = await response.json();
    console.log('Signature API response:', responseData);

    return responseData;
  } catch (error) {
    console.error('Error sending for signature:', error);
    throw error;
  }
};
