
import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Search, SlidersHorizontal } from 'lucide-react';
import { AfalRecord } from '../types';

interface DataTableProps {
  records: AfalRecord[];
  onDelete: (id: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ records, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof AfalRecord>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredRecords = records
    .filter(r => 
      r.jenisProduk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.momen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.keterangan.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

  const toggleSort = (key: keyof AfalRecord) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const HeaderCell = ({ label, sortId }: { label: string, sortId?: keyof AfalRecord }) => (
    <th 
      onClick={() => sortId && toggleSort(sortId)}
      className={`px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider ${sortId ? 'cursor-pointer hover:bg-slate-100' : ''}`}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortId === sortKey && (
          sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari produk, momen, atau keterangan..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <SlidersHorizontal size={16} />
          Total: <span className="font-bold text-slate-800">{filteredRecords.length}</span> baris
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <HeaderCell label="Jam" sortId="jam" />
                <HeaderCell label="Hari" sortId="hari" />
                <HeaderCell label="Produk" sortId="jenisProduk" />
                <HeaderCell label="Momen" sortId="momen" />
                <HeaderCell label="Keterangan" sortId="keterangan" />
                <HeaderCell label="Jml" sortId="jumlah" />
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-slate-600">{r.jam}</td>
                  <td className="px-6 py-4 text-slate-600">{r.hari}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{r.jenisProduk}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                      {r.momen}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      r.keterangan === 'Nyacah' ? 'bg-red-50 text-red-700' :
                      r.keterangan === 'Berkerut' ? 'bg-orange-50 text-orange-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {r.keterangan}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{r.jumlah}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onDelete(r.id)}
                      className="p-1.5 text-slate-300 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                    Belum ada data terekam.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
