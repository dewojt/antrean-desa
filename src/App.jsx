import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Kiosk from './pages/Kiosk';
import Operator from './pages/Operator';
import Display from './pages/Display';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Atur rute halaman di sini */}
        <Route path="/" element={
          <div className="p-10 text-center">
            <h1 className="text-3xl font-bold mb-4">Sistem Antrean Desa</h1>
            <div className="flex gap-4 justify-center mt-8">
              <a href="/kiosk" className="p-4 bg-blue-500 text-white rounded">Buka Kiosk (Pengunjung)</a>
              <a href="/operator" className="p-4 bg-green-500 text-white rounded">Buka Operator (Petugas)</a>
              <a href="/display" className="p-4 bg-gray-800 text-white rounded">Buka Display (TV)</a>
            </div>
          </div>
        } />
        <Route path="/kiosk" element={<Kiosk />} />
        <Route path="/operator" element={<Operator />} />
        <Route path="/display" element={<Display />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;