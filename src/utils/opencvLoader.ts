
let opencvLoadingPromise: Promise<void> | null = null;
let isOpenCVLoaded = false;

export const loadOpenCV = (): Promise<void> => {
  if (isOpenCVLoaded) {
    return Promise.resolve();
  }

  if (opencvLoadingPromise) {
    return opencvLoadingPromise;
  }

  opencvLoadingPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('OpenCV can only be loaded in browser environment'));
      return;
    }

    // Check if OpenCV is already loaded
    if ((window as any).cv && (window as any).cv.Mat) {
      isOpenCVLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.7.0/opencv.js';
    script.async = true;

    script.onload = () => {
      // OpenCV.js needs time to initialize
      const checkOpenCV = setInterval(() => {
        if ((window as any).cv && (window as any).cv.Mat) {
          clearInterval(checkOpenCV);
          isOpenCVLoaded = true;
          console.log('OpenCV.js loaded successfully');
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkOpenCV);
        if (!isOpenCVLoaded) {
          reject(new Error('OpenCV.js failed to initialize'));
        }
      }, 10000);
    };

    script.onerror = () => {
      reject(new Error('Failed to load OpenCV.js script'));
    };

    document.head.appendChild(script);
  });

  return opencvLoadingPromise;
};

export const isOpenCVAvailable = (): boolean => {
  return isOpenCVLoaded && typeof (window as any).cv !== 'undefined';
};
