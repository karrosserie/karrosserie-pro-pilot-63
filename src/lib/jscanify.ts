/**
 * jscanify - Document scanner library
 * Adapted from https://github.com/nicksypark/jscanify (MIT License)
 * Converted to ES module with explicit window.cv access
 * Enhanced with adaptive detection for small documents (licenses, cards)
 * Added temporal stabilization for smooth contour display
 * OPTIMIZED: Mobile performance improvements, adaptive Canny, better cropping
 */

function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export interface ScanOptions {
  color?: string;
  thickness?: number;
  isSmallFormat?: boolean;
}

export interface CornerPoints {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}

// Detect mobile for adaptive settings
const isMobileDevice = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

/**
 * ContourStabilizer - Temporal smoothing for stable contour display
 * OPTIMIZED: Minimal history on mobile to prevent memory issues
 */
class ContourStabilizer {
  private history: CornerPoints[] = [];
  private lastDrawnPoints: CornerPoints | null = null;
  private framesWithoutDetection = 0;
  
  // Configuration - DRASTICALLY reduced for mobile performance
  private readonly HISTORY_SIZE = isMobileDevice ? 1 : 3; // Single frame on mobile
  private readonly MIN_MOVEMENT_THRESHOLD = isMobileDevice ? 15 : 8; // Less sensitive on mobile
  private readonly DISAPPEAR_THRESHOLD = isMobileDevice ? 1 : 2; // Immediate disappear on mobile
  
  addDetection(points: CornerPoints | null): void {
    if (points) {
      this.framesWithoutDetection = 0;
      this.history.push(points);
      
      if (this.history.length > this.HISTORY_SIZE) {
        this.history.shift();
      }
    } else {
      this.framesWithoutDetection++;
    }
  }
  
  getStabilizedPoints(): CornerPoints | null {
    if (this.framesWithoutDetection >= this.DISAPPEAR_THRESHOLD) {
      this.lastDrawnPoints = null;
      this.history = [];
      return null;
    }
    
    if (this.history.length === 0) {
      return this.lastDrawnPoints;
    }
    
    // On mobile, return latest detection directly (no averaging)
    if (isMobileDevice && this.history.length > 0) {
      this.lastDrawnPoints = this.history[this.history.length - 1];
      return this.lastDrawnPoints;
    }
    
    // Desktop: weighted average
    const weights = this.history.map((_, i) => i + 1);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    const averaged: CornerPoints = {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 0, y: 0 },
      bottomLeft: { x: 0, y: 0 },
      bottomRight: { x: 0, y: 0 }
    };
    
    const corners: (keyof CornerPoints)[] = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];
    
    for (const corner of corners) {
      let weightedX = 0;
      let weightedY = 0;
      
      for (let i = 0; i < this.history.length; i++) {
        weightedX += this.history[i][corner].x * weights[i];
        weightedY += this.history[i][corner].y * weights[i];
      }
      
      averaged[corner] = {
        x: Math.round(weightedX / totalWeight),
        y: Math.round(weightedY / totalWeight)
      };
    }
    
    if (this.lastDrawnPoints && !this.hasSignificantMovement(this.lastDrawnPoints, averaged)) {
      return this.lastDrawnPoints;
    }
    
    this.lastDrawnPoints = averaged;
    return averaged;
  }
  
  private hasSignificantMovement(prev: CornerPoints, curr: CornerPoints): boolean {
    const corners: (keyof CornerPoints)[] = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];
    
    for (const corner of corners) {
      const dist = distance(prev[corner], curr[corner]);
      if (dist > this.MIN_MOVEMENT_THRESHOLD) {
        return true;
      }
    }
    
    return false;
  }
  
  getConfidence(): number {
    if (this.history.length === 0) {
      return this.lastDrawnPoints ? 0.3 : 0;
    }
    
    const detectionConfidence = Math.min(this.history.length / this.HISTORY_SIZE, 1);
    const hysteresisConfidence = this.framesWithoutDetection === 0 ? 1 : 0.5;
    
    return detectionConfidence * hysteresisConfidence;
  }
  
  /**
   * Get raw (non-stabilized) points for final capture
   */
  getRawLastPoints(): CornerPoints | null {
    return this.history.length > 0 ? this.history[this.history.length - 1] : null;
  }
  
  reset(): void {
    this.history = [];
    this.lastDrawnPoints = null;
    this.framesWithoutDetection = 0;
  }
}

export class Jscanify {
  private stabilizer: ContourStabilizer = new ContourStabilizer();
  
  private getCV(): any {
    const cv = (window as any).cv;
    if (!cv) {
      throw new Error('OpenCV (cv) not found on window. Make sure OpenCV is loaded first.');
    }
    return cv;
  }

  /**
   * Calculate adaptive Canny thresholds based on image brightness
   */
  private getAdaptiveCannyThresholds(imgGray: any, cv: any, isSmallFormat: boolean): { low: number; high: number } {
    // Calculate mean brightness
    const mean = cv.mean(imgGray);
    const brightness = mean[0]; // 0-255
    
    // Base thresholds adjusted for brightness
    // Darker images need lower thresholds, brighter need higher
    let baseLow: number;
    let baseHigh: number;
    
    if (brightness < 80) {
      // Dark image - use very low thresholds
      baseLow = isSmallFormat ? 15 : 40;
      baseHigh = isSmallFormat ? 60 : 120;
    } else if (brightness < 150) {
      // Medium brightness - standard thresholds
      baseLow = isSmallFormat ? 25 : 60;
      baseHigh = isSmallFormat ? 80 : 160;
    } else {
      // Bright image - higher thresholds
      baseLow = isSmallFormat ? 35 : 75;
      baseHigh = isSmallFormat ? 100 : 200;
    }
    
    return { low: baseLow, high: baseHigh };
  }

  /**
   * Finds the contour of the paper in the image
   * OPTIMIZED: Skip dilation on mobile, adaptive thresholds, lower min area
   */
  findPaperContour(img: any, isSmallFormat: boolean = false): any {
    const cv = this.getCV();
    
    let imgGray: any = null;
    let imgBlur: any = null;
    let kernel: any = null;
    let imgProcessed: any = null;
    let imgThresh: any = null;
    let contours: any = null;
    let hierarchy: any = null;
    
    try {
      imgGray = new cv.Mat();
      cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY);
      
      imgBlur = new cv.Mat();
      cv.GaussianBlur(imgGray, imgBlur, new cv.Size(5, 5), 0);
      
      // OPTIMIZATION: Skip morphological dilation on mobile (CPU expensive)
      if (isMobileDevice) {
        imgProcessed = imgBlur;
      } else {
        kernel = cv.Mat.ones(3, 3, cv.CV_8U);
        imgProcessed = new cv.Mat();
        cv.dilate(imgBlur, imgProcessed, kernel);
      }
      
      imgThresh = new cv.Mat();
      
      // OPTIMIZATION: Use adaptive Canny thresholds based on image brightness
      const { low, high } = this.getAdaptiveCannyThresholds(imgGray, cv, isSmallFormat);
      cv.Canny(imgProcessed, imgThresh, low, high);
      
      contours = new cv.MatVector();
      hierarchy = new cv.Mat();
      cv.findContours(imgThresh, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
      
      const imgArea = img.rows * img.cols;
      // OPTIMIZATION: Lower minimum area ratio for better small document detection
      const minAreaRatio = isSmallFormat ? 0.02 : 0.05;
      
      let maxArea = 0;
      let maxContourIndex = -1;
      
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);
        
        if (area < imgArea * minAreaRatio) continue;
        
        if (area > maxArea) {
          maxArea = area;
          maxContourIndex = i;
        }
      }
      
      let paperContour = null;
      if (maxContourIndex !== -1) {
        const contour = contours.get(maxContourIndex);
        const peri = cv.arcLength(contour, true);
        const approx = new cv.Mat();
        
        // OPTIMIZATION: More relaxed approximation for better corner detection
        const approxFactor = isSmallFormat ? 0.05 : 0.03;
        cv.approxPolyDP(contour, approx, approxFactor * peri, true);
        
        // Accept 3-6 points for more flexible detection
        const acceptablePointCount = approx.rows >= 3 && approx.rows <= 6;
        
        if (acceptablePointCount) {
          if (approx.rows !== 4) {
            const reducedContour = this.reduceToFourCorners(approx, cv);
            if (reducedContour) {
              approx.delete();
              paperContour = reducedContour;
            } else {
              paperContour = approx;
            }
          } else {
            paperContour = approx;
          }
        } else {
          approx.delete();
        }
      }
      
      return paperContour;
    } finally {
      if (imgGray) imgGray.delete();
      if (imgBlur && imgBlur !== imgProcessed) imgBlur.delete();
      if (kernel) kernel.delete();
      if (imgProcessed && imgProcessed !== imgBlur) imgProcessed.delete();
      if (imgThresh) imgThresh.delete();
      if (hierarchy) hierarchy.delete();
      if (contours) contours.delete();
    }
  }

  /**
   * Reduce a polygon to 4 corners using convex hull approach
   * IMPROVED: Better corner selection using bounding box extremes
   */
  private reduceToFourCorners(approx: any, cv: any): any {
    try {
      const points: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < approx.rows; i++) {
        points.push({
          x: approx.data32S[i * 2],
          y: approx.data32S[i * 2 + 1]
        });
      }
      
      if (points.length < 3) return null;
      
      // Find centroid
      const centroidX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
      const centroidY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
      
      // Classify points into quadrants relative to centroid
      const topLeft: Array<{ x: number; y: number; score: number }> = [];
      const topRight: Array<{ x: number; y: number; score: number }> = [];
      const bottomLeft: Array<{ x: number; y: number; score: number }> = [];
      const bottomRight: Array<{ x: number; y: number; score: number }> = [];
      
      for (const p of points) {
        const isLeft = p.x < centroidX;
        const isTop = p.y < centroidY;
        // Score = distance from centroid (further is better for corners)
        const score = Math.hypot(p.x - centroidX, p.y - centroidY);
        
        if (isTop && isLeft) topLeft.push({ ...p, score });
        else if (isTop && !isLeft) topRight.push({ ...p, score });
        else if (!isTop && isLeft) bottomLeft.push({ ...p, score });
        else bottomRight.push({ ...p, score });
      }
      
      // Select best point from each quadrant (furthest from centroid)
      const selectBest = (arr: Array<{ x: number; y: number; score: number }>, fallbackX: number, fallbackY: number) => {
        if (arr.length === 0) return { x: fallbackX, y: fallbackY };
        arr.sort((a, b) => b.score - a.score);
        return { x: arr[0].x, y: arr[0].y };
      };
      
      const minX = Math.min(...points.map(p => p.x));
      const maxX = Math.max(...points.map(p => p.x));
      const minY = Math.min(...points.map(p => p.y));
      const maxY = Math.max(...points.map(p => p.y));
      
      const tl = selectBest(topLeft, minX, minY);
      const tr = selectBest(topRight, maxX, minY);
      const bl = selectBest(bottomLeft, minX, maxY);
      const br = selectBest(bottomRight, maxX, maxY);
      
      const newContour = cv.matFromArray(4, 1, cv.CV_32SC2, [
        tl.x, tl.y,
        tr.x, tr.y,
        br.x, br.y,
        bl.x, bl.y
      ]);
      
      return newContour;
    } catch (err) {
      return null;
    }
  }

  /**
   * Get corner points from a contour
   */
  getCornerPoints(contour: any): CornerPoints | null {
    if (!contour || contour.rows !== 4) {
      return null;
    }
    
    const points: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < 4; i++) {
      points.push({
        x: contour.data32S[i * 2],
        y: contour.data32S[i * 2 + 1]
      });
    }
    
    points.sort((a, b) => a.y - b.y);
    
    const topPoints = points.slice(0, 2).sort((a, b) => a.x - b.x);
    const bottomPoints = points.slice(2, 4).sort((a, b) => a.x - b.x);
    
    return {
      topLeft: topPoints[0],
      topRight: topPoints[1],
      bottomLeft: bottomPoints[0],
      bottomRight: bottomPoints[1]
    };
  }

  /**
   * Detect paper and return stabilized corner points WITHOUT drawing
   * Used for overlay canvas architecture
   */
  detectPaper(image: HTMLCanvasElement | HTMLImageElement, isSmallFormat: boolean = false): CornerPoints | null {
    let cv: any;
    try {
      cv = this.getCV();
    } catch (err) {
      return null;
    }

    let canvas: HTMLCanvasElement;
    if (image instanceof HTMLCanvasElement) {
      canvas = image;
    } else {
      canvas = document.createElement('canvas');
      canvas.width = image.width || image.naturalWidth;
      canvas.height = image.height || image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(image, 0, 0);
      }
    }

    let img: any = null;
    let contour: any = null;

    try {
      img = cv.imread(canvas);

      if (!img || img.empty || img.empty()) {
        return null;
      }

      contour = this.findPaperContour(img, isSmallFormat);

      const rawPoints = contour ? this.getCornerPoints(contour) : null;

      this.stabilizer.addDetection(rawPoints);
      return this.stabilizer.getStabilizedPoints();

    } catch (error) {
      return null;
    } finally {
      try {
        if (img && typeof img.delete === 'function' && !img.isDeleted?.()) {
          img.delete();
        }
      } catch (e) {}
      try {
        if (contour && typeof contour.delete === 'function' && !contour.isDeleted?.()) {
          contour.delete();
        }
      } catch (e) {}
    }
  }

  /**
   * Highlights the paper on the image/canvas with temporal stabilization
   * OPTIMIZED: Lighter processing on mobile
   */
  highlightPaper(image: HTMLCanvasElement | HTMLImageElement, options?: ScanOptions): HTMLCanvasElement | null {
    let cv: any;
    try {
      cv = this.getCV();
    } catch (err) {
      return null;
    }
    
    const { color = 'lime', thickness = 8, isSmallFormat = false } = options || {};
    
    let canvas: HTMLCanvasElement;
    if (image instanceof HTMLCanvasElement) {
      canvas = image;
    } else {
      canvas = document.createElement('canvas');
      canvas.width = image.width || image.naturalWidth;
      canvas.height = image.height || image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(image, 0, 0);
      }
    }
    
    let img: any = null;
    let contour: any = null;
    
    try {
      img = cv.imread(canvas);
      
      if (!img || img.empty || img.empty()) {
        return null;
      }
      
      contour = this.findPaperContour(img, isSmallFormat);
      
      const rawPoints = contour ? this.getCornerPoints(contour) : null;
      
      this.stabilizer.addDetection(rawPoints);
      const stabilizedPoints = this.stabilizer.getStabilizedPoints();
      const confidence = this.stabilizer.getConfidence();
      
      if (stabilizedPoints) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = color;
          ctx.lineWidth = thickness;
          ctx.globalAlpha = 0.6 + (confidence * 0.4);
          
          ctx.beginPath();
          ctx.moveTo(stabilizedPoints.topLeft.x, stabilizedPoints.topLeft.y);
          ctx.lineTo(stabilizedPoints.topRight.x, stabilizedPoints.topRight.y);
          ctx.lineTo(stabilizedPoints.bottomRight.x, stabilizedPoints.bottomRight.y);
          ctx.lineTo(stabilizedPoints.bottomLeft.x, stabilizedPoints.bottomLeft.y);
          ctx.closePath();
          ctx.stroke();
          
          ctx.globalAlpha = 1.0;
        }
      }
      
      return canvas;
    } catch (error) {
      return null;
    } finally {
      try {
        if (img && typeof img.delete === 'function' && !img.isDeleted?.()) {
          img.delete();
        }
      } catch (e) {}
      try {
        if (contour && typeof contour.delete === 'function' && !contour.isDeleted?.()) {
          contour.delete();
        }
      } catch (e) {}
    }
  }

  resetStabilizer(): void {
    this.stabilizer.reset();
  }

  /**
   * Extracts and transforms the paper from the image
   * IMPROVED: Safety margin to prevent edge clipping
   */
  extractPaper(
    image: HTMLCanvasElement | HTMLImageElement, 
    resultWidth: number, 
    resultHeight: number, 
    cornerPoints?: any,
    isSmallFormat: boolean = false
  ): HTMLCanvasElement | null {
    const cv = this.getCV();
    
    let canvas: HTMLCanvasElement;
    if (image instanceof HTMLCanvasElement) {
      canvas = image;
    } else {
      canvas = document.createElement('canvas');
      canvas.width = image.width || image.naturalWidth;
      canvas.height = image.height || image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(image, 0, 0);
      }
    }
    
    let img: any = null;
    let contour: any = null;
    let srcTri: any = null;
    let dstTri: any = null;
    let M: any = null;
    let result: any = null;
    let localContour = false;
    
    try {
      img = cv.imread(canvas);
      
      if (cornerPoints) {
        contour = cornerPoints;
      } else {
        contour = this.findPaperContour(img, isSmallFormat);
        localContour = true;
      }
      
      if (!contour) {
        return null;
      }
      
      const points = this.getCornerPoints(contour);
      if (!points) {
        return null;
      }
      
      // IMPROVEMENT: Add safety margin (2%) to prevent edge clipping
      const margin = 0.02;
      const expandPoint = (p: { x: number; y: number }, centerX: number, centerY: number) => {
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        return {
          x: p.x + dx * margin,
          y: p.y + dy * margin
        };
      };
      
      const centerX = (points.topLeft.x + points.topRight.x + points.bottomLeft.x + points.bottomRight.x) / 4;
      const centerY = (points.topLeft.y + points.topRight.y + points.bottomLeft.y + points.bottomRight.y) / 4;
      
      const tl = expandPoint(points.topLeft, centerX, centerY);
      const tr = expandPoint(points.topRight, centerX, centerY);
      const br = expandPoint(points.bottomRight, centerX, centerY);
      const bl = expandPoint(points.bottomLeft, centerX, centerY);
      
      srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        tl.x, tl.y,
        tr.x, tr.y,
        br.x, br.y,
        bl.x, bl.y
      ]);
      
      dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        resultWidth, 0,
        resultWidth, resultHeight,
        0, resultHeight
      ]);
      
      M = cv.getPerspectiveTransform(srcTri, dstTri);
      
      result = new cv.Mat();
      const dsize = new cv.Size(resultWidth, resultHeight);
      cv.warpPerspective(img, result, M, dsize);
      
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = resultWidth;
      outputCanvas.height = resultHeight;
      cv.imshow(outputCanvas, result);
      
      return outputCanvas;
    } catch (error) {
      return null;
    } finally {
      if (img) img.delete();
      if (srcTri) srcTri.delete();
      if (dstTri) dstTri.delete();
      if (M) M.delete();
      if (result) result.delete();
      if (localContour && contour) contour.delete();
    }
  }
}

export default Jscanify;
