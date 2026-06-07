import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Display() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Listen ke antrean yang sedang dipanggil
    const q = query(collection(db, 'queues'), where('status', '==', 'called'), orderBy('calledAt', 'desc'), limit(4));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      if (data.length > 0) {
        const active = data[0];
        setCurrent(active);
        setHistory(data.slice(1)); // Sisa 3 antrean ke bawah

        // Trigger TTS jika audio aktif
        if (audioEnabled && active.calledAt) {
          speak(`Nomor antrean, ${active.ticket.split('').join(' ')}, silakan menuju, loket ${active.loket}`);
        }
      }
    });
    return () => unsubscribe();
  }, [audioEnabled]);

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'id-ID';
    speech.rate = 0.8; // Diperlambat sedikit agar jelas
    window.speechSynthesis.speak(speech);
  };

  if (!audioEnabled) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <button onClick={() => setAudioEnabled(true)} className="p-6 bg-red-600 rounded-2xl text-2xl font-bold animate-pulse">
          Aktifkan Layar & Suara
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-blue-50 flex flex-col p-8">
      <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl shadow-2xl mb-8">
        <h2 className="text-4xl text-gray-500 mb-4">Nomor Antrean</h2>
        <h1 className="text-9xl font-black text-blue-700 mb-4">{current?.ticket || '---'}</h1>
        <h2 className="text-5xl font-bold text-gray-800">Menuju Loket {current?.loket || '-'}</h2>
      </div>

      <div className="h-48 bg-gray-800 rounded-2xl p-6 text-white flex justify-around items-center">
        {history.map((item, idx) => (
          <div key={idx} className="text-center">
            <p className="text-gray-400">Riwayat {idx + 1}</p>
            <p className="text-4xl font-bold">{item.ticket}</p>
            <p className="text-xl">Loket {item.loket}</p>
          </div>
        ))}
      </div>
    </div>
  );
}