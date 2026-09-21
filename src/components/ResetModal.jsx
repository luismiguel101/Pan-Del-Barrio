import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';

export function ResetModal({ isOpen, onClose, onConfirmReset }) {
  const [notes, setNotes] = useState('Cierre de jornada manual concluido con éxito.');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleExecute = async () => {
    setIsProcessing(true);
    await onConfirmReset(notes);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2 text-rose-700">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-heading text-stone-900">
              Cierre de Jornada y Reset Diario
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">
                ¿Estás segura de ejecutar el cierre de la jornada?
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                <li>Se guardará un resumen histórico del día actual (% de cumplimiento).</li>
                <li>Todas las tareas activas volverán al estado <strong className="text-rose-600 font-bold">Pendiente (Rojo)</strong> para el siguiente día.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Notas / Observaciones del Cierre
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Jornada con alta venta de facturas. Pendiente reposición de harina."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={isProcessing}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-rose-600/20 active:scale-95 transition-all"
          >
            <RotateCcw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Guardando Cierre...' : 'Confirmar Cierre Diario'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
