/**
 * jscanify - Document scanner library
 * Adapted from https://github.com/nicksypark/jscanify (MIT License)
 * Converted to ES module with explicit window.cv access
 * Enhanced with adaptive detection for small documents (licenses, cards)
 * Added temporal stabilization for smooth contour display
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

/**
 * ContourStabilizer - Temporal smoothing for stable contour display
 * Uses weighted averaging over multiple frames with hysteresis
 */
class ContourStabilizer {
  private history: CornerPoints[] = [];
  private lastDrawnPoints: CornerPoints | null = null;
  private framesWithoutDetection = 0;
  
  // Configuration
  private readonly HISTORY_SIZE = 5;
  private readonly MIN_MOVEMENT_THRESHOLD = 8; // pixels
  private readonly DISAPPEAR_THRESHOLD = 3; // frames before contour disappears
  
  /**
   * Add a new detection to the history
   */
  addDetection(points: CornerPoints | null): void {
    if (points) {
      this.framesWithoutDetection = 0;
      this.history.push(points);
      
      // Keep only the last HISTORY_SIZE frames
      if (this.history.length > this.HISTORY_SIZE) {
        this.history.shift();
      }
    } else {
      this.framesWithoutDetection++;
    }
  }
  
  /**
   * Get stabilized corner points with weighted average
   * Returns null if no stable detection or if detection disappeared
   */
  getStabilizedPoints(): CornerPoints | null {
    // If too many frames without detection, clear and return null
    if (this.framesWithoutDetection >= this.DISAPPEAR_THRESHOLD) {
      this.lastDrawnPoints = null;
      this.history = [];
      return null;
    }
    
    // If no history but within hysteresis window, return last drawn points
    if (this.history.length === 0) {
      return this.lastDrawnPoints;
    }
    
    // Calculate weighted average (recent frames have more weight)
    const weights = this.history.map((_, i) => i + 1); // 1, 2, 3, 4, 5
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
    
    // Check if movement exceeds threshold (only redraw if significant change)
    if (this.lastDrawnPoints && !this.hasSignificantMovement(this.lastDrawnPoints, averaged)) {
      return this.lastDrawnPoints;
    }
    
    this.lastDrawnPoints = averaged;
    return averaged;
  }
  
  /**
   * Check if the movement between two sets of corners exceeds the threshold
   */
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
  
  /**
   * Get confidence level based on detection stability (0-1)
   */
  getConfidence(): number {
    if (this.history.length === 0) {
      return this.lastDrawnPoints ? 0.3 : 0;
    }
    
    // Higher confidence with more consecutive detections
    const detectionConfidence = Math.min(this.history.length / this.HISTORY_SIZE, 1);
    
    // Lower confidence if we're in hysteresis (no recent detection)
    const hysteresisConfidence = this.framesWithoutDetection === 0 ? 1 : 0.5;
    
    return detectionConfidence * hysteresisConfidence;
  }
  
  /**
   * Reset the stabilizer state
   */
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
   * Finds the contour of the paper in the image
   * @param img OpenCV Mat image
   * @param isSmallFormat Use relaxed detection for small documents (licenses, cards)
   */
  findPaperContour(img: any, isSmallFormat: boolean = false): any {
    const cv = this.getCV();
    
    // Matrices to clean up
    let imgGray: any = null;
    let imgBlur: any = null;
    let kernel: any = null;
    let imgDilated: any = null;
    let imgThresh: any = null;
    let contours: any = null;
    let hierarchy: any = null;
    
    try {
      imgGray = new cv.Mat();
      cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY);
      
      imgBlur = new cv.Mat();
      cv.GaussianBlur(imgGray, imgBlur, new cv.Size(5, 5), 0);
      
      // Morphological dilation to reinforce contours (especially for small documents)
      kernel = cv.Mat.ones(3, 3, cv.CV_8U);
      imgDilated = new cv.Mat();
      cv.dilate(imgBlur, imgDilated, kernel);
      
      imgThresh = new cv.Mat();
      // Adaptive Canny thresholds - lower for small documents with less contrast
      const lowThreshold = isSmallFormat ? 30 : 75;
      const highThreshold = isSmallFormat ? 100 : 200;
      cv.Canny(imgDilated, imgThresh, lowThreshold, highThreshold);
      
      contours = new cv.MatVector();
      hierarchy = new cv.Mat();
      cv.findContours(imgThresh, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
      
      // Minimum area filtering
      const imgArea = img.rows * img.cols;
      const minAreaRatio = isSmallFormat ? 0.03 : 0.08; // Lower threshold for small docs
      
      let maxArea = 0;
      let maxContourIndex = -1;
      
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);
        
        // Skip contours that are too small
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
        
        // Relaxed approximation for small formats (more tolerant of rounded corners)
        const approxFactor = isSmallFormat ? 0.04 : 0.02;
        cv.approxPolyDP(contour, approx, approxFactor * peri, true);
        
        // Accept 4 points exactly, or 4-6 points for small formats (rounded corners)
        const acceptablePointCount = isSmallFormat 
          ? (approx.rows >= 4 && approx.rows <= 6)
          : (approx.rows === 4);
        
        if (acceptablePointCount) {
          // For small formats with more than 4 points, reduce to 4 corners
          if (approx.rows > 4) {
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
      // Cleanup
      if (imgGray) imgGray.delete();
      if (imgBlur) imgBlur.delete();
      if (kernel) kernel.delete();
      if (imgDilated) imgDilated.delete();
      if (imgThresh) imgThresh.delete();
      if (hierarchy) hierarchy.delete();
      if (contours) contours.delete();
    }
  }

  /**
   * Reduce a polygon with more than 4 points to 4 corners
   */
  private reduceToFourCorners(approx: any, cv: any): any {
    try {
      const points: Array<{ x: number; y: number; index: number }> = [];
      for (let i = 0; i < approx.rows; i++) {
        points.push({
          x: approx.data32S[i * 2],
          y: approx.data32S[i * 2 + 1],
          index: i
        });
      }
      
      // Find bounding box corners
      const minX = Math.min(...points.map(p => p.x));
      const maxX = Math.max(...points.map(p => p.x));
      const minY = Math.min(...points.map(p => p.y));
      const maxY = Math.max(...points.map(p => p.y));
      
      // Find closest point to each corner
      const findClosest = (targetX: number, targetY: number) => {
        let closest = points[0];
        let minDist = Infinity;
        for (const p of points) {
          const dist = Math.hypot(p.x - targetX, p.y - targetY);
          if (dist < minDist) {
            minDist = dist;
            closest = p;
          }
        }
        return closest;
      };
      
      const topLeft = findClosest(minX, minY);
      const topRight = findClosest(maxX, minY);
      const bottomRight = findClosest(maxX, maxY);
      const bottomLeft = findClosest(minX, maxY);
      
      // Create new 4-point contour
      const newContour = cv.matFromArray(4, 1, cv.CV_32SC2, [
        topLeft.x, topLeft.y,
        topRight.x, topRight.y,
        bottomRight.x, bottomRight.y,
        bottomLeft.x, bottomLeft.y
      ]);
      
      return newContour;
    } catch (err) {
      console.error('[Jscanify] reduceToFourCorners error:', err);
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
    
    // Sort points by y coordinate
    points.sort((a, b) => a.y - b.y);
    
    // Top two points
    const topPoints = points.slice(0, 2).sort((a, b) => a.x - b.x);
    // Bottom two points
    const bottomPoints = points.slice(2, 4).sort((a, b) => a.x - b.x);
    
    return {
      topLeft: topPoints[0],
      topRight: topPoints[1],
      bottomLeft: bottomPoints[0],
      bottomRight: bottomPoints[1]
    };
  }

  /**
   * Highlights the paper on the image/canvas with temporal stabilization
   * Optimized with improved memory cleanup
   */
  highlightPaper(image: HTMLCanvasElement | HTMLImageElement, options?: ScanOptions): HTMLCanvasElement | null {
    let cv: any;
    try {
      cv = this.getCV();
    } catch (err) {
      console.warn('[Jscanify] OpenCV not ready');
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
      
      // Validate imread result
      if (!img || img.empty || img.empty()) {
        console.warn('[Jscanify] Failed to read canvas - empty image');
        return null;
      }
      
      contour = this.findPaperContour(img, isSmallFormat);
      
      // Get raw corner points from current frame
      const rawPoints = contour ? this.getCornerPoints(contour) : null;
      
      // Add to stabilizer and get smoothed points
      this.stabilizer.addDetection(rawPoints);
      const stabilizedPoints = this.stabilizer.getStabilizedPoints();
      const confidence = this.stabilizer.getConfidence();
      
      if (stabilizedPoints) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Adjust visual style based on confidence
          ctx.strokeStyle = color;
          ctx.lineWidth = thickness;
          // Higher confidence = more opaque
          ctx.globalAlpha = 0.5 + (confidence * 0.5); // Range: 0.5 to 1.0
          
          ctx.beginPath();
          ctx.moveTo(stabilizedPoints.topLeft.x, stabilizedPoints.topLeft.y);
          ctx.lineTo(stabilizedPoints.topRight.x, stabilizedPoints.topRight.y);
          ctx.lineTo(stabilizedPoints.bottomRight.x, stabilizedPoints.bottomRight.y);
          ctx.lineTo(stabilizedPoints.bottomLeft.x, stabilizedPoints.bottomLeft.y);
          ctx.closePath();
          ctx.stroke();
          
          // Reset alpha
          ctx.globalAlpha = 1.0;
        }
      }
      
      return canvas;
    } catch (error) {
      console.error('[Jscanify] highlightPaper error:', error);
      return null;
    } finally {
      // Guaranteed cleanup with null checks and isDeleted verification
      try {
        if (img && typeof img.delete === 'function' && !img.isDeleted?.()) {
          img.delete();
        }
      } catch (e) {
        console.warn('[Jscanify] Error cleaning img:', e);
      }
      try {
        if (contour && typeof contour.delete === 'function' && !contour.isDeleted?.()) {
          contour.delete();
        }
      } catch (e) {
        console.warn('[Jscanify] Error cleaning contour:', e);
      }
    }
  }

  /**
   * Reset the contour stabilizer (call when starting a new scan session)
   */
  resetStabilizer(): void {
    this.stabilizer.reset();
  }

  /**
   * Extracts and transforms the paper from the image
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
    
    // Declare all OpenCV matrices outside try block for guaranteed cleanup
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
        console.warn('[Jscanify] No paper contour found, returning null');
        return null;
      }
      
      const points = this.getCornerPoints(contour);
      if (!points) {
        console.warn('[Jscanify] Could not get corner points');
        return null;
      }
      
      // Source points
      srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        points.topLeft.x, points.topLeft.y,
        points.topRight.x, points.topRight.y,
        points.bottomRight.x, points.bottomRight.y,
        points.bottomLeft.x, points.bottomLeft.y
      ]);
      
      // Destination points
      dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        resultWidth, 0,
        resultWidth, resultHeight,
        0, resultHeight
      ]);
      
      // Get perspective transform
      M = cv.getPerspectiveTransform(srcTri, dstTri);
      
      // Apply transform
      result = new cv.Mat();
      const dsize = new cv.Size(resultWidth, resultHeight);
      cv.warpPerspective(img, result, M, dsize);
      
      // Create output canvas
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = resultWidth;
      outputCanvas.height = resultHeight;
      cv.imshow(outputCanvas, result);
      
      return outputCanvas;
    } catch (error) {
      console.error('[Jscanify] extractPaper error:', error);
      return null;
    } finally {
      // GUARANTEED CLEANUP - prevents WebAssembly memory leaks
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
