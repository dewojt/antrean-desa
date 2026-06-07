import { useState } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function Kiosk() {
  const [loading, setLoading] = useState(false);

  const menus = [
    { id: 'A', title: 'Antrean Pembuatan Surat Umum' },
    { id: 'B', title: 'Antrean Jual Beli Tanah' },
    { id: 'C', title: 'Layanan C (Placeholder)' },
    { id: 'D', title: 'Layanan D (Placeholder)' },
  ];

  const generateTicket = async (prefix) => {
    setLoading(true);
    try {
      // Logic sederhana: Hitung jumlah antrean hari ini untuk prefix tersebut
      const qRef = collection(db, 'queues');
      // Catatan: Di produksi, gunakan tanggal untuk filter nomor urut per hari
      const snapshot = await getDocs(qRef); 
      const currentCount = snapshot.size + 1; 
      const ticketNumber = `${prefix}${String(currentCount).padStart(2, '0')}`;

      await addDoc(qRef, {
        ticket: ticketNumber,
        status: 'waiting', // waiting, called, finished
        loket: null,
        createdAt: serverTimestamp(),
        calledAt: null
      });

      alert(`Nomor Antrean Anda: ${ticketNumber}\nSilakan tunggu panggilan.`);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil nomor antrean.");
    }
    setLoading(false);
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-8">Ambil Nomor Antrean</h1>
      <div className="grid grid-cols-2 gap-4">
        {menus.map((menu) => (
          <button 
            key={menu.id}
            disabled={loading}
            onClick={() => generateTicket(menu.id)}
            className="p-8 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 text-xl font-semibold"
          >
            {menu.title}
          </button>
        ))}
      </div>
    </div>
  );
}