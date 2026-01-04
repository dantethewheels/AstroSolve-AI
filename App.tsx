
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { solvePlate } from './services/geminiService';
import type { PlateSolveResult } from './types';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PlateSolveResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File | null) => {
    setImageFile(file);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove data:image/jpeg;base64,
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSolveClick = async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const imageData = await fileToBase64(imageFile);
      const mimeType = imageFile.type;
      const result = await solvePlate(imageData, mimeType);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 bg-gradient-to-br from-[#0c0a1d] via-[#100b28] to-[#04040a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <LogoIcon className="w-12 h-12 text-indigo-400" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white">AstroSolve AI</h1>
            <p className="text-indigo-300 text-sm sm:text-base">AI-Powered Astronomical Plate Solving</p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <ImageUploader onImageSelect={handleImageSelect} />
            <button
              onClick={handleSolveClick}
              disabled={!imageFile || isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg shadow-indigo-900/50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : "Solve Plate"}
            </button>
          </div>

          <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm border border-white/10 min-h-[300px]">
            <ResultsDisplay
              isLoading={isLoading}
              result={analysisResult}
              error={error}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
