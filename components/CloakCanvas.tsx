import React, { useRef, useEffect, useState } from 'react';
import { CloakStatus, ProcessingConfig } from '../types';
import { rgbToHsl, isColorMatch } from '../utils/colorUtils';

interface CloakCanvasProps {
  status: CloakStatus;
  config: ProcessingConfig;
  onBackgroundCaptured: (dataUrl: string) => void;
  triggerCapture: number; // Increment to trigger capture
}

const CloakCanvas: React.FC<CloakCanvasProps> = ({ 
    status, 
    config, 
    onBackgroundCaptured,
    triggerCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundRef = useRef<ImageData | null>(null);
  const animationFrameRef = useRef<number>();

  const [error, setError] = useState<string>("");

  // Setup Webcam
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for metadata to load to ensure dimensions are correct
          videoRef.current.onloadedmetadata = () => {
             videoRef.current?.play();
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Camera access denied or unavailable.");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Capture Background Effect
  useEffect(() => {
    if (triggerCapture > 0 && canvasRef.current && videoRef.current) {
        const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
        if (ctx) {
            // Draw current frame to canvas
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            // Get image data
            const frame = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            // Store as background
            backgroundRef.current = frame;
            // Notify parent
            onBackgroundCaptured(canvasRef.current.toDataURL('image/png'));
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerCapture]);

  // Main Processing Loop
  useEffect(() => {
    const processFrame = () => {
      if (!canvasRef.current || !videoRef.current || videoRef.current.readyState !== 4) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      // Draw current video frame to canvas first (to get pixel data)
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      
      // If we don't have a background yet, just show the video (already drawn)
      if (!backgroundRef.current) {
         animationFrameRef.current = requestAnimationFrame(processFrame);
         return;
      }

      // 1. Get current frame data
      const frameData = ctx.getImageData(0, 0, width, height);
      const pixelData = frameData.data;
      
      // 2. Get background data
      const bgData = backgroundRef.current.data;

      // 3. Pixel manipulation loop
      const len = pixelData.length;
      const { targetHue, hueThreshold, satThreshold, valThreshold } = config;

      for (let i = 0; i < len; i += 4) {
        const r = pixelData[i];
        const g = pixelData[i + 1];
        const b = pixelData[i + 2];

        // Convert to HSL
        const { h, s, l } = rgbToHsl(r, g, b);

        // Check if pixel matches target color
        if (isColorMatch(h, s, l, targetHue, hueThreshold, satThreshold, valThreshold)) {
            // REPLACE pixel with background pixel
            pixelData[i] = bgData[i];         // R
            pixelData[i + 1] = bgData[i + 1]; // G
            pixelData[i + 2] = bgData[i + 2]; // B
            // Alpha remains 255 (or whatever it was)
        }
      }

      // 4. Put modified data back to canvas
      ctx.putImageData(frameData, 0, 0);

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
        if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [config, status]); // Re-bind loop if config changes

  return (
    <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden border-2 border-slate-700 shadow-2xl">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-red-500 z-50">
          {error}
        </div>
      )}
      
      {/* Hidden Video Element - source of truth */}
      <video
        ref={videoRef}
        className="hidden" // We process onto canvas, so hide original video
        muted
        playsInline
      />
      
      {/* Output Canvas */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
      />

      {/* Overlay Instructions */}
      {!backgroundRef.current && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 pointer-events-none p-4 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Step 1: Capture Background</h3>
            <p className="text-slate-300">Move out of the frame and click "Capture Background". This creates the reference image for the invisibility effect.</p>
        </div>
      )}
    </div>
  );
};

export default CloakCanvas;