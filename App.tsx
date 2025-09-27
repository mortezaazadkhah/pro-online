
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Preview from './components/Preview';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { virtualTryOn, getStyleRecommendations } from './services/geminiService';
import type { ImageState, StyleRecommendation } from './types';
import { ArrowRightIcon, SparklesIcon, ShoeIcon, PerfumeIcon, CalendarIcon, AlertTriangleIcon } from './components/IconComponents';

// New Component for Style Recommendations
interface StyleRecommendationsProps {
  recommendations: StyleRecommendation[] | null;
  isLoading: boolean;
  error: string | null;
}

const StyleRecommendations: React.FC<StyleRecommendationsProps> = ({ recommendations, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mt-12 text-center">
        <div className="flex flex-col items-center text-gray-300">
          <svg className="animate-spin h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-semibold">در حال یافتن بهترین استایل‌ها برای شما...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mt-12 text-center bg-rose-900/30 border border-rose-700 rounded-lg p-6">
        <div className="flex flex-col items-center text-rose-300">
          <AlertTriangleIcon className="w-10 h-10 mb-3" />
          <h3 className="text-xl font-semibold">خطا در دریافت پیشنهادات</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mt-12 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400 flex items-center justify-center gap-3">
        <SparklesIcon className="w-8 h-8" />
        پیشنهادات استایل برای شما
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 flex flex-col gap-4 hover:border-indigo-600 hover:scale-[1.03] transition-all duration-300 backdrop-blur-sm shadow-lg">
            <p className="text-gray-200 leading-relaxed font-medium">{rec.outfitDescription}</p>
            <div className="border-t border-gray-700 mt-2 pt-4 flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3 text-gray-300">
                <CalendarIcon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span><strong className="text-gray-100">مناسبت:</strong> {rec.occasion}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <ShoeIcon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span><strong className="text-gray-100">کفش:</strong> {rec.shoeSuggestion}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <PerfumeIcon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span><strong className="text-gray-100">عطر:</strong> {rec.perfumeSuggestion}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [showPreview, setShowPreview] = useState(true);
  const [personImage, setPersonImage] = useState<ImageState>(null);
  const [clothingImage, setClothingImage] = useState<ImageState>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for recommendations
  const [styleRecommendations, setStyleRecommendations] = useState<StyleRecommendation[] | null>(null);
  const [isRecsLoading, setIsRecsLoading] = useState(false);
  const [recsError, setRecsError] = useState<string | null>(null);


  const handleTryOn = useCallback(async () => {
    if (!personImage || !clothingImage) {
      setError('لطفاً هر دو تصویر را بارگذاری کنید.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await virtualTryOn(personImage.base64, clothingImage.base64, personImage.mimeType, clothingImage.mimeType);
      setResultImage(result);
    } catch (err) {
      setError('خطایی در هنگام پردازش تصویر رخ داد. لطفاً دوباره تلاش کنید.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [personImage, clothingImage]);

  // New handler for recommendations
  const handleGetRecommendations = useCallback(async () => {
    if (!personImage) {
      setRecsError('برای دریافت پیشنهاد، ابتدا عکس خود را بارگذاری کنید.');
      return;
    }

    setIsRecsLoading(true);
    setRecsError(null);
    setStyleRecommendations(null);

    try {
      const recommendations = await getStyleRecommendations(personImage.base64, personImage.mimeType);
      setStyleRecommendations(recommendations);
    } catch (err) {
      setRecsError('خطایی در هنگام دریافت پیشنهادات رخ داد. لطفاً دوباره تلاش کنید.');
      console.error(err);
    } finally {
      setIsRecsLoading(false);
    }
  }, [personImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col relative overflow-hidden" dir="rtl">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/30 via-transparent to-rose-900/30 z-0"></div>
      
      <Header />
      
      <main className="flex-grow flex flex-col items-center p-4 md:p-8 z-10">
        <Preview isVisible={showPreview} onClose={() => setShowPreview(false)} />

        <div className="w-full max-w-6xl mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
            {/* Input Columns */}
            <ImageUploader
              id="person-uploader"
              title="۱. عکس خود را بارگذاری کنید"
              onImageSelect={setPersonImage}
            />
            
            <ImageUploader
              id="clothing-uploader"
              title="۲. عکس لباس را بارگذاری کنید"
              onImageSelect={setClothingImage}
            />

            {/* Result Column */}
            <div className="md:col-span-1 flex flex-col items-center justify-center h-full">
               <ResultDisplay image={resultImage} isLoading={isLoading} error={error} />
            </div>
          </div>
          
          <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleTryOn}
              disabled={!personImage || !clothingImage || isLoading}
              className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed overflow-hidden group w-full sm:w-auto"
            >
              {isLoading && <Loader />}
              <span className={`transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <span className="flex items-center">
                  <SparklesIcon className="w-6 h-6 mr-2 transition-transform duration-500 group-hover:rotate-12" />
                  پرو مجازی
                  <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-500 group-hover:-translate-x-1" />
                </span>
              </span>
            </button>
             <button
              onClick={handleGetRecommendations}
              disabled={!personImage || isRecsLoading}
              className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white transition-all duration-200 bg-rose-600 rounded-lg shadow-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-gray-500 disabled:cursor-not-allowed overflow-hidden group w-full sm:w-auto"
            >
              {isRecsLoading && <div className="absolute inset-0 flex items-center justify-center bg-rose-600/80"><div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div></div>}
              <span className={`transition-all duration-300 ${isRecsLoading ? 'opacity-0' : 'opacity-100'}`}>
                <span className="flex items-center">
                  <SparklesIcon className="w-6 h-6 mr-2 transition-transform duration-500 group-hover:rotate-12" />
                  دریافت پیشنهادات استایل
                </span>
              </span>
            </button>
          </div>
        </div>
        <StyleRecommendations 
          recommendations={styleRecommendations}
          isLoading={isRecsLoading}
          error={recsError}
        />
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm z-10 mt-auto">
        طراحی و توسعه Ai توسط مهندس مرتضی آزادخواه
      </footer>
    </div>
  );
};

export default App;
