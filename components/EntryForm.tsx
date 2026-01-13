
import React, { useState } from 'react';
import { Send, Clock, Search } from 'lucide-react';
import { AfalRecord } from '../types';

interface EntryFormProps {
  onSubmit: (record: Omit<AfalRecord, 'id' | 'timestamp'>) => void;
  momenOptions: string[];
  keteranganOptions: string[];
}

const EntryForm: React.FC<EntryFormProps> = ({ onSubmit, momenOptions, keteranganOptions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    hari: 1,
    shift: '1',
    group: '',
    jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }),
    jumlahMesin: 1,
    jenisProduk: 'SUKRO ORI 16 gr',
    momen: momenOptions[0],
    jumlah: 1,
    keterangan: keteranganOptions[0]
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const filteredKeterangan = keteranganOptions.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
    setFormData(prev => ({ ...prev, jumlah: 1 }));
  };

  const inputClass = "w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl mx-auto">
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Form Sampling Lapangan</h3>
        {isSuccess && <span className="text-emerald-600 text-xs font-bold animate-bounce">Data Tersimpan!</span>}
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Sampling Hari Ke-</label>
            <input type="number" value={formData.hari} onChange={e => setFormData({...formData, hari: parseInt(e.target.value) || 1})} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Shift & Group</label>
            <div className="flex gap-2">
              <select value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})} className={inputClass}>
                <option value="1">S1</option><option value="2">S2</option><option value="3">S3</option>
              </select>
              <input placeholder="Gr" value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Jam</label>
            <input type="text" value={formData.jam} onChange={e => setFormData({...formData, jam: e.target.value})} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Mesin Jalan</label>
            <input type="number" value={formData.jumlahMesin} onChange={e => setFormData({...formData, jumlahMesin: parseInt(e.target.value) || 0})} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Produk</label>
            <input list="produk-list" value={formData.jenisProduk} onChange={e => setFormData({...formData, jenisProduk: e.target.value})} className={inputClass} />
            <datalist id="produk-list"><option value="SUKRO ORI 16 gr" /><option value="SUKRO BBQ 16 gr" /></datalist>
          </div>
          <div>
            <label className={labelClass}>Momen Afal</label>
            <select value={formData.momen} onChange={e => setFormData({...formData, momen: e.target.value})} className={inputClass}>
              {momenOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Jumlah (Bks)</label>
            <input type="number" value={formData.jumlah} onChange={e => setFormData({...formData, jumlah: parseInt(e.target.value) || 0})} className={`${inputClass} font-bold text-blue-600 text-base`} required />
          </div>
        </div>

        <div>
          <label className={labelClass}>Pilih Jenis Afal</label>
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Cari jenis afal..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 border border-slate-100 rounded-lg bg-slate-50/50">
            {filteredKeterangan.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setFormData({...formData, keterangan: opt})}
                className={`px-3 py-2 text-[11px] text-left font-medium rounded-lg border transition-all truncate ${
                  formData.keterangan === opt 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98]">
          SIMPAN DATA
        </button>
      </form>
    </div>
  );
};

export default EntryForm;
