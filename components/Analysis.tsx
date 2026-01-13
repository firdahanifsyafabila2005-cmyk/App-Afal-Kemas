
import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Loader2 } from 'lucide-react';
import { AfalRecord } from '../types';
import { analyzeAfalData } from '../services/geminiService';

interface AnalysisProps {
  records: AfalRecord[];
}

const Analysis: React.FC<AnalysisProps> = ({ records }) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const analysis = await analyzeAfalData(records);
    setResult(analysis);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
            <BrainCircuit size={48} className="text-blue-100" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Analisis Rekomendasi AI</h3>
            <p className="text-indigo-100 mb-6">
              Gunakan kecerdasan buatan untuk mengidentifikasi pola tersembunyi dari data afal sampling Anda. 
              Dapatkan saran profesional untuk laporan magang Anda.
            </p>
            <button
              onClick={handleAnalyze}
              disabled={loading || records.length === 0}
              className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 mx-auto md:mx-0 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Mulai Analisis Sekarang
            </button>
            {records.length === 0 && (
              <p className="mt-2 text-xs text-indigo-200">Tambahkan data sampling terlebih dahulu.</p>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="prose prose-slate max-w-none">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Sparkles className="text-blue-600" size={24} />
              <h4 className="text-xl font-bold text-slate-800 m-0">Hasil Analisis Ahli (AI)</h4>
            </div>
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <p>Dianalisis menggunakan Gemini AI v3 Flash</p>
            <button 
              onClick={() => window.print()}
              className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            >
              Cetak Analisis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
