import React, { useState, useEffect } from 'react';
import { Finca } from '../../types';

interface FincaCardProps {
  finca: Finca;
  token: string;
  currentWeek: number;
  onSelect: (f: Finca) => void;
  onEdit: (f: Finca) => void;
  onHistorial: (f: Finca) => void;
  onDelete: (id: number) => void;
  apiUrl: string;
}

export const FincaCard: React.FC<FincaCardProps> = ({ finca, token, currentWeek, onSelect, onEdit, onHistorial, onDelete, apiUrl }) => {
  const [indicator, setIndicator] = useState<React.ReactNode>(<span className="text-muted small">Calculando...</span>);
  const [chronogram, setChronogram] = useState<any[]>([]);

  useEffect(() => {
    const fetchFincaData = async () => {
      try {
        // Fetch last enfunde for indicator
        const resInd = await fetch(`${apiUrl}/fincas/${finca.id}/last_enfunde`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const lastEnfunde = await resInd.json();
        
        if (lastEnfunde) {
          let weeksLeft = lastEnfunde.semana_cosecha_estimada - currentWeek;
          if (weeksLeft < 0) weeksLeft += 52;
          
          if (weeksLeft === 0) {
            setIndicator(<span className="badge bg-cosecha-lista shadow-sm">Cosecha esta semana</span>);
          } else {
            setIndicator(<span className="text-info small fw-bold">Cosecha en {weeksLeft} semanas</span>);
          }
        } else {
          setIndicator(<span className="text-muted small">Sin registros</span>);
        }

        // Fetch historial for chronogram
        const resHist = await fetch(`${apiUrl}/fincas/${finca.id}/historial`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const historial = await resHist.json();
        
        // Group by ISO week
        const groups: Record<number, { color: string, total: number }> = {};
        historial.forEach((r: any) => {
          const week = r.semana_iso || r.semana_enfunde || 0;
          if (!groups[week]) {
            groups[week] = { color: r.color_cinta, total: 0 };
          }
          groups[week].total += (r.cantidad_registrada || 0);
          // Keep the color of the most recent record in that week
          groups[week].color = r.color_cinta;
        });

        const sortedWeeks = Object.keys(groups).map(Number).sort((a, b) => a - b).slice(-8);
        setChronogram(sortedWeeks.map(w => ({ week: w, ...groups[w] })));

      } catch (e) {
        setIndicator(<span className="text-danger small">Error</span>);
      }
    };
    fetchFincaData();
  }, [finca.id, token, currentWeek, apiUrl]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de que deseas eliminar la finca "${finca.nombre}"? Se borrarán todos sus registros asociados de forma permanente.`)) {
      onDelete(finca.id);
    }
  };

  return (
    <div 
      className="card h-100 border-0 shadow-sm rounded-2xl hover:shadow-xl transition-all duration-300 card-hover-effect overflow-hidden bg-white" 
      style={{ cursor: 'pointer' }} 
      onClick={() => onSelect(finca)}
    >
      <div className="card-body p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h5 className="font-bold text-emerald-700 text-lg mb-0">{finca.nombre}</h5>
          <div className="flex gap-1">
            <button 
              className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" 
              onClick={(e) => { e.stopPropagation(); onEdit(finca); }}
              title="Editar finca"
            >
              <i className="fa-solid fa-edit"></i>
            </button>
            <button 
              className="p-2 text-slate-400 hover:text-rose-600 transition-colors" 
              onClick={handleDelete}
              title="Eliminar finca"
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
        <p className="text-slate-500 text-sm mb-4 flex items-center gap-2">
          <i className="fa-solid fa-location-dot text-emerald-500"></i> {finca.ubicacion || 'Sin ubicación'}
        </p>
        
        <div className="mb-4">
          <div className="flex gap-1.5 flex-wrap">
            {chronogram.map((c, i) => (
              <div 
                key={i} 
                className={`color-dot bg-${c.color.toLowerCase().replace('é', 'e')} flex items-center justify-center text-[10px] font-bold shadow-sm`} 
                title={`Semana ${c.week}: ${c.total} racimos (${c.color})`}
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '6px', 
                  border: '1px solid rgba(0,0,0,0.05)',
                  color: ['Blanco', 'Amarilla'].includes(c.color) ? 'black' : 'white',
                  cursor: 'help'
                }}
              >
                {c.week}
              </div>
            ))}
            {chronogram.length === 0 && <span className="text-slate-400 italic text-xs">Sin registros recientes</span>}
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200">
            {finca.total_racimos || 0} racimos
          </span>
          <div>{indicator}</div>
        </div>
        
        <div className="mt-4">
          <button 
            className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2" 
            onClick={(e) => { e.stopPropagation(); onHistorial(finca); }}
          >
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span>Historial Completo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
