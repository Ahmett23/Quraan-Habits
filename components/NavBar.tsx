
import React from 'react';
import { BookOpen, CheckSquare, Home, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout();
      navigate('/');
    }
  };

  const NavItem = ({ path, icon: Icon, label, action }: { path?: string, icon: any, label: string, action?: () => void }) => {
    const active = path ? location.pathname === path : false;
    return (
      <button 
        onClick={() => action ? action() : navigate(path!)} 
        className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${active ? 'bg-digri-500/10 -translate-y-2 shadow-lg shadow-digri-500/20' : 'hover:bg-digri-50'}`}
        title={label}
      >
        <div className={`absolute -bottom-6 w-1 h-1 rounded-full bg-digri-500 transition-all duration-300 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
        <Icon 
          size={24} 
          className={`transition-all duration-300 ${active ? 'text-digri-500 stroke-[2.5px]' : 'text-slate-400 hover:text-digri-400'}`} 
        />
      </button>
    );
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-200/50 rounded-full px-8 py-3 flex items-center gap-6 z-50">
      <NavItem path="/" icon={Home} label="Home" />
      <div className="w-px h-6 bg-slate-200"></div>
      <NavItem path="/app" icon={BookOpen} label="Quran" />
      <div className="w-px h-6 bg-slate-200"></div>
      <NavItem path="/app/habits" icon={CheckSquare} label="Habits" />
      <div className="w-px h-6 bg-slate-200"></div>
      <NavItem icon={LogOut} label="Logout" action={handleLogout} />
    </div>
  );
};

export default NavBar;
