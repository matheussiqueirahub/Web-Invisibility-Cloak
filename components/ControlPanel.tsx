import React from 'react';
import { ProcessingConfig } from '../types';
import { hexToRgb, rgbToHsl, hslToHex } from '../utils/colorUtils';

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

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const { r, g, b } = hexToRgb(hex);
    const { h } = rgbToHsl(r, g, b);
    handleChange('targetHue', h);
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
          <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
            Target Color
            <span className="text-blue-400">{Math.round(config.targetHue)}°</span>
          </label>
          <div className="flex items-center gap-2">
            <input
                type="color"
                value={hslToHex(config.targetHue, 100, 50)}
                onChange={handleColorChange}
                className="h-10 w-full cursor-pointer rounded-lg bg-slate-700 border border-slate-600 p-1"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Click to pick the color you want to make invisible.
          </p>
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium text-slate-300 mb-1">
            Hue Tolerance (Sensitivity)
            <span className="text-blue-400">±{config.hueThreshold}</span>
          </label>
          <input
            type="range"
            min="5"
            max="90"
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

        <div>
          <label className="flex justify-between text-sm font-medium text-slate-300 mb-1">
            Brightness Threshold
            <span className="text-blue-400">{config.valThreshold}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={config.valThreshold}
            onChange={(e) => handleChange('valThreshold', Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;