import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react';

export function AdminPinModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === '1402') {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('Contraseña incorrecta. Solo personal de administración autorizado.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF0E6] rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-amber-200/80 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
          <div className="flex items-center gap-2 text-stone-900">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-heading text-stone-900">
              Acceso Administrador
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-600 font-medium">
          Ingresa la contraseña clave para gestionar la plantilla de tareas y cierres de jornada.
        </p>

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block text-center">
              Contraseña de Administración
            </label>
            <div className="relative max-w-[200px] mx-auto">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                maxLength={8}
                autoFocus
                required
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                className="w-full text-center pl-9 pr-4 py-3 bg-white border border-amber-300 rounded-2xl text-lg font-bold tracking-widest text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-100 text-rose-800 text-xs font-bold p-3 rounded-xl border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-200/60 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-amber-600/20 active:scale-95 transition-all"
            >
              Ingresar al Dashboard
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
