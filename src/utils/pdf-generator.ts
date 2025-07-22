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
  // Logo comme dans l'aperçu
  if (companyData.logo_url) {
    // Si un logo existe, on l'afficherait ici (jsPDF nécessite des images en base64)
    // Pour l'instant, on garde le fallback
  } else {
    // Logo fallback orange arrondi comme dans l'aperçu
    doc.setFillColor(249, 115, 22); // bg-orange-500
    doc.roundedRect(col1X, y1 - 3, 30, 12, 6, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('LOGO', col1X + 15, y1 + 3, { align: 'center' });
  }
  y1 += 15;

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
    doc.text('N° de contrat :', col3X, y3);
    y3 += 4;
    doc.setFont('helvetica', 'normal');
    doc.text(loanData.insurance_contract_number, col3X, y3);
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
  
  // Section signature
  yPosition += 20;
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