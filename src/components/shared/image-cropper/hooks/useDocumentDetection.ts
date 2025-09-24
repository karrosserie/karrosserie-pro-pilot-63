import { useState, useCallback } from 'react';

export interface DocumentCorners {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}

export interface DocumentDetectionResult {
  corners: DocumentCorners;
  confidence: number;
  rotation: number;
  success: boolean;
}

export interface UseDocumentDetectionResult {
  isDetecting: boolean;
  detectDocument: (imageElement: HTMLImageElement, documentType: string) => Promise<DocumentDetectionResult>;
  applyPerspectiveCorrection: (
    imageElement: HTMLImageElement,
    corners: DocumentCorners
  ) => Promise<Blob>;
}

export function useDocumentDetection(): UseDocumentDetectionResult {
  const [isDetecting, setIsDetecting] = useState(false);

  const detectEdges = useCallback((imageData: ImageData): ImageData => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const edgeData = new Uint8ClampedArray(data.length);

    // Convertir en niveaux de gris et appliquer un filtre Sobel
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        // Obtenir les valeurs des pixels voisins (en niveaux de gris)
        const getGray = (dx: number, dy: number) => {
          const neighborIdx = ((y + dy) * width + (x + dx)) * 4;
          return (data[neighborIdx] + data[neighborIdx + 1] + data[neighborIdx + 2]) / 3;
        };

        // Filtre Sobel X et Y
        const sobelX =
          -1 * getGray(-1, -1) + 1 * getGray(1, -1) +
          -2 * getGray(-1, 0) + 2 * getGray(1, 0) +
          -1 * getGray(-1, 1) + 1 * getGray(1, 1);

        const sobelY =
          -1 * getGray(-1, -1) + -2 * getGray(0, -1) + -1 * getGray(1, -1) +
          1 * getGray(-1, 1) + 2 * getGray(0, 1) + 1 * getGray(1, 1);

        const magnitude = Math.sqrt(sobelX * sobelX + sobelY * sobelY);
        const normalizedMagnitude = Math.min(255, magnitude);

        edgeData[idx] = normalizedMagnitude;
        edgeData[idx + 1] = normalizedMagnitude;
        edgeData[idx + 2] = normalizedMagnitude;
        edgeData[idx + 3] = 255; // Alpha
      }
    }

    return new ImageData(edgeData, width, height);
  }, []);

  const findContours = useCallback((edgeData: ImageData): number[][] => {
    const data = edgeData.data;
    const width = edgeData.width;
    const height = edgeData.height;
    const threshold = 100;

    const points: Array<{x: number, y: number}> = [];

    // Trouver les pixels de contour significatifs
    for (let y = 0; y < height; y += 2) { // Échantillonnage pour la performance
      for (let x = 0; x < width; x += 2) {
        const idx = (y * width + x) * 4;
        if (data[idx] > threshold) {
          points.push({ x, y });
        }
      }
    }

    // Grouper les points en lignes potentielles
    const lines: number[][] = [];
    const usedPoints = new Set<number>();

    for (let i = 0; i < points.length; i++) {
      if (usedPoints.has(i)) continue;

      const point1 = points[i];
      const line = [point1.x, point1.y];
      usedPoints.add(i);

      // Trouver les points alignés avec ce point
      for (let j = i + 1; j < points.length; j++) {
        if (usedPoints.has(j)) continue;

        const point2 = points[j];
        const distance = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));

        if (distance > 50 && distance < 300) { // Filtrer les distances appropriées
          line.push(point2.x, point2.y);
          usedPoints.add(j);
          break;
        }
      }

      if (line.length >= 4) { // Au moins 2 points
        lines.push(line);
      }
    }

    return lines.slice(0, 10); // Limiter le nombre de lignes
  }, []);

  const findDocumentCorners = useCallback((
    lines: number[][],
    width: number,
    height: number
  ): DocumentCorners => {
    // Si pas assez de lignes détectées, utiliser des coins par défaut
    if (lines.length < 4) {
      const margin = Math.min(width, height) * 0.1;
      return {
        topLeft: { x: margin, y: margin },
        topRight: { x: width - margin, y: margin },
        bottomLeft: { x: margin, y: height - margin },
        bottomRight: { x: width - margin, y: height - margin }
      };
    }

    // Tenter de trouver les intersections des lignes pour former un quadrilatère
    const intersections: Array<{x: number, y: number}> = [];

    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        const line1 = lines[i];
        const line2 = lines[j];

        if (line1.length >= 4 && line2.length >= 4) {
          // Calculer l'intersection de deux lignes
          const x1 = line1[0], y1 = line1[1], x2 = line1[2], y2 = line1[3];
          const x3 = line2[0], y3 = line2[1], x4 = line2[2], y4 = line2[3];

          const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

          if (Math.abs(denom) > 1e-10) {
            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
            const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

            if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
              const intersectionX = x1 + t * (x2 - x1);
              const intersectionY = y1 + t * (y2 - y1);

              // Vérifier que l'intersection est dans les limites de l'image
              if (intersectionX >= 0 && intersectionX <= width &&
                  intersectionY >= 0 && intersectionY <= height) {
                intersections.push({ x: intersectionX, y: intersectionY });
              }
            }
          }
        }
      }
    }

    // Si on a trouvé des intersections, les utiliser pour définir les coins
    if (intersections.length >= 4) {
      // Trier les intersections pour identifier les coins
      intersections.sort((a, b) => a.x + a.y - (b.x + b.y));

      const topLeft = intersections[0];
      const bottomRight = intersections[intersections.length - 1];

      // Trouver le coin en haut à droite et en bas à gauche
      const remaining = intersections.slice(1, -1);
      remaining.sort((a, b) => (a.x - a.y) - (b.x - b.y));

      const topRight = remaining[remaining.length - 1] || { x: width * 0.9, y: height * 0.1 };
      const bottomLeft = remaining[0] || { x: width * 0.1, y: height * 0.9 };

      return {
        topLeft,
        topRight,
        bottomLeft,
        bottomRight
      };
    }

    // Fallback : coins par défaut avec une marge
    const margin = Math.min(width, height) * 0.05;
    return {
      topLeft: { x: margin, y: margin },
      topRight: { x: width - margin, y: margin },
      bottomLeft: { x: margin, y: height - margin },
      bottomRight: { x: width - margin, y: height - margin }
    };
  }, []);

  const calculateRotation = useCallback((corners: DocumentCorners): number => {
    // Calculer l'angle de rotation basé sur le bord supérieur du document
    const topEdge = {
      x: corners.topRight.x - corners.topLeft.x,
      y: corners.topRight.y - corners.topLeft.y
    };

    const angle = Math.atan2(topEdge.y, topEdge.x) * (180 / Math.PI);
    return angle;
  }, []);

  const detectDocument = useCallback(async (
    imageElement: HTMLImageElement,
    documentType: string
  ): Promise<DocumentDetectionResult> => {
    setIsDetecting(true);

    try {
      // Créer un canvas pour traiter l'image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Impossible de créer le contexte canvas');
      }

      canvas.width = imageElement.width;
      canvas.height = imageElement.height;

      // Dessiner l'image sur le canvas
      ctx.drawImage(imageElement, 0, 0);

      // Obtenir les données de l'image
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Détecter les contours
      const edgeData = detectEdges(imageData);

      // Trouver les contours
      const contours = findContours(edgeData);

      // Trouver les coins du document
      const corners = findDocumentCorners(contours, canvas.width, canvas.height);

      // Calculer la rotation
      const rotation = calculateRotation(corners);

      // Calculer la confiance basée sur le nombre de contours détectés
      const confidence = Math.min(1.0, contours.length / 8);

      return {
        corners,
        confidence,
        rotation,
        success: true
      };

    } catch (error) {
      console.error('Erreur lors de la détection du document:', error);

      // Retourner des coins par défaut en cas d'erreur
      const margin = Math.min(imageElement.width, imageElement.height) * 0.1;
      return {
        corners: {
          topLeft: { x: margin, y: margin },
          topRight: { x: imageElement.width - margin, y: margin },
          bottomLeft: { x: margin, y: imageElement.height - margin },
          bottomRight: { x: imageElement.width - margin, y: imageElement.height - margin }
        },
        confidence: 0.5,
        rotation: 0,
        success: false
      };
    } finally {
      setIsDetecting(false);
    }
  }, [detectEdges, findContours, findDocumentCorners, calculateRotation]);

  const applyPerspectiveCorrection = useCallback(async (
    imageElement: HTMLImageElement,
    corners: DocumentCorners
  ): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Impossible de créer le contexte canvas');
    }

    // Calculer les dimensions de sortie basées sur les coins
    const width = Math.max(
      Math.sqrt(Math.pow(corners.topRight.x - corners.topLeft.x, 2) +
               Math.pow(corners.topRight.y - corners.topLeft.y, 2)),
      Math.sqrt(Math.pow(corners.bottomRight.x - corners.bottomLeft.x, 2) +
               Math.pow(corners.bottomRight.y - corners.bottomLeft.y, 2))
    );

    const height = Math.max(
      Math.sqrt(Math.pow(corners.bottomLeft.x - corners.topLeft.x, 2) +
               Math.pow(corners.bottomLeft.y - corners.topLeft.y, 2)),
      Math.sqrt(Math.pow(corners.bottomRight.x - corners.topRight.x, 2) +
               Math.pow(corners.bottomRight.y - corners.topRight.y, 2))
    );

    canvas.width = width;
    canvas.height = height;

    // Pour une correction de perspective simple, on utilise le drawImage avec les coins
    // Note: Pour une vraie correction de perspective, il faudrait utiliser une transformation matricielle

    // Pour l'instant, on fait une approximation en recadrant simplement la zone
    const minX = Math.min(corners.topLeft.x, corners.bottomLeft.x);
    const minY = Math.min(corners.topLeft.y, corners.topRight.y);
    const maxX = Math.max(corners.topRight.x, corners.bottomRight.x);
    const maxY = Math.max(corners.bottomLeft.y, corners.bottomRight.y);

    const sourceWidth = maxX - minX;
    const sourceHeight = maxY - minY;

    ctx.drawImage(
      imageElement,
      minX, minY, sourceWidth, sourceHeight,
      0, 0, width, height
    );

    // Améliorer le contraste pour les documents
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Augmenter le contraste
      const contrast = 1.2;
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128));
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128));
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128));
    }

    ctx.putImageData(imageData, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.95);
    });
  }, []);

  return {
    isDetecting,
    detectDocument,
    applyPerspectiveCorrection
  };
}