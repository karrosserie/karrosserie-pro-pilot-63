/**
 * Validation des données pour les cessions de prêt de véhicule (fleet_loan)
 */

/**
 * Valide les données nécessaires pour une cession de prêt de véhicule
 * @param fleetReservation - Les données de la réservation de véhicule
 * @param clientData - Les données du client
 * @param vehicleData - Les données du véhicule prêté
 * @returns Un message d'erreur si des données sont manquantes, null sinon
 */
export const validateFleetLoanCessionData = (
  fleetReservation: any,
  clientData: any,
  vehicleData: any
): string | null => {
  if (!fleetReservation) {
    console.log('Missing fleet reservation data');
    return "Impossible de récupérer les données de la réservation de véhicule.";
  }

  if (!clientData) {
    console.log('Missing client data');
    return "Impossible de récupérer les données du client.";
  }

  if (!vehicleData) {
    console.log('Missing vehicle data');
    return "Impossible de récupérer les données du véhicule prêté.";
  }

  const missingClientFields: string[] = [];
  const missingVehicleFields: string[] = [];
  const missingReservationFields: string[] = [];

  // Validation des champs client obligatoires
  if (!clientData.first_name) missingClientFields.push("Prénom");
  if (!clientData.last_name) missingClientFields.push("Nom");
  if (!clientData.phone) missingClientFields.push("Téléphone");
  if (!clientData.address) missingClientFields.push("Adresse");
  if (!clientData.postal_code) missingClientFields.push("Code postal");
  if (!clientData.city) missingClientFields.push("Ville");

  // Validation des champs véhicule obligatoires
  if (!vehicleData.license_plate) missingVehicleFields.push("Immatriculation");
  // Vérifier la marque (peut être dans car_brands ou directement)
  const brandName = vehicleData.car_brands?.name || vehicleData.brand;
  if (!brandName) missingVehicleFields.push("Marque du véhicule");
  // Vérifier le modèle (peut être dans car_models ou directement)
  const modelName = vehicleData.car_models?.name || vehicleData.model;
  if (!modelName) missingVehicleFields.push("Modèle du véhicule");

  // Validation des champs réservation obligatoires
  if (!fleetReservation.start_date) missingReservationFields.push("Date de début du prêt");
  if (!fleetReservation.end_date) missingReservationFields.push("Date de fin du prêt");

  // Construction du message d'erreur si des champs manquent
  const hasErrors = missingClientFields.length > 0 || 
                    missingVehicleFields.length > 0 || 
                    missingReservationFields.length > 0;

  if (hasErrors) {
    let errorMessage = "Des informations obligatoires sont manquantes :\n\n";
    
    if (missingClientFields.length > 0) {
      errorMessage += "Fiche client :\n";
      missingClientFields.forEach(field => {
        errorMessage += `    - ${field}\n`;
      });
    }
    
    if (missingVehicleFields.length > 0) {
      if (missingClientFields.length > 0) {
        errorMessage += "\n";
      }
      errorMessage += "Véhicule de prêt :\n";
      missingVehicleFields.forEach(field => {
        errorMessage += `    - ${field}\n`;
      });
    }
    
    if (missingReservationFields.length > 0) {
      if (missingClientFields.length > 0 || missingVehicleFields.length > 0) {
        errorMessage += "\n";
      }
      errorMessage += "Réservation :\n";
      missingReservationFields.forEach(field => {
        errorMessage += `    - ${field}\n`;
      });
    }

    errorMessage += "\nVeuillez compléter ces informations avant de pouvoir lancer la procédure de cession de créance.";
    
    return errorMessage;
  }

  return null;
};
