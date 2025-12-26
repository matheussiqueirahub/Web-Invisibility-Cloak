import React, { useState } from 'react';
import { analyzeScene, explainTechnology } from '../services/geminiService';

interface AssistantProps {
  backgroundImage: string | null;
}

const Assistant: React.FC<AssistantProps> = ({ backgroundImage }) => {
  const [response, setResponse] = useState<string>("Hello! Capture a background, then I can analyze your scene for the magic trick!");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!backgroundImage) {
        setResponse("Please capture a background first so I can see the room!");
        return;
    }
    setLoading(true);
    setResponse("Analyzing the environment...");
    const result = await analyzeScene(backgroundImage);
    setResponse(result);
    setLoading(false);
  };

  const handleExplain = async () => {
    setLoading(true);
    setResponse("Retrieving technical data...");
    const result = await explainTechnology();
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-600 rounded-lg">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
           </svg>
        </div>
        <h3 className="text-lg font-bold text-white">Vision Assistant</h3>
      </div>

      <div className="flex-1 bg-slate-800 rounded-lg p-4 mb-4 overflow-y-auto min-h-[150px] shadow-inner">
        <p className={`text-slate-200 leading-relaxed ${loading ? 'animate-pulse' : ''}`}>
            {response}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleAnalyze}
          disabled={loading || !backgroundImage}
          className="py-2 px-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          Analyze Scene
        </button>
        <button
          onClick={handleExplain}
          disabled={loading}
          className="py-2 px-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          How it works?
        </button>
      </div>
    </div>
  );
};

export default Assistant;