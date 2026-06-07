import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Operator() {
  const [loket, setLoket] = useState('1');
  const [waitingQueues, setWaitingQueues] = useState([]);
  const [currentCall, setCurrentCall] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'queues'), where('status', '==', 'waiting'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setWaitingQueues(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const panggilSelanjutnya = async () => {
    if (waitingQueues.length === 0) return alert('Tidak ada antrean.');
    const nextQueue = waitingQueues[0];
    
    await updateDoc(doc(db, 'queues', nextQueue.id), {
      status: 'called',
      loket: loket,
      calledAt: serverTimestamp()
    });
    setCurrentCall(nextQueue);
  };

  const panggilUlang = async () => {
    if (!currentCall) return;
    // Update timestamp agar trigger real-time di Display menyala lagi
    await updateDoc(doc(db, 'queues', currentCall.id), {
      calledAt: serverTimestamp() 
    });
  };

  const selesai = async () => {
    if (!currentCall) return;
    await updateDoc(doc(db, 'queues', currentCall.id), { status: 'finished' });
    setCurrentCall(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Petugas</h1>
      <select value={loket} onChange={(e) => setLoket(e.target.value)} className="p-2 border rounded mb-4">
        <option value="1">Loket 1</option>
        <option value="2">Loket 2</option>
        <option value="3">Loket 3</option>
      </select>

      <div className="flex gap-4 mb-8">
        <button onClick={panggilSelanjutnya} className="px-4 py-2 bg-green-600 text-white rounded">Panggil Selanjutnya</button>
        <button onClick={panggilUlang} className="px-4 py-2 bg-yellow-500 text-white rounded">Panggil Ulang</button>
        <button onClick={selesai} className="px-4 py-2 bg-gray-600 text-white rounded">Selesai</button>
      </div>

      <h2 className="text-xl">Antrean Menunggu: {waitingQueues.length}</h2>
    </div>
  );
}