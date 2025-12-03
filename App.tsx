
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import QuranHome from './pages/QuranHome';
import QuranReader from './pages/QuranReader';
import HabitTracker from './pages/HabitTracker';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected Routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <QuranHome />
                <NavBar />
              </ProtectedRoute>
            } />
            <Route path="/read/:id" element={
              <ProtectedRoute>
                <QuranReader />
              </ProtectedRoute>
            } />
            <Route path="/app/habits" element={
              <ProtectedRoute>
                <HabitTracker />
                <NavBar />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
