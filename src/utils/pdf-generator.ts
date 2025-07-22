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
  const contentWidth = pageWidth - leftMargin - rightMargin;
  let yPosition = 25;
  
  // Titre principal centré
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ATTESTATION DE PRÊT DE VÉHICULE DE COURTOISIE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;
  
  // Configuration exacte des colonnes pour reproduire l'aperçu
  const col1X = leftMargin; // Colonne entreprise
  const col1Width = 70;
  const col2X = col1X + col1Width + 8; // Colonne véhicule 
  const col2Width = 90;
  const col3X = col2X + col2Width + 8; // Colonne client
  const col3Width = contentWidth - col1Width - col2Width - 16;

  let y1 = yPosition; // Position Y pour colonne 1
  let y2 = yPosition; // Position Y pour colonne 2  
  let y3 = yPosition; // Position Y pour colonne 3

  // === COLONNE 1 - ENTREPRISE ===
  // Logo AUTO PAINT exactement comme dans l'aperçu
  doc.setFillColor(255, 165, 0); // Orange
  doc.roundedRect(col1X, y1 - 2, 35, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('AUTO PAINT', col1X + 17.5, y1 + 5, { align: 'center' });
  y1 += 18;

  // Informations entreprise
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(companyData.name || 'AUTO PAINT', col1X, y1);
  y1 += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(companyData.address || '25 rue sainte victoire', col1X, y1);
  y1 += 5;
  doc.text(`${companyData.zipcode || '13006'} ${companyData.city || 'MARSEILLE'}`, col1X, y1);
  y1 += 5;
  doc.text(`Téléphone : ${companyData.phone || '+330646465242'}`, col1X, y1);
  y1 += 5;
  doc.text(`E-mail : ${companyData.email || 'autopaint@yopmail.com'}`, col1X, y1);
  y1 += 5;
  doc.text(`SIRET : ${companyData.siret || '12345678900010'}`, col1X, y1);
  y1 += 5;
  doc.text(`N° TVA : ${companyData.tva || 'FR123456789'}`, col1X, y1);

  // === COLONNE 2 - VÉHICULE ===
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Désignation du véhicule d\'emprunt', col2X, y2);
  y2 += 10;

  // Informations véhicule avec alignement à droite
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Marque
  doc.text('Marque', col2X, y2);
  doc.text(loanData?.fleet_vehicles?.car_brands?.name || 'Peugeot', col2X + col2Width - 30, y2);
  y2 += 5;

  // Modèle  
  doc.text('Modèle', col2X, y2);
  doc.text(loanData?.fleet_vehicles?.car_models?.name || '2008', col2X + col2Width - 30, y2);
  y2 += 5;

  // Immatriculation avec marge supplémentaire
  doc.text('Immatriculation', col2X, y2);
  doc.text(loanData?.fleet_vehicles?.license_plate || 'DR-974-RD', col2X + col2Width - 30, y2);
  y2 += 10; // Marge plus importante

  // Section Départ/Retour côte à côte avec meilleur espacement
  const departX = col2X;
  const retourX = col2X + 45;

  // Titres Départ/Retour
  doc.setFont('helvetica', 'bold');
  doc.text('Départ :', departX, y2);
  doc.text('Retour :', retourX, y2);
  y2 += 6;

  // Dates
  doc.setFont('helvetica', 'normal');
  doc.text(`Le : ${loanData?.start_date ? formatDate(loanData.start_date) : '22/07/2025'}`, departX, y2);
  doc.text(`Le : ${loanData?.expected_return_date ? formatDate(loanData.expected_return_date) : '24/07/2025'}`, retourX, y2);
  y2 += 5;

  // Kilométrages
  doc.text(`Kilométrage : ${loanData?.start_mileage || '23679'} Km`, departX, y2);
  doc.text('Kilométrage : - - - Km', retourX, y2);
  y2 += 5;

  // Carburant
  doc.text(`Carburant : ${loanData?.fuel_level_start || '67'}%`, departX, y2);
  doc.text('Carburant : - - - %', retourX, y2);

  // === COLONNE 3 - CLIENT ===
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Au client', col3X, y3);
  y3 += 10;

  doc.setFontSize(10);
  doc.text(`${loanData?.clients?.first_name || 'Geoffrey'} ${loanData?.clients?.last_name || 'GOBEYN'}`, col3X, y3);
  y3 += 6;

  doc.setFont('helvetica', 'normal');
  if (loanData?.clients?.address) {
    doc.text(loanData.clients.address, col3X, y3);
    y3 += 5;
  } else {
    doc.text('83 boulevard du Redon - 17ème étage', col3X, y3);
    y3 += 5;
  }

  if (loanData?.clients?.postal_code || loanData?.clients?.city) {
    doc.text(`${loanData?.clients?.postal_code || '13009'} ${loanData?.clients?.city || 'MARSEILLE'}`, col3X, y3);
    y3 += 5;
  }

  if (loanData?.clients?.phone) {
    doc.text(`Téléphone : ${loanData.clients.phone}`, col3X, y3);
    y3 += 5;
  } else {
    doc.text('Téléphone : +330646465242', col3X, y3);
    y3 += 5;
  }

  // Numéro de contrat client avec marge et style
  y3 += 6; // Marge supplémentaire
  doc.setFont('helvetica', 'bold');
  doc.text('Numéro de contrat client :', col3X, y3);
  y3 += 5;
  doc.text(loanData?.insurance_contract_number || 'A456373', col3X, y3);
  
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