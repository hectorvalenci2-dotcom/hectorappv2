import React, { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, FlaskConical, Table, ArrowLeft, Search, Calculator, CalendarDays } from 'lucide-react';
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

  const BackButton = () => (
    <div className="mb-6">
      <button 
        className="group flex items-center gap-2 text-slate-600 hover:text-emerald-700 font-bold transition-colors" 
        onClick={() => setView('none')}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Volver al Menú Principal</span>
      </button>
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case 'duenos': 
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <BackButton />
            <DuenosView onBack={() => setView('none')} token={token} apiUrl={apiUrl} />
          </div>
        );
      case 'fincas': 
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <BackButton />
            <FincasView onBack={() => setView('none')} token={token} apiUrl={apiUrl} onDeleteFinca={onDeleteFinca} />
          </div>
        );
      case 'proyeccion': 
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <BackButton />
            <ProyeccionView onBack={() => setView('none')} token={token} apiUrl={apiUrl} />
          </div>
        );
      case 'simulador': 
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <BackButton />
            <SimuladorCosechaView onBack={() => setView('none')} allEnfunde={allEnfunde} />
          </div>
        );
      case 'matriz': 
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <BackButton />
            <MasterProductionMatrix allEnfunde={allEnfunde} currentWeek={currentWeek} onRefresh={onRefresh} />
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 animate-in fade-in duration-500">
            {/* Gestión de Dueños */}
            <div 
              className="group cursor-pointer rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white border border-slate-100 flex flex-col items-center justify-center p-10 text-center" 
              onClick={() => setView('duenos')}
            >
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                <Users className="w-10 h-10" />
              </div>
              <h5 className="text-slate-800 font-black uppercase tracking-tight text-base mb-3">Gestión de Dueños</h5>
              <div className="text-4xl font-black text-slate-900 mb-1">{stats?.totalDuenos || 0}</div>
              <p className="text-slate-500 text-sm font-semibold">Usuarios Registrados</p>
            </div>

            {/* Control de Fincas */}
            <div 
              className="group cursor-pointer rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white border border-slate-100 flex flex-col items-center justify-center p-10 text-center" 
              onClick={() => setView('fincas')}
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                <MapPin className="w-10 h-10" />
              </div>
              <h5 className="text-slate-800 font-black uppercase tracking-tight text-base mb-3">Control de Fincas</h5>
              <div className="text-4xl font-black text-slate-900 mb-1">{stats?.totalFincas || 0}</div>
              <p className="text-slate-500 text-sm font-semibold">Propiedades Activas</p>
            </div>

            {/* Planificación por Fecha */}
            <div 
              className="group cursor-pointer rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white border border-slate-100 flex flex-col items-center justify-center p-10 text-center" 
              onClick={() => setView('proyeccion')}
            >
              <div className="w-20 h-20 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                <Calendar className="w-10 h-10" />
              </div>
              <h5 className="text-slate-800 font-black uppercase tracking-tight text-base mb-3">Planificación por Fecha</h5>
              <div className="text-4xl font-black text-slate-900 mb-1">
                <Search className="w-10 h-10 mx-auto" />
              </div>
              <p className="text-slate-500 text-sm font-semibold">Proyecciones de Corte</p>
            </div>

            {/* Simulador de Cosecha */}
            <div 
              className="group cursor-pointer rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white border border-slate-100 flex flex-col items-center justify-center p-10 text-center" 
              onClick={() => setView('simulador')}
            >
              <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                <FlaskConical className="w-10 h-10" />
              </div>
              <h5 className="text-slate-800 font-black uppercase tracking-tight text-base mb-3">Simulador de Cosecha</h5>
              <div className="text-4xl font-black text-slate-900 mb-1">
                <Calculator className="w-10 h-10 mx-auto" />
              </div>
              <p className="text-slate-500 text-sm font-semibold">Cálculos de Producción</p>
            </div>

            {/* Matriz de Control Maestro */}
            <div 
              className="group cursor-pointer rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white border border-slate-100 flex flex-col items-center justify-center p-10 text-center" 
              onClick={() => setView('matriz')}
            >
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                <Table className="w-10 h-10" />
              </div>
              <h5 className="text-slate-800 font-black uppercase tracking-tight text-base mb-3">Matriz de Control Maestro</h5>
              <div className="text-4xl font-black text-slate-900 mb-1">
                <CalendarDays className="w-10 h-10 mx-auto" />
              </div>
              <p className="text-slate-500 text-sm font-semibold">Resumen Semanal</p>
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
