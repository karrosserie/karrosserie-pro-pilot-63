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

interface RepairOrderSignatureRequest {
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

export const sendRepairOrderForSignature = async (
  repairOrderId: string,
  documentUrl: string,
  clientData: any
): Promise<SignatureResponse> => {
  try {
    console.log('Sending repair order for signature:', { repairOrderId, documentUrl, clientData });

    // Logs détaillés pour diagnostiquer le problème des recipient_id
    console.log('=== DIAGNOSTIC RECIPIENT_ID REPAIR ORDER ===');
    console.log('ClientData structure:', {
      id: clientData?.id,
      first_name: clientData?.first_name,
      last_name: clientData?.last_name,
      oodrive_recipient_id: clientData?.oodrive_recipient_id,
      hasOodriveId: !!clientData?.oodrive_recipient_id,
      fullClientData: clientData
    });

    // Préparer les données du client
    const clientPhone = clientData?.phone || '';
    const formattedClientPhone = clientPhone.startsWith('+33') ? clientPhone : `+33${clientPhone.replace(/^0/, '')}`;

    // Préparer les données du client avec l'ID Oodrive si disponible
    const clientSignatureData: SignatureData = {
      firstname: clientData?.first_name || '',
      lastname: clientData?.last_name || '',
      address_1: clientData?.address || '',
      postal_code: clientData?.postal_code || '',
      city: clientData?.city || '',
      cell_phone: formattedClientPhone || '',
      email: 'archive2@karrosserie.pro', // Email de test comme pour les cessions
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

    const requestData: RepairOrderSignatureRequest = {
      contractName: `ordre_reparation_${repairOrderId}.pdf`,
      messageTitle: "Signature de votre ordre de réparation",
      messageBody: "Nous vous invitons à signer l'ordre de réparation ci-joint. Cette signature confirme votre accord sur les travaux à effectuer et leurs modalités.",
      filePath: documentUrl,
      data: [clientSignatureData] // Seulement le client pour les ordres de réparation
    };

    console.log('=== FINAL REQUEST DATA REPAIR ORDER ===');
    console.log('Client signature data:', clientSignatureData);
    console.log('Full request data:', requestData);

    const response = await fetch('https://n8n.karrosserie.pro/webhook/2ca6fd6a-98f6-4af7-a7a2-23f0032f7fd3', {
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
    console.log('Repair Order Signature API response:', responseData);

    return responseData;
  } catch (error) {
    console.error('Error sending repair order for signature:', error);
    throw error;
  }
};