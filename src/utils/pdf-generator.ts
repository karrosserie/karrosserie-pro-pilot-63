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
    
    // Créer une URL pour le blob et déclencher le téléchargement
    const url = URL.createObjectURL(blob);
    
    // Méthode robuste pour éviter ERR_BLOCKED_BY_CLIENT
    const downloadWithFallback = () => {
      try {
        // Tentative de téléchargement direct
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Déclencher dans le contexte d'une action utilisateur
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (linkError) {
        console.warn('Téléchargement direct bloqué, utilisation de window.open:', linkError);
        // Fallback: ouvrir dans un nouvel onglet
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          console.error('Téléchargement bloqué par le navigateur. Veuillez désactiver votre bloqueur de publicités ou autoriser les téléchargements pour ce site.');
        }
      }
    };
    
    downloadWithFallback();
    
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