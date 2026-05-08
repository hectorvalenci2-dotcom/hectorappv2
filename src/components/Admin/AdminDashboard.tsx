import React, { useState, useEffect } from 'react';
import { AdminStats } from '../../types';
import { DuenosView } from './DuenosView';
import { FincasView } from './FincasView';
import { ProyeccionView } from './ProyeccionView';
import { SimuladorCosechaView } from './SimuladorCosechaView';
import { MasterProductionMatrix } from './MasterProductionMatrix';

interface AdminDashboardProps {
  stats: AdminStats | null;
  dashboardData: any[];
  allEnfunde: any[];
  token: string;
  apiUrl: string;
  onRefresh: () => void;
  onDeleteFinca?: (id: number) => Promise<boolean>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, dashboardData, allEnfunde, token, apiUrl, onRefresh, onDeleteFinca }) => {
  const [view, setView] = useState<'none' | 'duenos' | 'fincas' | 'proyeccion' | 'simulador' | 'matriz'>('none');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const getISOWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  const currentWeek = getISOWeek(new Date().toISOString());

  const renderContent = () => {
    switch (view) {
      case 'duenos': 
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="mb-3">
              <button className="btn btn-link text-dark text-decoration-none fw-bold p-0" onClick={() => setView('none')}>
                <i className="fa-solid fa-arrow-left me-2"></i> Volver al Menú
              </button>
            </div>
            <DuenosView onBack={() => setView('none')} token={token} apiUrl={apiUrl} />
          </div>
        );
      case 'fincas': 
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="mb-3">
              <button className="btn btn-link text-dark text-decoration-none fw-bold p-0" onClick={() => setView('none')}>
                <i className="fa-solid fa-arrow-left me-2"></i> Volver al Menú
              </button>
            </div>
            <FincasView onBack={() => setView('none')} token={token} apiUrl={apiUrl} onDeleteFinca={onDeleteFinca} />
          </div>
        );
      case 'proyeccion': 
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="mb-3">
              <button className="btn btn-link text-dark text-decoration-none fw-bold p-0" onClick={() => setView('none')}>
                <i className="fa-solid fa-arrow-left me-2"></i> Volver al Menú
              </button>
            </div>
            <ProyeccionView onBack={() => setView('none')} token={token} apiUrl={apiUrl} />
          </div>
        );
      case 'simulador': 
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="mb-3">
              <button className="btn btn-link text-dark text-decoration-none fw-bold p-0" onClick={() => setView('none')}>
                <i className="fa-solid fa-arrow-left me-2"></i> Volver al Menú
              </button>
            </div>
            <SimuladorCosechaView onBack={() => setView('none')} allEnfunde={allEnfunde} />
          </div>
        );
      case 'matriz': 
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="mb-3">
              <button className="btn btn-link text-dark text-decoration-none fw-bold p-0" onClick={() => setView('none')}>
                <i className="fa-solid fa-arrow-left me-2"></i> Volver al Menú
              </button>
            </div>
            <MasterProductionMatrix allEnfunde={allEnfunde} currentWeek={currentWeek} onRefresh={onRefresh} />
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 animate-in fade-in duration-500">
            <div 
              className="group cursor-pointer rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border border-slate-100 flex flex-col items-center justify-center p-8 text-center min-vh-20" 
              onClick={() => setView('duenos')}
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <i className="fa-solid fa-users text-2xl"></i>
              </div>
              <h5 className="text-slate-800 font-bold uppercase tracking-wider text-sm mb-2">Gestión de Dueños</h5>
              <div className="text-3xl font-black text-slate-900">{stats?.totalDuenos || 0}</div>
              <div className="text-slate-500 text-xs mt-1 font-medium">Usuarios Registrados</div>
            </div>

            <div 
              className="group cursor-pointer rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border border-slate-100 flex flex-col items-center justify-center p-8 text-center min-vh-20" 
              onClick={() => setView('fincas')}
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <i className="fa-solid fa-map-location-dot text-2xl"></i>
              </div>
              <h5 className="text-slate-800 font-bold uppercase tracking-wider text-sm mb-2">Control de Fincas</h5>
              <div className="text-3xl font-black text-slate-900">{stats?.totalFincas || 0}</div>
              <div className="text-slate-500 text-xs mt-1 font-medium">Fincas Activas</div>
            </div>

            <div 
              className="group cursor-pointer rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border border-slate-100 flex flex-col items-center justify-center p-8 text-center min-vh-20" 
              onClick={() => setView('proyeccion')}
            >
              <div className="w-16 h-16 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300">
                <i className="fa-solid fa-calendar-check text-2xl"></i>
              </div>
              <h5 className="text-slate-800 font-bold uppercase tracking-wider text-sm mb-2">Planificación por Fecha</h5>
              <div className="text-3xl font-black text-slate-900">
                <i className="fa-solid fa-magnifying-glass-chart"></i>
              </div>
              <div className="text-slate-500 text-xs mt-1 font-medium">Proyecciones de Corte</div>
            </div>

            <div 
              className="group cursor-pointer rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border border-slate-100 flex flex-col items-center justify-center p-8 text-center min-vh-20" 
              onClick={() => setView('simulador')}
            >
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                <i className="fa-solid fa-flask text-2xl"></i>
              </div>
              <h5 className="text-slate-800 font-bold uppercase tracking-wider text-sm mb-2">Simulador de Cosecha</h5>
              <div className="text-3xl font-black text-slate-900">
                <i className="fa-solid fa-calculator"></i>
              </div>
              <div className="text-slate-500 text-xs mt-1 font-medium">Cálculos de Producción</div>
            </div>

            <div 
              className="group cursor-pointer rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border border-slate-100 flex flex-col items-center justify-center p-8 text-center min-vh-20" 
              onClick={() => setView('matriz')}
            >
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <i className="fa-solid fa-table-cells text-2xl"></i>
              </div>
              <h5 className="text-slate-800 font-bold uppercase tracking-wider text-sm mb-2">Matriz de Control Maestro</h5>
              <div className="text-3xl font-black text-slate-900">
                <i className="fa-solid fa-calendar-days"></i>
              </div>
              <div className="text-slate-500 text-xs mt-1 font-medium">Resumen Semanal</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="admin-dashboard-view" className="container-fluid px-0">
      {renderContent()}
    </div>
  );
};
