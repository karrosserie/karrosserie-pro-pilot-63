import { formatDate } from './date-formatter';

export const generateAttestationPDF = async (loanData: any, companyData: any, userPosition: string) => {
  // Import dynamique de jsPDF
  const { jsPDF } = await import('jspdf');
  
  // Créer un nouveau document PDF
  const doc = new jsPDF();
  
  // Configuration
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 20;
  const rightMargin = 20;
  const contentWidth = pageWidth - leftMargin - rightMargin;
  let yPosition = 30;
  
  // Fonction pour ajouter du texte avec retour à la ligne automatique
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    const fontSize = options.fontSize || 10;
    const maxWidth = options.maxWidth || contentWidth;
    const align = options.align || 'left';
    
    doc.setFontSize(fontSize);
    if (options.bold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    const lines = doc.splitTextToSize(text, maxWidth);
    
    if (align === 'center') {
      lines.forEach((line: string, index: number) => {
        doc.text(line, pageWidth / 2, y + (index * fontSize * 0.4), { align: 'center' });
      });
    } else {
      lines.forEach((line: string, index: number) => {
        doc.text(line, x, y + (index * fontSize * 0.4));
      });
    }
    
    return lines.length * fontSize * 0.4;
  };
  
  // Titre principal
  yPosition += addText('ATTESTATION DE PRÊT DE VÉHICULE DE COURTOISIE', 0, yPosition, {
    fontSize: 16,
    bold: true,
    align: 'center'
  });
  yPosition += 15;
  
  // Section entreprise (colonne 1)
  const col1X = leftMargin;
  const col2X = leftMargin + (contentWidth / 3);
  const col3X = leftMargin + (2 * contentWidth / 3);
  
  let y1 = yPosition;
  
  // Colonne 1 - Entreprise
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(companyData.name || '', col1X, y1);
  y1 += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.text(companyData.address || '', col1X, y1);
  y1 += 4;
  doc.text(`${companyData.zipcode || ''} ${companyData.city || ''}`, col1X, y1);
  y1 += 4;
  doc.text(`Téléphone : ${companyData.phone || ''}`, col1X, y1);
  y1 += 4;
  doc.text(`E-mail : ${companyData.email || ''}`, col1X, y1);
  y1 += 4;
  doc.text(`SIRET : ${companyData.siret || ''}`, col1X, y1);
  y1 += 4;
  doc.text(`N° TVA : ${companyData.tva || ''}`, col1X, y1);
  
  // Colonne 2 - Véhicule
  let y2 = yPosition;
  doc.setFont('helvetica', 'bold');
  doc.text('Désignation du véhicule d\'emprunt', col2X, y2);
  y2 += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Marque              ${loanData?.fleet_vehicles?.car_brands?.name || ''}`, col2X, y2);
  y2 += 4;
  doc.text(`Modèle              ${loanData?.fleet_vehicles?.car_models?.name || ''}`, col2X, y2);
  y2 += 4;
  doc.text(`Immatriculation     ${loanData?.fleet_vehicles?.license_plate || ''}`, col2X, y2);
  y2 += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Départ :', col2X, y2);
  doc.text('Retour :', col2X + 50, y2);
  y2 += 4;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Le : ${loanData?.start_date ? formatDate(loanData.start_date) : ''}`, col2X, y2);
  doc.text(`Le : ${loanData?.expected_return_date ? formatDate(loanData.expected_return_date) : ''}`, col2X + 50, y2);
  y2 += 4;
  doc.text(`Kilométrage : ${loanData?.start_mileage || ''} Km`, col2X, y2);
  doc.text('Kilométrage : - - - Km', col2X + 50, y2);
  y2 += 4;
  doc.text(`Carburant : ${loanData?.fuel_level_start || ''}%`, col2X, y2);
  doc.text('Carburant : - - - %', col2X + 50, y2);
  
  // Colonne 3 - Client
  let y3 = yPosition;
  doc.setFont('helvetica', 'bold');
  doc.text('Au client', col3X, y3);
  y3 += 8;
  
  doc.text(`${loanData?.clients?.first_name} ${loanData?.clients?.last_name}`, col3X, y3);
  y3 += 4;
  
  doc.setFont('helvetica', 'normal');
  if (loanData?.clients?.address) {
    doc.text(loanData.clients.address, col3X, y3);
    y3 += 4;
  }
  
  if (loanData?.clients?.postal_code || loanData?.clients?.city) {
    doc.text(`${loanData?.clients?.postal_code || ''} ${loanData?.clients?.city || ''}`, col3X, y3);
    y3 += 4;
  }
  
  if (loanData?.clients?.phone) {
    doc.text(`Téléphone : ${loanData.clients.phone}`, col3X, y3);
    y3 += 4;
  }
  
  if (loanData?.insurance_contract_number) {
    y3 += 4;
    doc.setFont('helvetica', 'bold');
    doc.text(`Numéro de contrat client : ${loanData.insurance_contract_number}`, col3X, y3);
  }
  
  // Nouvelle page pour le contrat détaillé
  doc.addPage();
  yPosition = 30;
  
  // Titre du contrat
  yPosition += addText('CONTRAT DE PRÊT DE VÉHICULE DE COURTOISIE', 0, yPosition, {
    fontSize: 16,
    bold: true,
    align: 'center'
  });
  yPosition += 5;
  
  yPosition += addText('(Version amendée, complétée et renforcée)', 0, yPosition, {
    fontSize: 12,
    bold: true,
    align: 'center'
  });
  yPosition += 15;
  
  // ENTRE LES SOUSSIGNÉS
  yPosition += addText('ENTRE LES SOUSSIGNÉS :', leftMargin, yPosition, {
    fontSize: 12,
    bold: true
  });
  yPosition += 10;
  
  yPosition += addText('Le Prêteur :', leftMargin, yPosition, { bold: true });
  yPosition += 5;
  yPosition += addText(`Nom du garage : ${companyData.name?.toUpperCase() || ""}`, leftMargin, yPosition);
  yPosition += 5;
  yPosition += addText(`Adresse : ${companyData.address || ""} ${companyData.zipcode || ""} ${companyData.city || ""}`, leftMargin, yPosition);
  yPosition += 5;
  yPosition += addText(`N° SIRET : ${companyData.siret || ""}`, leftMargin, yPosition);
  yPosition += 10;
  
  yPosition += addText('ET', leftMargin, yPosition, { bold: true });
  yPosition += 10;
  
  yPosition += addText('L\'Emprunteur :', leftMargin, yPosition, { bold: true });
  yPosition += 5;
  yPosition += addText(`Nom et prénom : ${loanData?.clients?.first_name} ${loanData?.clients?.last_name}`, leftMargin, yPosition);
  yPosition += 5;
  
  if (loanData?.clients?.address) {
    yPosition += addText(`Adresse : ${loanData.clients.address}`, leftMargin, yPosition);
    yPosition += 5;
  }
  
  if (loanData?.clients?.postal_code || loanData?.clients?.city) {
    yPosition += addText(`${loanData?.clients?.postal_code || ''} ${loanData?.clients?.city || ''}`, leftMargin, yPosition);
    yPosition += 5;
  }
  
  if (loanData?.clients?.phone) {
    yPosition += addText(`Téléphone : ${loanData.clients.phone}`, leftMargin, yPosition);
    yPosition += 5;
  }
  yPosition += 10;
  
  // PRÉAMBULE
  yPosition += addText('PRÉAMBULE', leftMargin, yPosition, {
    fontSize: 12,
    bold: true
  });
  yPosition += 8;
  
  const preambuleText = 'Le présent contrat est conclu à titre exceptionnel et gracieux, dans le seul but de faciliter la mobilité temporaire de l\'Emprunteur pendant l\'immobilisation de son véhicule. Cette mise à disposition n\'entraine aucune relation commerciale de location et ne saurait créer une quelconque obligation de résultat à l\'égard du Prêteur quant aux performances, au confort ou à l\'adaptation du véhicule aux besoins spécifiques de l\'Emprunteur.';
  yPosition += addText(preambuleText, leftMargin, yPosition);
  yPosition += 10;
  
  // 1. OBJET DU CONTRAT
  yPosition += addText('1. OBJET DU CONTRAT', leftMargin, yPosition, {
    fontSize: 12,
    bold: true
  });
  yPosition += 8;
  
  yPosition += addText('Le garage met gratuitement à disposition de l\'Emprunteur le véhicule suivant :', leftMargin, yPosition);
  yPosition += 8;
  
  yPosition += addText(`Marque : ${loanData?.fleet_vehicles?.car_brands?.name || ''}`, leftMargin + 10, yPosition);
  yPosition += 5;
  yPosition += addText(`Modèle : ${loanData?.fleet_vehicles?.car_models?.name || ''}`, leftMargin + 10, yPosition);
  yPosition += 5;
  yPosition += addText(`N° d'immatriculation : ${loanData?.fleet_vehicles?.license_plate || ''}`, leftMargin + 10, yPosition);
  yPosition += 5;
  yPosition += addText(`Carburant : ${loanData?.fuel_level_start || ''}%`, leftMargin + 10, yPosition);
  yPosition += 5;
  yPosition += addText(`Kilométrage : ${loanData?.start_mileage || ''} Km`, leftMargin + 10, yPosition);
  yPosition += 10;
  
  // 2. DURÉE DU PRÊT
  yPosition += addText('2. DURÉE DU PRÊT', leftMargin, yPosition, {
    fontSize: 12,
    bold: true
  });
  yPosition += 8;
  
  yPosition += addText(`Période initiale : du ${loanData?.start_date ? formatDate(loanData.start_date) : ''} au ${loanData?.expected_return_date ? formatDate(loanData.expected_return_date) : ''}`, leftMargin, yPosition);
  yPosition += 8;
  
  yPosition += addText('Restitution anticipée obligatoire.', leftMargin, yPosition, { bold: true });
  yPosition += 8;
  
  const restitutionText = 'L\'emprunteur s\'engage expressément à restituer le véhicule sans délai dès que son véhicule personnel est prêt, même si cette disponibilité intervient avant la date de fin prévue initialement.';
  yPosition += addText(restitutionText, leftMargin, yPosition);
  yPosition += 20;
  
  // Section signature
  yPosition += addText('Signature de l\'assuré', leftMargin, yPosition, {
    fontSize: 12,
    bold: true
  });
  yPosition += 10;
  
  yPosition += addText(`${loanData?.clients?.first_name} ${loanData?.clients?.last_name}`, leftMargin, yPosition, { bold: true });
  yPosition += 8;
  
  const loanCreationDate = loanData?.created_at ? formatDate(loanData.created_at) : formatDate(new Date().toISOString());
  yPosition += addText(`Signé le ${loanCreationDate} à ${new Date(loanData?.created_at || new Date()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`, leftMargin, yPosition);
  yPosition += 5;
  
  yPosition += addText(`À la latitude/longitude : ${userPosition}`, leftMargin, yPosition, { fontSize: 8 });
  
  // Télécharger le PDF
  const fileName = `attestation-pret-${loanData?.clients?.last_name || 'client'}-${formatDate(new Date().toISOString())}.pdf`;
  doc.save(fileName);
};