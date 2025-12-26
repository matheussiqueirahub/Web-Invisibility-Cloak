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

  const [errorType, setErrorType] = useState<"PERMISSION_DENIED" | "UNKNOWN" | null>(null);
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);

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
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setErrorType("PERMISSION_DENIED");
        } else {
          setErrorType("UNKNOWN");
        }
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
        setOverlayMessage("Capturing background...");
        
        // Artificial delay to show the 'Capturing' state to the user
        const timer = setTimeout(() => {
            if (!canvasRef.current || !videoRef.current) return;

            const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
            if (ctx) {
                // Draw current frame to canvas
                ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                // Get image data
                const frame = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
                // Store as background
                backgroundRef.current = frame;
                
                setOverlayMessage("Background captured!");
                // Notify parent
                onBackgroundCaptured(canvasRef.current.toDataURL('image/png'));
                
                // Hide success message after 2 seconds
                setTimeout(() => setOverlayMessage(null), 2000);
            }
        }, 600);
        
        return () => clearTimeout(timer);
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
      {errorType && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 z-50 p-6 text-center">
            <div className="bg-red-500/10 p-4 rounded-full mb-4">
              {errorType === 'PERMISSION_DENIED' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
                {errorType === 'PERMISSION_DENIED' ? "Camera Access Denied" : "Camera Error"}
            </h3>
            
            <p className="text-slate-300 mb-6 max-w-sm">
                {errorType === 'PERMISSION_DENIED' 
                 ? "Please allow camera access in your browser settings (usually near the URL bar) and refresh the page to use the invisibility cloak."
                 : "Unable to access the camera. Please ensure it's connected and not being used by another application."}
            </p>

            <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
            >
                Reload Page
            </button>
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

      {/* Target Color Indicator Overlay */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm pointer-events-none z-10">
          <div 
              className="w-4 h-4 rounded-full border border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: `hsl(${config.targetHue}, 100%, 50%)` }}
          />
          <span className="text-xs font-medium text-slate-300">Target</span>
      </div>

      {/* Live Indicator */}
      {backgroundRef.current && (
         <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-red-500/30 z-10">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-mono text-white font-bold tracking-widest uppercase">LIVE</span>
         </div>
      )}

      {/* Capture Feedback Overlay */}
      {overlayMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none transition-opacity duration-300">
            <div className="bg-slate-900/90 text-white px-6 py-3 rounded-full font-semibold shadow-2xl border border-slate-700 flex items-center gap-3 transform scale-110">
                {overlayMessage === 'Capturing background...' ? (
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                <span>{overlayMessage}</span>
            </div>
        </div>
      )}

      {/* Overlay Instructions (only if no background and no error) */}
      {!backgroundRef.current && !errorType && !overlayMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 pointer-events-none p-4 text-center z-10">
            <h3 className="text-2xl font-bold text-white mb-2">Step 1: Capture Background</h3>
            <p className="text-slate-300">Move out of the frame and click "Capture Background". This creates the reference image for the invisibility effect.</p>
        </div>
      )}
    </div>
  );
};

export default CloakCanvas;