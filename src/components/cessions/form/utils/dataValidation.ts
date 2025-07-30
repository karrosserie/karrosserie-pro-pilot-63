
export const validateRepairOrderData = (order: any, client: any, repairOrderVehicle: any): string | null => {
  // Aucune vérification lors de la sélection de l'ordre de réparation ou de la validation du formulaire
  // Toutes les vérifications sont maintenant effectuées uniquement lors de la procédure de cession
  return null;
};

// Nouvelle fonction pour valider uniquement lors de la procédure de cession
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
