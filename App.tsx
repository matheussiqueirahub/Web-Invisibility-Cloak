import React, { useState, useCallback } from 'react';
import CloakCanvas from './components/CloakCanvas';
import ControlPanel from './components/ControlPanel';
import Assistant from './components/Assistant';
import { CloakStatus, ProcessingConfig } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<CloakStatus>(CloakStatus.IDLE);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [triggerCapture, setTriggerCapture] = useState(0);

  // Default to RED detection
  const [config, setConfig] = useState<ProcessingConfig>({
    targetHue: 0,      // Red
    hueThreshold: 15,  // +/- 15 degrees
    satThreshold: 40,  // Minimum saturation
    valThreshold: 20   // Minimum brightness
  });

  const handleCaptureBackground = useCallback(() => {
    setTriggerCapture(prev => prev + 1);
    setStatus(CloakStatus.ACTIVE);
  }, []);

  const handleBackgroundCaptured = useCallback((dataUrl: string) => {
    setBackgroundImage(dataUrl);
  }, []);

  const handleReset = useCallback(() => {
    // Soft reset state without reloading page for better UX
    setBackgroundImage(null);
    setStatus(CloakStatus.IDLE);
    setTriggerCapture(0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Invisibility Cloak
          </h1>
          <p className="text-slate-400 max-w-2xl">
            A computer vision experiment running entirely in your browser. 
            No Python required. Detects color and replaces it with the background.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Video Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <CloakCanvas
              status={status}
              config={config}
              onBackgroundCaptured={handleBackgroundCaptured}
              triggerCapture={triggerCapture}
            />
          </div>

          {/* Sidebar Controls */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             
            <ControlPanel 
                config={config}
                setConfig={setConfig}
                onCaptureBackground={handleCaptureBackground}
                onReset={handleReset}
                hasBackground={!!backgroundImage}
            />

            <Assistant backgroundImage={backgroundImage} />
            
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 text-sm text-slate-400">
               <h4 className="font-semibold text-slate-300 mb-2">How to use:</h4>
               <ol className="list-decimal pl-4 space-y-2">
                   <li>Allow camera access.</li>
                   <li>Move out of the camera's view (reveal the empty background).</li>
                   <li>Click <strong>Capture Background</strong>.</li>
                   <li>Come back into the frame holding a <strong>Red</strong> object (or change the color slider).</li>
                   <li>Watch the object disappear!</li>
               </ol>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;