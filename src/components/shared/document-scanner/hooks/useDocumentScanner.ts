
import { useState, useEffect, useRef, useCallback } from 'react';
import jscanify from 'jscanify';
import { loadOpenCV, isOpenCVAvailable } from '@/utils/opencvLoader';

type ScannerStatus = 'loading' | 'ready' | 'searching' | 'found' | 'error';

export const useDocumentScanner = () => {
  const [status, setStatus] = useState<ScannerStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize OpenCV and scanner
  useEffect(() => {
    const initialize = async () => {
      try {
        setStatus('loading');
        await loadOpenCV();
        
        if (isOpenCVAvailable()) {
          scannerRef.current = new jscanify();
          setStatus('ready');
        } else {
          throw new Error('OpenCV not available');
        }
      } catch (err) {
        console.error('Failed to initialize scanner:', err);
        setError('Impossible de charger le scanner de documents');
        setStatus('error');
      }
    };

    initialize();
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setStatus('searching');
      }
    } catch (err) {
      console.error('Failed to start camera:', err);
      setError('Impossible d\'accéder à la caméra');
      setStatus('error');
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
    if (!videoRef.current || !canvasRef.current || !scannerRef.current) {
      return null;
    }

    if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
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
      // Detect paper corners
      const resultCanvas = scannerRef.current.highlightPaper(canvas);
      return resultCanvas;
    } catch (err) {
      console.error('Detection error:', err);
      return null;
    }
  }, []);

  // Extract and crop document
  const extractDocument = useCallback(async (): Promise<Blob | null> => {
    if (!videoRef.current || !canvasRef.current || !scannerRef.current) {
      return null;
    }

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Draw current frame
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Extract and straighten document
      const extractedCanvas = scannerRef.current.extractPaper(canvas, canvas.width, canvas.height);
      
      // Convert to blob
      return new Promise((resolve) => {
        extractedCanvas.toBlob((blob: Blob | null) => {
          resolve(blob);
        }, 'image/jpeg', 0.95);
      });
    } catch (err) {
      console.error('Extraction error:', err);
      return null;
    }
  }, []);

  return {
    status,
    error,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    detectDocument,
    extractDocument
  };
};
