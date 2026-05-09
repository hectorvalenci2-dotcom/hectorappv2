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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 animate-in fade-in zoom-in duration-500">
            {/* Gestión de Dueños */}
            <button 
              className="group relative bg-white p-8 rounded-3xl shadow-2xl hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-4 transition-all duration-500 border border-slate-50 text-center overflow-hidden" 
              onClick={() => setView('duenos')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-blue-600 transition-colors duration-500 opacity-20 group-hover:opacity-100"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Gestión de Dueños</h3>
                <div className="text-4xl font-black text-blue-600 mb-2">{stats?.totalDuenos || 0}</div>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Productores Activos</p>
              </div>
            </button>

            {/* Control de Fincas */}
            <button 
              className="group relative bg-white p-8 rounded-3xl shadow-2xl hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-4 transition-all duration-500 border border-slate-50 text-center overflow-hidden" 
              onClick={() => setView('fincas')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-emerald-600 transition-colors duration-500 opacity-20 group-hover:opacity-100"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-200 group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Control de Fincas</h3>
                <div className="text-4xl font-black text-emerald-600 mb-2">{stats?.totalFincas || 0}</div>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Hectáreas en Control</p>
              </div>
            </button>

            {/* Planificación */}
            <button 
              className="group relative bg-white p-8 rounded-3xl shadow-2xl hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-4 transition-all duration-500 border border-slate-50 text-center overflow-hidden" 
              onClick={() => setView('proyeccion')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-cyan-600 transition-colors duration-500 opacity-20 group-hover:opacity-100"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-cyan-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-cyan-200 group-hover:scale-110 transition-transform duration-500">
                  <Calendar className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Planificación</h3>
                <div className="text-4xl font-black text-cyan-600 mb-2"><Search className="w-10 h-10 inline" /></div>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Por Rango de Fechas</p>
              </div>
            </button>

            {/* Simulador */}
            <button 
              className="group relative bg-white p-8 rounded-3xl shadow-2xl hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-4 transition-all duration-500 border border-slate-50 text-center overflow-hidden" 
              onClick={() => setView('simulador')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-amber-600 transition-colors duration-500 opacity-20 group-hover:opacity-100"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-amber-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-amber-200 group-hover:scale-110 transition-transform duration-500">
                  <FlaskConical className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Simulador</h3>
                <div className="text-4xl font-black text-amber-600 mb-2"><Calculator className="w-10 h-10 inline" /></div>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Cosecha Estimada</p>
              </div>
            </button>

            {/* Matriz Maestro */}
            <button 
              className="group relative bg-white p-8 rounded-3xl shadow-2xl hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-4 transition-all duration-500 border border-slate-50 text-center overflow-hidden lg:col-span-1" 
              onClick={() => setView('matriz')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-indigo-600 transition-colors duration-500 opacity-20 group-hover:opacity-100"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform duration-500">
                  <Table className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Matriz Maestra</h3>
                <div className="text-4xl font-black text-indigo-600 mb-2"><CalendarDays className="w-10 h-10 inline" /></div>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Control de Producción</p>
              </div>
            </button>
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
