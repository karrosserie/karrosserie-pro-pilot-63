
import React from 'react';

interface ScannerOverlayProps {
  isDetected: boolean;
  status: 'loading' | 'ready' | 'searching' | 'found' | 'error';
  detectedCorners?: Array<{x: number, y: number}> | null;
  videoWidth: number;
  videoHeight: number;
  isVideoPlaying: boolean;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({
  isDetected,
  detectedCorners,
  videoWidth,
  videoHeight,
  isVideoPlaying
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Dynamic document contour when detected */}
      {isDetected && detectedCorners && detectedCorners.length === 4 && videoWidth > 0 && videoHeight > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <polygon
            points={detectedCorners.map(p => 
              `${(p.x / videoWidth) * 100}%,${(p.y / videoHeight) * 100}%`
            ).join(' ')}
            fill="rgba(34, 197, 94, 0.2)"
            stroke="rgb(34, 197, 94)"
            strokeWidth="4"
          />
        </svg>
      )}


      {/* Top title bar only */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-center">
          <h2 className="text-white text-lg font-semibold">
            Scanner de document
          </h2>
        </div>
      </div>
    </div>
  );
};
