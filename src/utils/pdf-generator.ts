import { pdf } from '@react-pdf/renderer';
import { formatDate } from './date-formatter';
import AttestationPDF from '@/components/fleet/AttestationPDF';

export const generateAttestationPDF = async (loanData: any, companyData: any, userPosition: string) => {
  try {
    // Créer le document PDF
    const doc = AttestationPDF({ loanData, companyData, userPosition });
    
    // Générer le blob PDF
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    // Créer un nom de fichier unique
    const fileName = `attestation-pret-${loanData?.clients?.last_name || 'client'}-${formatDate(new Date().toISOString())}.pdf`;
    
    // Créer une URL pour le blob et l'ouvrir dans un nouvel onglet
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // Nettoyer l'URL après un délai pour permettre l'ouverture
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return { success: false, error: error.message };
  }
};