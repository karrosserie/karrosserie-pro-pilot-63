import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RotateCcw, Check, X, Move, AlertCircle } from 'lucide-react';

const DocumentScanner = ({ onDocumentScanned, onCancel }) => {
  const [step, setStep] = useState('permission');
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [corners, setCorners] = useState([]);
  const [draggedCorner, setDraggedCorner] = useState(-1);
  const [processedImage, setProcessedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const checkCameraPermissions = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('La caméra n\'est pas supportée sur cet appareil');
        return false;
      }
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'camera' });
          setPermissionStatus(permission.state);
          permission.onchange = () => { setPermissionStatus(permission.state); };
        } catch (e) {
          console.log('Permission API non supportée');
        }
      }
      return true;
    } catch (error) {
      console.error('Erreur vérification permissions:', error);
      setCameraError('Impossible de vérifier les permissions de la caméra');
      return false;
    }
  }, []);

  const requestCameraAccess = useCallback(async () => {
    try {
      setCameraError(null);
      setStep('camera');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      setStream(mediaStream);
      setPermissionStatus('granted');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Erreur accès caméra:', error);
      setPermissionStatus('denied');
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('Accès à la caméra refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('Aucune caméra trouvée sur cet appareil.');
      } else if (error.name === 'NotReadableError') {
        setCameraError('La caméra est déjà utilisée par une autre application.');
      } else {
        setCameraError(`Erreur caméra: ${error.message}`);
      }
      setStep('permission');
    }
  }, []);

  useEffect(() => {
    checkCameraPermissions();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [checkCameraPermissions, stream]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    detectDocumentCorners(ctx, canvas.width, canvas.height);
    setStep('adjust');
  }, [stream]);

  const detectDocumentCorners = (ctx, width, height) => {
    const margin = Math.min(width, height) * 0.1;
    const defaultCorners = [
      { x: margin, y: margin },
      { x: width - margin, y: margin },
      { x: width - margin, y: height - margin },
      { x: margin, y: height - margin }
    ];
    setCorners(defaultCorners);
  };

  const handleMouseDown = (e, cornerIndex) => {
    setDraggedCorner(cornerIndex);
  };

  const handleMouseMove = useCallback((e) => {
    if (draggedCorner >= 0 && previewCanvasRef.current) {
      const rect = previewCanvasRef.current.getBoundingClientRect();
      const scaleX = previewCanvasRef.current.width / rect.width;
      const scaleY = previewCanvasRef.current.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      const newCorners = [...corners];
      newCorners[draggedCorner] = { x, y };
      setCorners(newCorners);
    }
  }, [draggedCorner, corners]);

  const handleMouseUp = () => {
    setDraggedCorner(-1);
  };

  const handleTouchStart = (e, cornerIndex) => {
    e.preventDefault();
    setDraggedCorner(cornerIndex);
  };

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (draggedCorner >= 0 && previewCanvasRef.current) {
      const rect = previewCanvasRef.current.getBoundingClientRect();
      const scaleX = previewCanvasRef.current.width / rect.width;
      const scaleY = previewCanvasRef.current.height / rect.height;
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;
      const newCorners = [...corners];
      newCorners[draggedCorner] = { x, y };
      setCorners(newCorners);
    }
  }, [draggedCorner, corners]);

  useEffect(() => {
    if (step === 'adjust' && capturedImage && previewCanvasRef.current) {
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        corners.forEach((corner, index) => {
          if (index === 0) {
            ctx.moveTo(corner.x, corner.y);
          } else {
            ctx.lineTo(corner.x, corner.y);
          }
        });
        ctx.closePath();
        ctx.stroke();
        corners.forEach((corner, index) => {
          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.arc(corner.x, corner.y, 10, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(corner.x, corner.y, 6, 0, 2 * Math.PI);
          ctx.fill();
        });
      };
      img.src = capturedImage;
    }
  }, [step, capturedImage, corners]);

  const applyPerspectiveCorrection = () => {
    setStep('processing');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const width = Math.max(
        Math.sqrt(Math.pow(corners[1].x - corners[0].x, 2) + Math.pow(corners[1].y - corners[0].y, 2)),
        Math.sqrt(Math.pow(corners[2].x - corners[3].x, 2) + Math.pow(corners[2].y - corners[3].y, 2))
      );
      const height = Math.max(
        Math.sqrt(Math.pow(corners[3].x - corners[0].x, 2) + Math.pow(corners[3].y - corners[0].y, 2)),
        Math.sqrt(Math.pow(corners[2].x - corners[1].x, 2) + Math.pow(corners[2].y - corners[1].y, 2))
      );
      canvas.width = width;
      canvas.height = height;
      const minX = Math.min(...corners.map(c => c.x));
      const minY = Math.min(...corners.map(c => c.y));
      const maxX = Math.max(...corners.map(c => c.x));
      const maxY = Math.max(...corners.map(c => c.y));
      const sourceWidth = maxX - minX;
      const sourceHeight = maxY - minY;
      ctx.drawImage(img, minX, minY, sourceWidth, sourceHeight, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const contrast = 1.2;
        data[i] = Math.min(255, (data[i] - 128) * contrast + 128);
        data[i + 1] = Math.min(255, (data[i + 1] - 128) * contrast + 128);
        data[i + 2] = Math.min(255, (data[i + 2] - 128) * contrast + 128);
      }
      ctx.putImageData(imageData, 0, 0);
      const finalImage = canvas.toDataURL('image/jpeg', 0.95);
      setProcessedImage(finalImage);
      if (onDocumentScanned) {
        onDocumentScanned(finalImage);
      }
    };
    img.src = capturedImage;
  };

  const resetCapture = () => {
    setStep('permission');
    setCapturedImage(null);
    setCorners([]);
    setProcessedImage(null);
    setCameraError(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-black/50 text-white">
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-white/20 transition-colors">
          <X size={24} />
        </button>
        <h1 className="font-semibold">
          {step === 'permission' && 'Autorisation caméra'}
          {step === 'camera' && 'Photographier le document'}
          {step === 'adjust' && 'Ajuster les contours'}
          {step === 'processing' && 'Traitement...'}
        </h1>
        <div className="w-10" />
      </div>
      <div className="flex-1 flex flex-col">
        {step === 'permission' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-900 text-white">
            <div className="text-center max-w-sm">
              <div className="mb-6">
                <Camera size={64} className="mx-auto mb-4 text-blue-500" />
                <h2 className="text-xl font-semibold mb-2">Accès à la caméra requis</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Pour scanner vos documents, nous avons besoin d'accéder à votre caméra. 
                  Vos photos ne seront pas sauvegardées sans votre autorisation.
                </p>
              </div>
              {cameraError && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <div className="text-red-300 text-sm">
                    <strong>Erreur :</strong> {cameraError}
                  </div>
                  {permissionStatus === 'denied' && (
                    <div className="text-red-200 text-xs mt-2">
                      Pour réactiver : Paramètres → Site → Caméra → Autoriser
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={requestCameraAccess}
                disabled={permissionStatus === 'denied'}
                className={`w-full py-4 px-6 rounded-lg font-medium transition-all ${
                  permissionStatus === 'denied'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105'
                }`}
              >
                {permissionStatus === 'denied' ? 'Accès refusé' : 'Autoriser l\'accès à la caméra'}
              </button>
              {permissionStatus === 'denied' && (
                <p className="text-xs text-gray-400 mt-3">
                  Rechargez la page ou modifiez les paramètres de votre navigateur pour réessayer
                </p>
              )}
            </div>
          </div>
        )}
        {step === 'camera' && (
          <div className="relative flex-1">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white/50 border-dashed rounded-lg w-4/5 h-3/5 flex items-center justify-center">
                <div className="text-white/70 text-center">
                  <div className="text-sm mb-2">Placez le document dans le cadre</div>
                  <div className="text-xs">Assurez-vous que les 4 coins sont visibles</div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <button onClick={capturePhoto} className="bg-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform">
                <Camera size={32} className="text-gray-800" />
              </button>
            </div>
          </div>
        )}
        {step === 'adjust' && (
          <div className="flex-1 flex flex-col">
            <div className="relative flex-1 overflow-hidden">
              <canvas
                ref={previewCanvasRef}
                className="w-full h-full object-contain cursor-crosshair"
                onMouseDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const scaleX = e.currentTarget.width / rect.width;
                  const scaleY = e.currentTarget.height / rect.height;
                  const x = (e.clientX - rect.left) * scaleX;
                  const y = (e.clientY - rect.top) * scaleY;
                  let closestCorner = -1;
                  let minDistance = Infinity;
                  corners.forEach((corner, index) => {
                    const distance = Math.sqrt(Math.pow(corner.x - x, 2) + Math.pow(corner.y - y, 2));
                    if (distance < minDistance && distance < 30) {
                      minDistance = distance;
                      closestCorner = index;
                    }
                  });
                  if (closestCorner >= 0) {
                    handleMouseDown(e, closestCorner);
                  }
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const scaleX = e.currentTarget.width / rect.width;
                  const scaleY = e.currentTarget.height / rect.height;
                  const touch = e.touches[0];
                  const x = (touch.clientX - rect.left) * scaleX;
                  const y = (touch.clientY - rect.top) * scaleY;
                  let closestCorner = -1;
                  let minDistance = Infinity;
                  corners.forEach((corner, index) => {
                    const distance = Math.sqrt(Math.pow(corner.x - x, 2) + Math.pow(corner.y - y, 2));
                    if (distance < minDistance && distance < 50) {
                      minDistance = distance;
                      closestCorner = index;
                    }
                  });
                  if (closestCorner >= 0) {
                    handleTouchStart(e, closestCorner);
                  }
                }}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => setDraggedCorner(-1)}
              />
              <div className="absolute top-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Move size={16} />
                  <span className="text-sm font-medium">Ajustez les contours</span>
                </div>
                <div className="text-xs opacity-80">
                  Faites glisser les coins bleus pour délimiter précisément le document
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-900 flex justify-center gap-4">
              <button onClick={resetCapture} className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <RotateCcw size={20} />
                Reprendre
              </button>
              <button onClick={applyPerspectiveCorrection} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
                <Check size={20} />
                Valider
              </button>
            </div>
          </div>
        )}
        {step === 'processing' && (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-lg font-medium">Traitement de l'image...</div>
              <div className="text-sm opacity-70">Correction perspective et amélioration</div>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default DocumentScanner;