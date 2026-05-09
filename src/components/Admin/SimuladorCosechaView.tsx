import React, { useState, useMemo } from 'react';
import { RegistroEnfundeDetalle } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface SimuladorCosechaViewProps {
  onBack: () => void;
  allEnfunde: RegistroEnfundeDetalle[];
  resolveOwner?: (id?: number, nombre?: string) => string;
}

export const SimuladorCosechaView: React.FC<SimuladorCosechaViewProps> = ({ onBack, allEnfunde, resolveOwner }) => {
  console.log('SimuladorCosechaView rendered with', allEnfunde.length, 'records');
  const [fechaReferencia, setFechaReferencia] = useState(new Date().toISOString().split('T')[0]);
  const [semanasCalibre, setSemanasCalibre] = useState(11);
  const [pesoCaja, setPesoCaja] = useState(20);
  const [pesosFinca, setPesosFinca] = useState<Record<string, number>>({});

  const getISOWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  const semanaReferencia = useMemo(() => getISOWeek(fechaReferencia), [fechaReferencia]);

  const updatePesoFinca = (nombre: string, val: number) => {
    setPesosFinca(prev => ({ ...prev, [nombre]: val }));
  };

  const resultadoSimulacion = useMemo(() => {
    const lotes: any[] = [];
    let totalGeneral = 0;
    let totalCajasGeneral = 0;
    
    allEnfunde.forEach(r => {
      const semanaEnfunde = r.semana_iso || r.semana_enfunde || 0;
      let semanaCosechaProyectada = semanaEnfunde + semanasCalibre;
      
      // Ajustar ciclo 52 semanas
      while (semanaCosechaProyectada > 52) semanaCosechaProyectada -= 52;
      
      if (semanaCosechaProyectada === semanaReferencia) {
        const pendiente = (r.cantidad_registrada || r.cantidad_racimos || 0) - (r.cantidad_cosechada || 0);
        if (pendiente > 0) {
          const pRacimo = pesosFinca[r.finca_nombre] || 20;
          const cajas = (pendiente * pRacimo) / (pesoCaja || 20);
          
          lotes.push({
            finca: r.finca_nombre,
            dueno: resolveOwner ? resolveOwner(r.finca_id, r.finca_nombre) : r.dueno_username,
            fecha_registro: r.fecha_registro,
            semana_registro: semanaEnfunde,
            cantidad_proyectada: r.cantidad_registrada || r.cantidad_racimos || 0,
            pendiente: pendiente,
            pesoRacimo: pRacimo,
            cajas: cajas
          });
          totalGeneral += pendiente;
          totalCajasGeneral += cajas;
        }
      }
    });

    return {
      totalGeneral,
      totalCajasGeneral,
      lotes: lotes.sort((a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime())
    };
  }, [allEnfunde, semanasCalibre, semanaReferencia, pesosFinca, pesoCaja, resolveOwner]);

  return (
    <div id="admin-simulador-view">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4><i className="fa-solid fa-boxes-stacked text-warning"></i> Trazabilidad de Cosecha (Calibre)</h4>
        <button className="btn btn-outline-secondary" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Volver
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body bg-light">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-bold">Fecha de Referencia (Corte)</label>
              <input 
                type="date" 
                className="form-control" 
                value={fechaReferencia}
                onChange={(e) => setFechaReferencia(e.target.value)}
              />
              <small className="text-muted">Semana: <strong>{semanaReferencia}</strong></small>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Semanas Calibre</label>
              <div className="input-group input-group-sm">
                <input 
                  type="number" 
                  className="form-control" 
                  value={semanasCalibre}
                  onChange={(e) => setSemanasCalibre(parseInt(e.target.value) || 0)}
                  min="1"
                  max="20"
                />
                <span className="input-group-text">sem</span>
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Peso Caja Estándar (kg)</label>
              <div className="input-group input-group-sm">
                <input 
                  type="number" 
                  className="form-control" 
                  value={pesoCaja}
                  onChange={(e) => setPesoCaja(parseFloat(e.target.value) || 0)}
                  min="1"
                />
                <span className="input-group-text">kg</span>
              </div>
            </div>
            <div className="col-md-3 d-flex gap-2">
              <div className="bg-white p-2 rounded border flex-grow-1 text-center">
                <span className="text-muted x-small d-block">Total Racimos</span>
                <span className="h5 mb-0 fw-bold text-success">{resultadoSimulacion.totalGeneral}</span>
              </div>
              <div className="bg-primary text-white p-2 rounded border flex-grow-1 text-center">
                <span className="text-white small opacity-75 d-block" style={{ fontSize: '10px' }}>Total Cajas</span>
                <span className="h5 mb-0 fw-bold">{Math.round(resultadoSimulacion.totalCajasGeneral)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Simulación por Finca (Semana {semanaReferencia})</h5>
          <span className="badge bg-primary text-uppercase">{resultadoSimulacion.lotes.length} Registros</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Finca / Dueño</th>
                  <th>Registro [Sem]</th>
                  <th className="text-center">Cant. Proyectada</th>
                  <th className="text-center">Saldo</th>
                  <th className="text-center" style={{ width: '150px' }}>Peso Racimo (kg)</th>
                  <th className="text-end text-primary">Cajas Estimadas</th>
                </tr>
              </thead>
              <tbody>
                {resultadoSimulacion.lotes.map((l, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="fw-bold">{l.finca}</div>
                      <div className="text-muted small">{l.dueno}</div>
                    </td>
                    <td>
                      <div>{formatDate(l.fecha_registro)}</div>
                      <div className="badge bg-secondary opacity-75">Sem {l.semana_registro}</div>
                    </td>
                    <td className="text-center">{l.cantidad_proyectada}</td>
                    <td className="text-center text-success fw-bold">{l.pendiente}</td>
                    <td className="text-center">
                      <input 
                        type="range" 
                        min="18" 
                        max="23" 
                        step="0.5"
                        className="form-range"
                        value={l.pesoRacimo}
                        onChange={(e) => updatePesoFinca(l.finca, parseFloat(e.target.value))}
                      />
                      <div className="small fw-bold">{l.pesoRacimo} kg</div>
                    </td>
                    <td className="text-end text-primary fw-black fs-5">
                      {l.cajas.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
                {resultadoSimulacion.lotes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      <i className="fa-solid fa-circle-info fa-2x mb-2 d-block"></i>
                      No hay lotes proyectados para la Semana {semanaReferencia} con {semanasCalibre} semanas de calibre.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
