
// VIN validation utilities
export function isValidVin(vin: string): boolean {
  if (!vin || vin.length !== 17) {
    return false;
  }

  // Vérifier que le VIN ne contient que des caractères valides
  const validChars = /^[A-HJ-NPR-Z0-9]+$/i;
  if (!validChars.test(vin)) {
    return false;
  }

  // Le VIN ne doit pas contenir I, O, Q
  if (vin.includes('I') || vin.includes('O') || vin.includes('Q')) {
    return false;
  }

  return true;
}
