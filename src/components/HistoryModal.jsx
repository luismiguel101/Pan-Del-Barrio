import React, { useState, useEffect } from 'react';
import { X, Calendar, Trophy, Sunrise, Sunset, FileText, CheckCircle2 } from 'lucide-react';
import { fetchHistory } from '../lib/supabase';

export function HistoryModal({ isOpen, onClose }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchHistory().then(data => {
        setHistoryList(data || []);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-stone-200 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-stone-900">
                Histórico de Cierres Diarios
              </h3>
              <p className="text-xs text-stone-500">
                Registros de cumplimiento operativo guardados por fecha
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="py-12 text-center text-xs font-semibold text-stone-400">
              Cargando historial de cierres...
            </div>
          ) : historyList.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Calendar className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-stone-700">No hay cierres registrados aún</p>
              <p className="text-xs text-stone-400">
                Los registros se crearán automáticamente al ejecutar el "Reset Diario".
              </p>
            </div>
          ) : (
            historyList.map((item) => (
              <div 
                key={item.id}
                className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200/80 space-y-3 hover:border-amber-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold font-heading text-stone-900 text-sm capitalize">
                      📅 {new Date(item.snapshot_date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    item.completion_percentage >= 90
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : item.completion_percentage >= 70
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {item.completion_percentage}% Cumplido
                  </span>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center bg-white p-2.5 rounded-xl border border-stone-200/60 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold block uppercase">Total Tareas</span>
                    <span className="font-bold text-stone-900">{item.completed_tasks} / {item.total_tasks}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-600 font-bold block uppercase flex items-center justify-center gap-1">
                      <Sunrise className="w-3 h-3" /> Mañana
                    </span>
                    <span className="font-bold text-stone-900">{item.morning_completion_pct}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-orange-600 font-bold block uppercase flex items-center justify-center gap-1">
                      <Sunset className="w-3 h-3" /> Tarde
                    </span>
                    <span className="font-bold text-stone-900">{item.afternoon_completion_pct}%</span>
                  </div>
                </div>

                {item.summary_notes && (
                  <p className="text-xs text-stone-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 italic">
                    "{item.summary_notes}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 text-amber-400 text-xs font-bold rounded-xl"
          >
            Cerrar Histórico
          </button>
        </div>

      </div>
    </div>
  );
}
