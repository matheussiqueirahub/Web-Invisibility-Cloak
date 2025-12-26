import React from 'react';
import { ProcessingConfig } from '../types';

interface ControlPanelProps {
  config: ProcessingConfig;
  setConfig: React.Dispatch<React.SetStateAction<ProcessingConfig>>;
  onCaptureBackground: () => void;
  onReset: () => void;
  hasBackground: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  setConfig,
  onCaptureBackground,
  onReset,
  hasBackground
}) => {
  const handleChange = (key: keyof ProcessingConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
          Control Panel
        </h2>
        <p className="text-slate-400 text-sm">Adjust sensitivity to refine the invisibility effect.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onCaptureBackground}
            className={`py-3 px-4 rounded-lg font-bold transition-all shadow-lg ${
              hasBackground 
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
              : 'bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse'
            }`}
          >
            {hasBackground ? 'Retake Background' : '1. Capture Background'}
          </button>
          
          <button
             onClick={onReset}
             className="py-3 px-4 bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 rounded-lg font-semibold"
          >
             Reset Everything
          </button>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-700">
        <div>
          <label className="flex justify-between text-sm font-medium text-slate-300 mb-1">
            Target Hue (Color)
            <span className="text-blue-400">{config.targetHue}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={config.targetHue}
            onChange={(e) => handleChange('targetHue', Number(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Red (0/360)</span>
            <span>Green (120)</span>
            <span>Blue (240)</span>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium text-slate-300 mb-1">
            Hue Tolerance
            <span className="text-blue-400">±{config.hueThreshold}</span>
          </label>
          <input
            type="range"
            min="5"
            max="60"
            value={config.hueThreshold}
            onChange={(e) => handleChange('hueThreshold', Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium text-slate-300 mb-1">
            Saturation Threshold
            <span className="text-blue-400">{config.satThreshold}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={config.satThreshold}
            onChange={(e) => handleChange('satThreshold', Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;