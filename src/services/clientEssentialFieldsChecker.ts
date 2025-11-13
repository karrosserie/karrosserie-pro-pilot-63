interface EssentialFieldsCheck {
  hasAllFields: boolean;
  missingFields: string[];
}

export const clientEssentialFieldsChecker = {
  checkEssentialFields: async (
    client: any,
    companyId: string
  ): Promise<EssentialFieldsCheck> => {
    const missingFields: string[] = [];
    
    if (!client.first_name?.trim()) missingFields.push('prenom');
    if (!client.last_name?.trim()) missingFields.push('nom');
    if (!client.email?.trim()) missingFields.push('email');
    if (!client.phone?.trim()) missingFields.push('telephone');
    
    const hasAllFields = missingFields.length === 0;
    
    // Si des champs manquent, appeler le webhook
    if (!hasAllFields) {
      await clientEssentialFieldsChecker.notifyMissingFields(missingFields, companyId);
    }
    
    return { hasAllFields, missingFields };
  },
  
  notifyMissingFields: async (
    missingFields: string[],
    companyId: string
  ): Promise<void> => {
    try {
      const params = new URLSearchParams({
        carrosserie_id: companyId,
        champs_manquants: missingFields.join(',')
      });
      
      const webhookUrl = `https://n8n.karrosserie.pro/webhook/06ddc86e-880e-41b7-b6b2-425dc6ae47df?${params.toString()}`;
      
      console.log('🚨 Calling webhook for missing essential fields:', {
        companyId,
        missingFields,
        url: webhookUrl
      });
      
      const response = await fetch(webhookUrl, {
        method: 'GET'
      });
      
      if (response.ok) {
        console.log('✅ Webhook notified successfully');
      } else {
        console.error('❌ Webhook notification failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Error calling webhook:', error);
      // Ne pas throw l'erreur pour ne pas bloquer le flux
    }
  }
};
