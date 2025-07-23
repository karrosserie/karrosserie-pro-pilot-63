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
    
    // Créer un lien de téléchargement
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    
    // Nettoyer l'URL
    URL.revokeObjectURL(url);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return { success: false, error: error.message };
  }
};