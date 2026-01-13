
import { GoogleGenAI, Type } from "@google/genai";
import { AfalRecord } from "../types";

export const analyzeAfalData = async (records: AfalRecord[]) => {
  if (records.length === 0) return "Belum ada data untuk dianalisis.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const dataSummary = records.map(r => 
    `- Produk: ${r.jenisProduk}, Momen: ${r.momen}, Jumlah: ${r.jumlah}, Jenis: ${r.keterangan}`
  ).join("\n");

  const prompt = `
    Saya adalah mahasiswa magang yang sedang menganalisis cacat kemasan (afal) di pabrik snack.
    Berikut adalah data sampling yang saya ambil di lapangan:
    
    ${dataSummary}
    
    Tugas kamu sebagai Senior QC Engineer:
    1. Identifikasi tren utama dari data tersebut.
    2. Berikan analisis akar penyebab (Root Cause) berdasarkan pola kemunculan afal.
    3. Berikan saran tindakan perbaikan (Corrective Action) yang praktis untuk operator mesin.
    4. Buat kesimpulan singkat apakah proses saat ini dalam batas wajar atau butuh penanganan segera.

    Jawab dalam Bahasa Indonesia dengan format yang rapi dan profesional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "Gagal mendapatkan analisis dari AI.";
  } catch (error) {
    console.error("AI Analysis error:", error);
    return "Terjadi kesalahan saat menghubungi server AI. Pastikan API_KEY tersedia.";
  }
};
