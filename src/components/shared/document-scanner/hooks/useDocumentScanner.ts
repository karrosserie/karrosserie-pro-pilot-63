
import { useState, useEffect, useRef, useCallback } from 'react';
import { loadOpenCV, isOpenCVAvailable } from '@/utils/opencvLoader';

type ScannerStatus = 'loading' | 'ready' | 'searching' | 'found' | 'error';

// OpenCV helper functions for document detection
const findDocumentContour = (src: any) => {
  const cv = (window as any).cv;
  if (!cv) return null;

  const gray = new cv.Mat();
  const blur = new cv.Mat();
  const edges = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    // Convert to grayscale
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    
    // Apply Gaussian blur
    cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0);
    
    // Detect edges
    cv.Canny(blur, edges, 50, 150);
    
    // Find contours
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
    // Find largest rectangular contour
    let maxArea = 0;
    let bestContour = null;
    
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const area = cv.contourArea(contour);
      const peri = cv.arcLength(contour, true);
      const approx = new cv.Mat();
      
      cv.approxPolyDP(contour, approx, 0.02 * peri, true);
      
      // Check if contour has 4 points (rectangle) and is large enough (5% of image)
      if (approx.rows === 4 && area > maxArea && area > (src.rows * src.cols * 0.05)) {
        maxArea = area;
        if (bestContour) bestContour.delete();
        bestContour = approx.clone();
      }
      
      approx.delete();
    }
    
    gray.delete();
    blur.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
    
    return bestContour;
  } catch (err) {
    console.error('[OpenCV] Contour detection error:', err);
    gray.delete();
    blur.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
    return null;
  }
};

const orderPoints = (pts: any) => {
  // Order points: top-left, top-right, bottom-right, bottom-left
  const rect = new Array(4);
  const sum = pts.map((p: any) => p.x + p.y);
  const diff = pts.map((p: any) => p.y - p.x);
  
  rect[0] = pts[sum.indexOf(Math.min(...sum))]; // top-left
  rect[2] = pts[sum.indexOf(Math.max(...sum))]; // bottom-right
  rect[1] = pts[diff.indexOf(Math.min(...diff))]; // top-right
  rect[3] = pts[diff.indexOf(Math.max(...diff))]; // bottom-left
  
  return rect;
};

export const useDocumentScanner = () => {
  const [status, setStatus] = useState<ScannerStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [detectedCorners, setDetectedCorners] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize OpenCV on mount (independent of camera)
  useEffect(() => {
    console.log('[OpenCV] Initializing...');
    const initOpenCV = async () => {
      try {
        await loadOpenCV();
        console.log('[OpenCV] ✓ Loaded');
        setStatus('ready');
      } catch (err) {
        console.error('[OpenCV] Load error:', err);
        setError('OpenCV non disponible - mode photo simple activé');
        // Don't set status to 'error', allow camera to work in fallback mode
      }
    };

    initOpenCV();
  }, []);

  // Start camera (independent of OpenCV)
  const startCamera = useCallback(async () => {
    console.log('[Camera] Requesting access...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      console.log('[Camera] ✓ Stream obtained');

      if (!videoRef.current) {
        console.error('[Camera] Video element not found');
        throw new Error('Video element not available');
      }

      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      
      // Forcer le play explicitement pour éviter les problèmes d'autoplay bloqué sur mobile
      try {
        await videoRef.current.play();
        console.log('[Camera] ✓ Video.play() called successfully');
      } catch (playErr) {
        console.warn('[Camera] Autoplay blocked, will require user interaction:', playErr);
      }
      
      // Enable OpenCV detection when ready
      if (isOpenCVAvailable()) {
        setStatus('searching');
      }
    } catch (err) {
      console.error('[Camera] Access error:', err);
      setError('Impossible d\'accéder à la caméra');
      setStatus('error');
      throw err;
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStatus('ready');
  }, []);

  // Detect document in frame
  const detectDocument = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      return null;
    }

    if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      return null;
    }

    const cv = (window as any).cv;
    if (!cv) {
      return null;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas dimensions to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Draw current video frame
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    try {
      // Convert canvas to OpenCV Mat
      const src = cv.imread(canvas);
      
      // Find document contour
      const contour = findDocumentContour(src);
      
      if (contour && contour.rows === 4) {
        // Draw contour on canvas
        const points = [];
        for (let i = 0; i < 4; i++) {
          points.push({
            x: contour.data32S[i * 2],
            y: contour.data32S[i * 2 + 1]
          });
        }
        
        setDetectedCorners(points);
        
        // Draw the detected rectangle
        ctx.strokeStyle = '#22C55E';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < 4; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.stroke();
        
        contour.delete();
        src.delete();
        return canvas;
      } else {
        setDetectedCorners(null);
        if (contour) contour.delete();
        src.delete();
        return canvas;
      }
    } catch (err) {
      console.error('[Detection] Error:', err);
      setDetectedCorners(null);
      return null;
    }
  }, []);

  // Extract and crop document
  const extractDocument = useCallback(async (): Promise<Blob | null> => {
    if (!videoRef.current || !canvasRef.current || !detectedCorners) {
      return null;
    }

    const cv = (window as any).cv;
    if (!cv) return null;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Draw current frame
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Convert to OpenCV Mat
      const src = cv.imread(canvas);
      
      // Order the corner points
      const orderedPts = orderPoints(detectedCorners);
      
      // Calculate width and height of the new image
      const widthA = Math.sqrt(
        Math.pow(orderedPts[2].x - orderedPts[3].x, 2) +
        Math.pow(orderedPts[2].y - orderedPts[3].y, 2)
      );
      const widthB = Math.sqrt(
        Math.pow(orderedPts[1].x - orderedPts[0].x, 2) +
        Math.pow(orderedPts[1].y - orderedPts[0].y, 2)
      );
      const maxWidth = Math.max(widthA, widthB);
      
      const heightA = Math.sqrt(
        Math.pow(orderedPts[1].x - orderedPts[2].x, 2) +
        Math.pow(orderedPts[1].y - orderedPts[2].y, 2)
      );
      const heightB = Math.sqrt(
        Math.pow(orderedPts[0].x - orderedPts[3].x, 2) +
        Math.pow(orderedPts[0].y - orderedPts[3].y, 2)
      );
      const maxHeight = Math.max(heightA, heightB);
      
      // Create destination points
      const dsize = new cv.Size(maxWidth, maxHeight);
      const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        maxWidth - 1, 0,
        maxWidth - 1, maxHeight - 1,
        0, maxHeight - 1
      ]);
      
      const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
        orderedPts[0].x, orderedPts[0].y,
        orderedPts[1].x, orderedPts[1].y,
        orderedPts[2].x, orderedPts[2].y,
        orderedPts[3].x, orderedPts[3].y
      ]);
      
      // Apply perspective transform
      const M = cv.getPerspectiveTransform(srcPoints, dstPoints);
      const dst = new cv.Mat();
      cv.warpPerspective(src, dst, M, dsize);
      
      // Convert back to canvas
      const outputCanvas = document.createElement('canvas');
      cv.imshow(outputCanvas, dst);
      
      // Clean up
      src.delete();
      dst.delete();
      M.delete();
      srcPoints.delete();
      dstPoints.delete();
      
      // Convert to blob
      return new Promise((resolve) => {
        outputCanvas.toBlob((blob: Blob | null) => {
          resolve(blob);
        }, 'image/jpeg', 0.95);
      });
    } catch (err) {
      console.error('[Extraction] Error:', err);
      return null;
    }
  }, [detectedCorners]);

  return {
    status,
    error,
    videoRef,
    canvasRef,
    detectedCorners,
    startCamera,
    stopCamera,
    detectDocument,
    extractDocument
  };
};
