
export const validateRepairOrderData = (order: any, client: any, repairOrderVehicle: any): string | null => {
  // Appeler directement la validation des données de cession pour particuliers
  return validateCessionProcedureData(order, client, repairOrderVehicle);
};

// Validation pour cession de créance particulier (permis + carte grise)
export const validateCessionProcedureData = (order: any, client: any, repairOrderVehicle: any): string | null => {
  if (!order || !client || !repairOrderVehicle) {
    console.log('Missing data:', { order: !!order, client: !!client, repairOrderVehicle: !!repairOrderVehicle });
    return "Impossible de récupérer les données de l'ordre de réparation, du client ou du véhicule.";
  }

  const missingClientFields = [];
  const missingVehicleDocuments = [];

  // Vérifier les champs obligatoires du client (sans l'email)
  if (!client.first_name) missingClientFields.push("Prénom");
  if (!client.last_name) missingClientFields.push("Nom");
  if (!client.phone) missingClientFields.push("Téléphone");
  if (!client.address) missingClientFields.push("Adresse");
  if (!client.postal_code) missingClientFields.push("Code postal");
  if (!client.city) missingClientFields.push("Ville");

  // Vérifier les photos du permis de conduire
  if (!client.driver_license_front_url) missingClientFields.push("Photo recto du permis de conduire");
  if (!client.driver_license_back_url) missingClientFields.push("Photo verso du permis de conduire");

  // Vérifier les photos du certificat d'immatriculation
  if (!repairOrderVehicle.registration_document_front_url) missingVehicleDocuments.push("Photo recto du certificat d'immatriculation");
  if (!repairOrderVehicle.registration_document_back_url) missingVehicleDocuments.push("Photo verso du certificat d'immatriculation");

  if (missingClientFields.length > 0 || missingVehicleDocuments.length > 0) {
    let errorMessage = "Des informations obligatoires sont manquantes :\n\n";
    
    if (missingClientFields.length > 0) {
      errorMessage += "Fiche client :\n";
      missingClientFields.forEach(field => {
        errorMessage += `    - ${field}\n`;
      });
    }
    
    if (missingVehicleDocuments.length > 0) {
      if (missingClientFields.length > 0) {
        errorMessage += "\n";
      }
      errorMessage += "Fiche véhicule :\n";
      missingVehicleDocuments.forEach(document => {
        errorMessage += `    - ${document}\n`;
      });
    }

    errorMessage += "\nVeuillez compléter ces informations avant de pouvoir lancer la procédure de cession de créance.";
    
    return errorMessage;
  }

  return null;
};

// Validation pour cession de créance entreprise (CNI gérant + Kbis)
export const validateEnterpriseCessionData = (order: any, client: any, repairOrderVehicle: any): string | null => {
  if (!order || !client || !repairOrderVehicle) {
    console.log('Missing data:', { order: !!order, client: !!client, repairOrderVehicle: !!repairOrderVehicle });
    return "Impossible de récupérer les données de l'ordre de réparation, du client ou du véhicule.";
  }

  // Vérifier que c'est bien un client entreprise
  if (client.client_type !== 'entreprise') {
    return "Cette cession est réservée aux clients de type entreprise. Veuillez sélectionner un ordre de réparation associé à un client entreprise.";
  }

  const missingClientFields = [];
  const missingVehicleDocuments = [];

  // Vérifier les champs obligatoires du client entreprise
  if (!client.company_name) missingClientFields.push("Raison sociale");
  if (!client.first_name) missingClientFields.push("Prénom du gérant");
  if (!client.last_name) missingClientFields.push("Nom du gérant");
  if (!client.phone) missingClientFields.push("Téléphone");
  if (!client.address) missingClientFields.push("Adresse");
  if (!client.postal_code) missingClientFields.push("Code postal");
  if (!client.city) missingClientFields.push("Ville");

  // Vérifier les documents entreprise (CNI gérant recto/verso + Kbis)
  if (!client.manager_id_front_url) missingClientFields.push("CNI du gérant (recto)");
  if (!client.manager_id_back_url) missingClientFields.push("CNI du gérant (verso)");
  if (!client.kbis_url) missingClientFields.push("Extrait Kbis");

  // Vérifier les photos du certificat d'immatriculation (toujours nécessaire)
  if (!repairOrderVehicle.registration_document_front_url) missingVehicleDocuments.push("Photo recto du certificat d'immatriculation");
  if (!repairOrderVehicle.registration_document_back_url) missingVehicleDocuments.push("Photo verso du certificat d'immatriculation");

  if (missingClientFields.length > 0 || missingVehicleDocuments.length > 0) {
    let errorMessage = "Des informations obligatoires sont manquantes :\n\n";
    
    if (missingClientFields.length > 0) {
      errorMessage += "Fiche client entreprise :\n";
      missingClientFields.forEach(field => {
        errorMessage += `    - ${field}\n`;
      });
    }
    
    if (missingVehicleDocuments.length > 0) {
      if (missingClientFields.length > 0) {
        errorMessage += "\n";
      }
      errorMessage += "Fiche véhicule :\n";
      missingVehicleDocuments.forEach(document => {
        errorMessage += `    - ${document}\n`;
      });
    }

    errorMessage += "\nVeuillez compléter ces informations avant de pouvoir lancer la procédure de cession de créance entreprise.";
    
    return errorMessage;
  }

  return null;
};
