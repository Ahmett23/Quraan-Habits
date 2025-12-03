import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import QuranHome from './pages/QuranHome';
import QuranReader from './pages/QuranReader';
import HabitTracker from './pages/HabitTracker';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen">
        <Routes>
          <Route path="/" element={<><QuranHome /><NavBar /></>} />
          <Route path="/read/:id" element={<QuranReader />} />
          <Route path="/habits" element={<><HabitTracker /><NavBar /></>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;