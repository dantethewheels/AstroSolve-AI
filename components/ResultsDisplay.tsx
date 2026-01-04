
import React from 'react';
import type { PlateSolveResult } from '../types';
import { Spinner } from './Spinner';
import { ConstellationIcon, TelescopeIcon, MapPinIcon, InfoIcon } from './icons';

interface ResultsDisplayProps {
  isLoading: boolean;
  result: PlateSolveResult | null;
  error: string | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ isLoading, result, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Spinner />
        <p className="text-xl font-medium mt-4 text-indigo-300">Analyzing the cosmos...</p>
        <p className="text-gray-400 mt-1">This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-red-400">
        <XCircleIcon className="w-16 h-16" />
        <p className="text-xl font-bold mt-4">Analysis Failed</p>
        <p className="text-red-300 mt-1 max-w-sm">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <TelescopeIcon className="w-16 h-16" />
        <p className="text-xl font-medium mt-4">Awaiting Image</p>
        <p className="mt-1 max-w-sm">Upload an astronomical image and click "Solve Plate" to see the AI's analysis here.</p>
      </div>
    );
  }
  
  const ResultItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-indigo-400 mt-1">{icon}</div>
        <div>
            <p className="text-sm text-indigo-300 font-medium">{label}</p>
            <p className="text-lg text-white font-bold">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6 border-b-2 border-indigo-500/50 pb-2">AI Analysis Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6">
            <ResultItem icon={<MapPinIcon className="w-6 h-6" />} label="Right Ascension (RA)" value={result.ra} />
            <ResultItem icon={<MapPinIcon className="w-6 h-6" />} label="Declination (DEC)" value={result.dec} />
            <ResultItem icon={<TelescopeIcon className="w-6 h-6" />} label="Field of View (FOV)" value={result.fov} />
            <ResultItem icon={<ConstellationIcon className="w-6 h-6" />} label="Constellation" value={result.constellation} />
        </div>
        
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">Identified Objects</h3>
            <ul className="flex flex-wrap gap-2">
                {result.objects.map((obj, index) => (
                    <li key={index} className="bg-indigo-500/20 text-indigo-200 text-sm font-medium px-3 py-1 rounded-full">
                        {obj}
                    </li>
                ))}
            </ul>
        </div>
        
        <div>
            <h3 className="text-lg font-semibold text-indigo-300 mb-2 flex items-center gap-2"><InfoIcon className="w-5 h-5"/> Summary</h3>
            <p className="text-gray-300 leading-relaxed bg-black/20 p-4 rounded-md">{result.summary}</p>
        </div>
    </div>
  );
};


const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
