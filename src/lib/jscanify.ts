/**
 * jscanify - Document scanner library
 * Adapted from https://github.com/nicksypark/jscanify (MIT License)
 * Converted to ES module with explicit window.cv access
 * Enhanced with adaptive detection for small documents (licenses, cards)
 */

function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export interface ScanOptions {
  color?: string;
  thickness?: number;
  isSmallFormat?: boolean;
}

export class Jscanify {
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
  getCornerPoints(contour: any): { topLeft: any; topRight: any; bottomLeft: any; bottomRight: any } | null {
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
   * Highlights the paper on the image/canvas
   */
  highlightPaper(image: HTMLCanvasElement | HTMLImageElement, options?: ScanOptions): HTMLCanvasElement | null {
    const cv = this.getCV();
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
      contour = this.findPaperContour(img, isSmallFormat);
      
      if (contour) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const points = this.getCornerPoints(contour);
          if (points) {
            ctx.strokeStyle = color;
            ctx.lineWidth = thickness;
            ctx.beginPath();
            ctx.moveTo(points.topLeft.x, points.topLeft.y);
            ctx.lineTo(points.topRight.x, points.topRight.y);
            ctx.lineTo(points.bottomRight.x, points.bottomRight.y);
            ctx.lineTo(points.bottomLeft.x, points.bottomLeft.y);
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
      
      return canvas;
    } catch (error) {
      console.error('[Jscanify] highlightPaper error:', error);
      return null;
    } finally {
      if (img) img.delete();
      if (contour) contour.delete();
    }
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
