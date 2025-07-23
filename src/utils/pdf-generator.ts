import { formatDate } from './date-formatter';

export const generateAttestationPDF = async (loanData: any, companyData: any, userPosition: string) => {
  // Import dynamique de jsPDF
  const { jsPDF } = await import('jspdf');
  
  // Créer un nouveau document PDF
  const doc = new jsPDF();
  
  // Configuration
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 15;
  const rightMargin = 15;
  let yPosition = 25;
  
  // Titre principal centré
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ATTESTATION DE PRÊT DE VÉHICULE DE COURTOISIE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;
  
  // Configuration exacte des colonnes comme dans l'aperçu : grid-cols-[1fr_1.5fr_1fr]
  // Reproduction de grid-cols-[1fr_1.5fr_1fr] gap-6
  const totalWidth = pageWidth - leftMargin - rightMargin;
  const gap = 6;
  const totalGridParts = 1 + 1.5 + 1; // 3.5 parts au total
  const baseColWidth = (totalWidth - (2 * gap)) / totalGridParts;
  
  const col1X = leftMargin;
  const col1Width = baseColWidth; // 1fr
  const col2X = col1X + col1Width + gap;
  const col2Width = baseColWidth * 1.5; // 1.5fr
  const col3X = col2X + col2Width + gap;
  const col3Width = baseColWidth; // 1fr

  let y1 = yPosition;
  let y2 = yPosition;
  let y3 = yPosition;

  // === COLONNE 1 - ENTREPRISE ===
  // Logo de l'entreprise
  if (companyData.logo_url) {
    try {
      // Charger l'image et la convertir en base64
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      // Fonction pour convertir une image en base64
      const getBase64Image = (url: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
          };
          img.onerror = reject;
          img.src = url;
        });
      };
      
      // Essayer d'afficher le logo de l'entreprise
      const logoBase64 = await getBase64Image(companyData.logo_url);
      doc.addImage(logoBase64, 'PNG', col1X, y1 - 3, 40, 15);
      y1 += 20;
    } catch (error) {
      console.error('Erreur lors du chargement du logo:', error);
      // Fallback en cas d'erreur
      doc.setFillColor(249, 115, 22); // bg-orange-500
      doc.roundedRect(col1X, y1 - 3, 50, 12, 6, 6, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('AUTO PAINT', col1X + 25, y1 + 3, { align: 'center' });
      y1 += 15;
    }
  } else {
    // Fallback si pas de logo
    doc.setFillColor(249, 115, 22); // bg-orange-500
    doc.roundedRect(col1X, y1 - 3, 50, 12, 6, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('AUTO PAINT', col1X + 25, y1 + 3, { align: 'center' });
    y1 += 15;
  }

  // Nom de l'entreprise
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(companyData.name || '', col1X, y1);
  y1 += 6;

  // Informations entreprise (text-sm)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (companyData.address) {
    doc.text(companyData.address, col1X, y1);
    y1 += 4;
  }
  if (companyData.zipcode || companyData.city) {
    doc.text(`${companyData.zipcode || ''} ${companyData.city || ''}`, col1X, y1);
    y1 += 4;
  }
  if (companyData.phone) {
    doc.text(`Téléphone : ${companyData.phone}`, col1X, y1);
    y1 += 4;
  }
  if (companyData.email) {
    doc.text(`E-mail : ${companyData.email}`, col1X, y1);
    y1 += 4;
  }
  if (companyData.siret) {
    doc.text(`SIRET : ${companyData.siret}`, col1X, y1);
    y1 += 4;
  }
  if (companyData.tva) {
    doc.text(`N° TVA : ${companyData.tva}`, col1X, y1);
  }

  // === COLONNE 2 - VÉHICULE (1.5fr - plus large) ===
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Désignation du véhicule d\'emprunt', col2X, y2);
  y2 += 8;

  // Informations véhicule avec alignement exact comme l'aperçu
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  // Marque (flex justify-between simulé)
  doc.setFont('helvetica', 'normal');
  doc.text('Marque', col2X, y2);
  doc.text(loanData?.fleet_vehicles?.car_brands?.name || '', col2X + 35, y2);
  y2 += 4;

  // Modèle
  doc.text('Modèle', col2X, y2);
  doc.text(loanData?.fleet_vehicles?.car_models?.name || '', col2X + 35, y2);
  y2 += 4;

  // Immatriculation avec marge mb-4
  doc.text('Immatriculation', col2X, y2);
  doc.text(loanData?.fleet_vehicles?.license_plate || '', col2X + 35, y2);
  y2 += 8; // mb-4

  // Grid grid-cols-2 pour Départ/Retour
  const departCol = col2X;
  const retourCol = col2X + (col2Width / 2);

  // Section Départ mt-3
  y2 += 3;
  doc.setFont('helvetica', 'bold');
  doc.text('Départ :', departCol, y2);
  
  // Section Retour (côte à côte)
  doc.text('Retour :', retourCol, y2);
  y2 += 4;

  // Informations départ/retour en space-y-1
  doc.setFont('helvetica', 'normal');
  
  // Le : date
  doc.text(`Le : ${loanData?.start_date ? formatDate(loanData.start_date) : ''}`, departCol, y2);
  doc.text(`Le : ${loanData?.expected_return_date ? formatDate(loanData.expected_return_date) : ''}`, retourCol, y2);
  y2 += 4;
  
  // Kilométrage
  doc.text(`Kilométrage : ${loanData?.start_mileage || ''} Km`, departCol, y2);
  doc.text('Kilométrage : - - - Km', retourCol, y2);
  y2 += 4;
  
  // Carburant
  doc.text(`Carburant : ${loanData?.fuel_level_start || ''}%`, departCol, y2);
  doc.text('Carburant : - - - %', retourCol, y2);

  // === COLONNE 3 - CLIENT ===
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Au client', col3X, y3);
  y3 += 8;

  // Nom client (font-medium)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`${loanData?.clients?.first_name || ''} ${loanData?.clients?.last_name || ''}`, col3X, y3);
  y3 += 5;

  // Informations client (text-sm space-y-1)
  doc.setFont('helvetica', 'normal');
  if (loanData?.clients?.address) {
    doc.text(loanData.clients.address, col3X, y3);
    y3 += 4;
  }
  
  if (loanData?.clients?.postal_code || loanData?.clients?.city) {
    const addressLine = [loanData?.clients?.postal_code, loanData?.clients?.city].filter(Boolean).join(' ');
    doc.text(addressLine, col3X, y3);
    y3 += 4;
  }
  
  if (loanData?.clients?.phone) {
    doc.text(`Téléphone : ${loanData.clients.phone}`, col3X, y3);
    y3 += 4;
  }

  // Numéro de contrat (mt-3)
  if (loanData?.insurance_contract_number) {
    y3 += 3;
    doc.setFont('helvetica', 'bold');
    doc.text('N° de contrat : ', col3X, y3);
    doc.setFont('helvetica', 'normal');
    doc.text(loanData.insurance_contract_number, col3X + 28, y3);
  }
  
  // Nouvelle page pour le contrat détaillé
  doc.addPage();
  yPosition = 30;
  
  // Titre du contrat
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRAT DE PRÊT DE VÉHICULE DE COURTOISIE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.text('(Version amendée, complétée et renforcée)', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  // ENTRE LES SOUSSIGNÉS
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('ENTRE LES SOUSSIGNÉS :', leftMargin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(9);
  doc.text('Le Prêteur :', leftMargin, yPosition);
  yPosition += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(`Nom du garage : ${companyData.name?.toUpperCase() || "AUTO PAINT"}`, leftMargin, yPosition);
  yPosition += 4;
  doc.text(`Adresse : ${companyData.address || "25 rue sainte victoire"} ${companyData.zipcode || "13006"} ${companyData.city || "MARSEILLE"}`, leftMargin, yPosition);
  yPosition += 4;
  doc.text(`N° SIRET : ${companyData.siret || "12345678900010"}`, leftMargin, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('ET', leftMargin, yPosition);
  yPosition += 8;
  
  doc.text('L\'Emprunteur :', leftMargin, yPosition);
  yPosition += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(`Nom et prénom : ${loanData?.clients?.first_name || 'Geoffrey'} ${loanData?.clients?.last_name || 'GOBEYN'}`, leftMargin, yPosition);
  yPosition += 4;
  
  if (loanData?.clients?.address) {
    doc.text(`Adresse : ${loanData.clients.address}`, leftMargin, yPosition);
    yPosition += 4;
  }
  
  if (loanData?.clients?.postal_code || loanData?.clients?.city) {
    doc.text(`${loanData?.clients?.postal_code || ''} ${loanData?.clients?.city || ''}`, leftMargin, yPosition);
    yPosition += 4;
  }
  
  if (loanData?.clients?.phone) {
    doc.text(`Téléphone : ${loanData.clients.phone}`, leftMargin, yPosition);
    yPosition += 4;
  }
  yPosition += 8;
  
  // CONTENU DU CONTRAT
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('IL A ÉTÉ CONVENU ET ARRÊTÉ CE QUI SUIT :', leftMargin, yPosition);
  yPosition += 12;
  
  // Article 1
  doc.setFont('helvetica', 'bold');
  doc.text('Article 1 : OBJET DU CONTRAT', leftMargin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Le présent contrat a pour objet la mise à disposition gratuite d\'un véhicule de courtoisie', leftMargin, yPosition);
  yPosition += 4;
  doc.text('au profit de l\'emprunteur pendant la durée d\'immobilisation de son véhicule personnel', leftMargin, yPosition);
  yPosition += 4;
  doc.text('pour réparation ou entretien dans les locaux du prêteur.', leftMargin, yPosition);
  yPosition += 8;
  
  // Article 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Article 2 : DURÉE', leftMargin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Le véhicule est mis à disposition pour la durée strictement nécessaire à la réparation', leftMargin, yPosition);
  yPosition += 4;
  doc.text('ou à l\'entretien du véhicule de l\'emprunteur.', leftMargin, yPosition);
  yPosition += 8;
  
  // Article 3
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Article 3 : OBLIGATIONS DE L\'EMPRUNTEUR', leftMargin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('L\'emprunteur s\'engage à :', leftMargin, yPosition);
  yPosition += 5;
  doc.text('• Utiliser le véhicule en bon père de famille', leftMargin + 5, yPosition);
  yPosition += 4;
  doc.text('• Respecter le code de la route', leftMargin + 5, yPosition);
  yPosition += 4;
  doc.text('• Ne pas prêter, louer ou céder le véhicule à un tiers', leftMargin + 5, yPosition);
  yPosition += 4;
  doc.text('• Restituer le véhicule dans l\'état où il l\'a reçu', leftMargin + 5, yPosition);
  yPosition += 4;
  doc.text('• Signaler immédiatement tout accident ou vol', leftMargin + 5, yPosition);
  yPosition += 8;
  
  // Article 4
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Article 4 : ASSURANCE', leftMargin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Le véhicule est assuré par le prêteur. L\'emprunteur est couvert pour la conduite', leftMargin, yPosition);
  yPosition += 4;
  doc.text('du véhicule sous réserve du respect des conditions d\'assurance.', leftMargin, yPosition);
  yPosition += 8;
  
  // Article 5
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Article 5 : RESPONSABILITÉ', leftMargin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('L\'emprunteur est responsable des dommages causés par sa faute au véhicule', leftMargin, yPosition);
  yPosition += 4;
  doc.text('et des amendes encourues pendant la période de prêt.', leftMargin, yPosition);
  yPosition += 8;
  
  // Si on arrive en bas de page, ajouter une nouvelle page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 30;
  }
  
  // Article 6
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Article 6 : RESTITUTION', leftMargin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Le véhicule doit être restitué dès que le véhicule de l\'emprunteur est disponible.', leftMargin, yPosition);
  yPosition += 4;
  doc.text('Le prêteur se réserve le droit de récupérer le véhicule à tout moment.', leftMargin, yPosition);
  yPosition += 8;
  
  // Article 7
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Article 7 : RÉSILIATION', leftMargin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Le présent contrat peut être résilié à tout moment par le prêteur en cas de', leftMargin, yPosition);
  yPosition += 4;
  doc.text('non-respect des obligations par l\'emprunteur.', leftMargin, yPosition);
  yPosition += 10;
  
  // Lu et approuvé
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Lu et approuvé par les parties.', leftMargin, yPosition);
  yPosition += 15;
  
  // Signatures
  const signatureY = yPosition;
  doc.setFont('helvetica', 'bold');
  doc.text('Le Prêteur', leftMargin, signatureY);
  doc.text('L\'Emprunteur', leftMargin + 100, signatureY);
  yPosition += 15;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`${companyData.name || 'AUTO PAINT'}`, leftMargin, yPosition);
  doc.text(`${loanData?.clients?.first_name || 'Geoffrey'} ${loanData?.clients?.last_name || 'GOBEYN'}`, leftMargin + 100, yPosition);
  yPosition += 15;
  
  // Section signature de l'assuré
  yPosition += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Signature de l\'assuré', leftMargin, yPosition);
  yPosition += 10;
  
  doc.text(`${loanData?.clients?.first_name || 'Geoffrey'} ${loanData?.clients?.last_name || 'GOBEYN'}`, leftMargin, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'normal');
  const loanCreationDate = loanData?.created_at ? formatDate(loanData.created_at) : formatDate(new Date().toISOString());
  doc.text(`Signé le ${loanCreationDate} à ${new Date(loanData?.created_at || new Date()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`, leftMargin, yPosition);
  yPosition += 4;
  
  doc.setFontSize(7);
  doc.text(`À la latitude/longitude : ${userPosition}`, leftMargin, yPosition);
  
  // Télécharger le PDF
  const fileName = `attestation-pret-${loanData?.clients?.last_name || 'client'}-${formatDate(new Date().toISOString())}.pdf`;
  doc.save(fileName);
};