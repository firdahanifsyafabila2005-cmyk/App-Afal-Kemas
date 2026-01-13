
export interface AfalRecord {
  id: string;
  hari: number;
  shift: string;
  group: string;
  jam: string;
  jumlahMesin: number;
  jenisProduk: string;
  momen: string;
  jumlah: number;
  keterangan: string;
  timestamp: number;
}

export type ViewType = 'entry' | 'history' | 'dashboard' | 'analysis' | 'settings';

export const DEFAULT_MOMEN = [
  "Awal mesin jalan",
  "Setelah setting ulang",
  "Ganti Film",
  "Afal gabungan (kejadian umum)",
  "Mesin Trouble",
  "Lainnya"
];

export const DEFAULT_KETERANGAN = [
  "Bagian atas tidak ter-sealing",
  "Berkerut",
  "Bernoda",
  "Bocor",
  "EF sobek",
  "ES sobek",
  "Film ditarik",
  "Film lecek",
  "Ganti Film",
  "Kosong",
  "Meleset",
  "Melipat",
  "Nyacah",
  "OR under",
  "Over gramatur",
  "Potongan lari",
  "Sambungan operator",
  "Sambungan supplier",
  "Sealing jelek (putus-putus)",
  "Sobek",
  "Sulit disobek",
  "Tidak kena proses",
  "Under gramatur",
  "Lainnya"
];
