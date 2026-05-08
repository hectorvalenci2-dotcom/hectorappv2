import React from 'react';
import { User } from '../../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm mb-8 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <i className="fa-solid fa-leaf"></i>
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">BananTrack</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs">
              <i className="fa-solid fa-user"></i>
            </div>
            <span className="text-sm font-semibold text-slate-700">{user.username}</span>
            <span className="px-2 py-0.5 bg-white text-[10px] font-black text-emerald-600 rounded-md border border-emerald-100 uppercase tracking-wider">
              {user.rol}
            </span>
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300" 
            onClick={onLogout}
          >
            <i className="fa-solid fa-sign-out-alt"></i>
            <span className="hidden xs:inline">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
