/**
 * jscanify - Document scanner library
 * Adapted from https://github.com/nicksypark/jscanify (MIT License)
 * Converted to ES module with explicit window.cv access
 */

function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
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
   */
  findPaperContour(img: any): any {
    const cv = this.getCV();
    
    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY);
    
    const imgBlur = new cv.Mat();
    cv.GaussianBlur(imgGray, imgBlur, new cv.Size(5, 5), 0);
    
    const imgThresh = new cv.Mat();
    cv.Canny(imgBlur, imgThresh, 75, 200);
    
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(imgThresh, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
    
    let maxArea = 0;
    let maxContourIndex = -1;
    
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const area = cv.contourArea(contour);
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
      cv.approxPolyDP(contour, approx, 0.02 * peri, true);
      
      if (approx.rows === 4) {
        paperContour = approx;
      } else {
        approx.delete();
      }
    }
    
    // Cleanup
    imgGray.delete();
    imgBlur.delete();
    imgThresh.delete();
    hierarchy.delete();
    
    // Don't delete contours yet if we're returning one
    if (paperContour === null) {
      contours.delete();
    }
    
    return paperContour;
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
  highlightPaper(image: HTMLCanvasElement | HTMLImageElement, options?: { color?: string; thickness?: number }): HTMLCanvasElement | null {
    const cv = this.getCV();
    const { color = 'lime', thickness = 8 } = options || {};
    
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
    
    try {
      const img = cv.imread(canvas);
      const contour = this.findPaperContour(img);
      
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
        contour.delete();
      }
      
      img.delete();
      return canvas;
    } catch (error) {
      console.error('[Jscanify] highlightPaper error:', error);
      return null;
    }
  }

  /**
   * Extracts and transforms the paper from the image
   */
  extractPaper(image: HTMLCanvasElement | HTMLImageElement, resultWidth: number, resultHeight: number, cornerPoints?: any): HTMLCanvasElement | null {
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
        contour = this.findPaperContour(img);
        localContour = true;
      }
      
      if (!contour) {
        console.warn('[Jscanify] No paper contour found, returning original');
        return canvas;
      }
      
      const points = this.getCornerPoints(contour);
      if (!points) {
        console.warn('[Jscanify] Could not get corner points');
        return canvas;
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
