/**
 * Service de géolocalisation pour vérifier la position des employés lors du pointage
 */

export interface Position {
  latitude: number;
  longitude: number;
}

export interface LocationVerificationResult {
  success: boolean;
  message: string;
  distance?: number;
  userPosition?: Position;
}

/**
 * Calcule la distance entre deux points GPS en mètres (formule de Haversine)
 */
function calculateDistance(pos1: Position, pos2: Position): number {
  const R = 6371000; // Rayon de la Terre en mètres
  const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180;
  const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance en mètres
}

/**
 * Récupère la position actuelle de l'utilisateur
 */
function getCurrentPosition(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Géolocalisation non supportée'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let message = 'Erreur de géolocalisation';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permission de géolocalisation refusée';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Position non disponible';
            break;
          case error.TIMEOUT:
            message = 'Timeout de géolocalisation';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * Vérifie si l'employé est dans le rayon autorisé autour de l'entreprise
 */
export async function verifyEmployeeLocation(
  companyPosition: Position,
  allowedRadius: number = 1000
): Promise<LocationVerificationResult> {
  try {
    console.log('🏢 Position de l\'entreprise:', companyPosition);
    console.log('📏 Rayon autorisé:', allowedRadius, 'mètres');
    
    const userPosition = await getCurrentPosition();
    console.log('📍 Position de l\'employé:', userPosition);
    
    const distance = calculateDistance(companyPosition, userPosition);
    console.log('📐 Distance calculée:', Math.round(distance), 'mètres');
    
    if (distance <= allowedRadius) {
      console.log('✅ Géolocalisation validée - Employé dans le périmètre autorisé');
      return {
        success: true,
        message: 'Position vérifiée avec succès',
        distance: Math.round(distance),
        userPosition
      };
    } else {
      console.log('❌ Géolocalisation refusée - Employé hors périmètre');
      return {
        success: false,
        message: `Vous êtes trop loin de l'entreprise (${Math.round(distance)}m). Distance maximum autorisée: ${allowedRadius}m`,
        distance: Math.round(distance),
        userPosition
      };
    }
  } catch (error) {
    console.error('🚫 Erreur lors de la vérification de la position:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur de géolocalisation'
    };
  }
}