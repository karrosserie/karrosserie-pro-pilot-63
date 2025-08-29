import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.addca46c518047ebaef9d0b0d2d21e9b',
  appName: 'karrosserie-pro-v2',
  webDir: 'dist',
  server: {
    url: 'https://addca46c-5180-47eb-aef9-d0b0d2d21e9b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: {
        camera: 'To take photos of violations',
        photos: 'To select photos from gallery'
      }
    }
  }
};

export default config;