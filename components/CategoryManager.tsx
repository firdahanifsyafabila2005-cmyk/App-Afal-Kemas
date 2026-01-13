
import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, Pencil, Check, X } from 'lucide-react';
import { DEFAULT_MOMEN, DEFAULT_KETERANGAN } from '../types';

interface CategoryManagerProps {
  momen: string[];
  setMomen: (val: string[]) => void;
  keterangan: string[];
  setKeterangan: (val: string[]) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ momen, setMomen, keterangan, setKeterangan }) => {
  const [newMomen, setNewMomen] = useState('');
  const [newKeterangan, setNewKeterangan] = useState('');
  
  // State for inline editing
  const [editingId, setEditingId] = useState<{ section: 'momen' | 'keterangan', index: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  const addItem = (list: string[], setList: (v: string[]) => void, item: string, setItem: (v: string) => void) => {
    if (item.trim() && !list.includes(item.trim())) {
      setList([...list, item.trim()]);
      setItem('');
    }
  };

  const removeItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (confirm(`Hapus kategori "${item}"?`)) {
      setList(list.filter(i => i !== item));
    }
  };

  const startEditing = (section: 'momen' | 'keterangan', index: number, value: string) => {
    setEditingId({ section, index });
    setEditValue(value);
  };

  const saveEdit = (list: string[], setList: (v: string[]) => void) => {
    if (editingId && editValue.trim()) {
      const newList = [...list];
      newList[editingId.index] = editValue.trim();
      setList(newList);
      setEditingId(null);
    }
  };

  const resetToDefault = () => {
    if (confirm('Kembalikan semua kategori ke pengaturan awal? Ini akan menghapus kategori kustom Anda.')) {
      setMomen(DEFAULT_MOMEN);
      setKeterangan(DEFAULT_KETERANGAN);
      setEditingId(null);
    }
  };

  const Section = ({ title, items, setList, newItem, setNewItem, placeholder, sectionId }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
        {title}
        <span className="text-xs font-normal text-slate-400">{items.length} item</span>
      </h3>
      
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder={placeholder}
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem(items, setList, newItem, setNewItem)}
          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={() => addItem(items, setList, newItem, setNewItem)}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {items.map((item: string, idx: number) => (
          <div key={`${sectionId}-${idx}`} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg group border border-transparent hover:border-slate-200 transition-all">
            {editingId?.section === sectionId && editingId?.index === idx ? (
              <div className="flex items-center gap-2 w-full">
                <input 
                  autoFocus
                  className="flex-1 px-2 py-1 text-sm border border-blue-400 rounded outline-none focus:ring-1 focus:ring-blue-500"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveEdit(items, setList);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
                <button onClick={() => saveEdit(items, setList)} className="text-emerald-600 p-1 hover:bg-emerald-50 rounded">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-slate-400 p-1 hover:bg-slate-100 rounded">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm text-slate-700 truncate mr-2">{item}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEditing(sectionId, idx, item)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit nama"
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    onClick={() => removeItem(items, setList, item)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm italic">
            Belum ada kategori ditambahkan.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div>
          <h4 className="text-sm font-bold text-blue-800">Kustomisasi Lapangan</h4>
          <p className="text-xs text-blue-600">Edit kategori untuk memperbaiki typo atau menyesuaikan dengan kondisi mesin terbaru.</p>
        </div>
        <button 
          onClick={resetToDefault}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-red-600 border border-slate-200 bg-white rounded-lg transition-all shadow-sm active:scale-95"
        >
          <RotateCcw size={14} /> RESET KE DEFAULT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section 
          title="Kategori Momen" 
          sectionId="momen"
          items={momen} 
          setList={setMomen} 
          newItem={newMomen} 
          setNewItem={setNewMomen}
          placeholder="Tambah momen baru..."
        />
        <Section 
          title="Jenis Afal (Keterangan)" 
          sectionId="keterangan"
          items={keterangan} 
          setList={setKeterangan} 
          newItem={newKeterangan} 
          setNewItem={setNewKeterangan}
          placeholder="Tambah jenis afal baru..."
        />
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default CategoryManager;
