import { useState, useEffect } from 'react';
import { Camera, CameraPermissionState } from '@capacitor/camera';

export const useCamera = () => {
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionState>('prompt');
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const permission = await Camera.checkPermissions();
      setCameraPermission(permission.camera);
      setIsPermissionGranted(permission.camera === 'granted');
      return permission.camera === 'granted';
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      return false;
    }
  };

  const requestCameraPermission = async () => {
    try {
      const permission = await Camera.requestPermissions();
      setCameraPermission(permission.camera);
      setIsPermissionGranted(permission.camera === 'granted');
      return permission.camera === 'granted';
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  };

  return {
    cameraPermission,
    isPermissionGranted,
    checkCameraPermission,
    requestCameraPermission
  };
};