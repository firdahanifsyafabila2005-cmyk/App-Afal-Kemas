
import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  History, 
  BrainCircuit, 
  Download, 
  Package,
  Clock,
  LayoutDashboard,
  Settings2
} from 'lucide-react';
import { AfalRecord, ViewType, DEFAULT_MOMEN, DEFAULT_KETERANGAN } from './types';
import EntryForm from './components/EntryForm';
import DataTable from './components/DataTable';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import CategoryManager from './components/CategoryManager';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('entry');
  const [records, setRecords] = useState<AfalRecord[]>([]);
  const [momenOptions, setMomenOptions] = useState<string[]>(DEFAULT_MOMEN);
  const [keteranganOptions, setKeteranganOptions] = useState<string[]>(DEFAULT_KETERANGAN);

  // Load data from localStorage
  useEffect(() => {
    const savedRecords = localStorage.getItem('afal_records');
    const savedMomen = localStorage.getItem('afal_momen_opts');
    const savedKeterangan = localStorage.getItem('afal_keterangan_opts');

    if (savedRecords) setRecords(JSON.parse(savedRecords));
    if (savedMomen) setMomenOptions(JSON.parse(savedMomen));
    if (savedKeterangan) setKeteranganOptions(JSON.parse(savedKeterangan));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('afal_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('afal_momen_opts', JSON.stringify(momenOptions));
  }, [momenOptions]);

  useEffect(() => {
    localStorage.setItem('afal_keterangan_opts', JSON.stringify(keteranganOptions));
  }, [keteranganOptions]);

  const addRecord = (record: Omit<AfalRecord, 'id' | 'timestamp'>) => {
    const newRecord: AfalRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  const deleteRecord = (id: string) => {
    if (confirm('Hapus data ini?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const exportToCSV = () => {
    if (records.length === 0) return;
    const headers = ["Hari", "Shift", "Group", "Jam", "Mesin", "Produk", "Momen", "Jumlah", "Keterangan"];
    const rows = records.map(r => [
      r.hari, r.shift, r.group, r.jam, r.jumlahMesin, r.jenisProduk, r.momen, r.jumlah, r.keterangan
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `afal_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <nav className="w-full md:w-64 bg-slate-900 text-white md:sticky md:top-0 md:h-screen p-4 flex flex-col shadow-xl z-50">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Package size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">AfalTracker</h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">QC Packaging</p>
          </div>
        </div>

        <div className="flex-1 space-y-1.5">
          <NavItem active={view === 'entry'} onClick={() => setView('entry')} icon={<PlusCircle size={18} />} label="Input Data" />
          <NavItem active={view === 'history'} onClick={() => setView('history')} icon={<History size={18} />} label="Riwayat Data" />
          <NavItem active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem active={view === 'analysis'} onClick={() => setView('analysis')} icon={<BrainCircuit size={18} />} label="AI Analisis" />
          <NavItem active={view === 'settings'} onClick={() => setView('settings')} icon={<Settings2 size={18} />} label="Pengaturan" />
        </div>

        <div className="mt-auto pt-4 border-t border-slate-800 space-y-2">
          <button onClick={exportToCSV} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Download size={18} /> Export ke Excel
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {view === 'entry' && 'Input Sampling'}
              {view === 'history' && 'Database Afal'}
              {view === 'dashboard' && 'Statistik Visual'}
              {view === 'analysis' && 'Rekomendasi Ahli AI'}
              {view === 'settings' && 'Manajemen Kategori'}
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
            <Clock size={14} />
            {new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {view === 'entry' && <EntryForm onSubmit={addRecord} momenOptions={momenOptions} keteranganOptions={keteranganOptions} />}
          {view === 'history' && <DataTable records={records} onDelete={deleteRecord} />}
          {view === 'dashboard' && <Dashboard records={records} />}
          {view === 'analysis' && <Analysis records={records} />}
          {view === 'settings' && (
            <CategoryManager 
              momen={momenOptions} 
              setMomen={setMomenOptions} 
              keterangan={keteranganOptions} 
              setKeterangan={setKeteranganOptions} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
    {icon} <span className="font-medium text-sm">{label}</span>
  </button>
);

export default App;
