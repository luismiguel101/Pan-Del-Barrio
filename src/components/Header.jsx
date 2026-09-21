import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  RotateCcw, 
  History, 
  Database, 
  Download, 
  Lock,
  LogOut,
  Calendar
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export function Header({ 
  currentRole, 
  isAdminAuthenticated,
  onRoleChange, 
  onLogoutAdmin,
  onOpenResetModal, 
  onOpenHistoryModal, 
  onOpenConfigModal 
}) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const todayFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-[#FAF0E6]/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand with Official Bakery Logo Image */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md shadow-amber-900/10 shrink-0 bg-[#FCE3CD] flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Pan del Barrio Logo" 
                  className="w-full h-full object-cover transform scale-105"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-[#3D2214] tracking-tight">
                    Pan del Barrio
                  </h1>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 border border-amber-300">
                    PWA Est. 2020
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-900/70 font-semibold capitalize">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>{todayFormatted}</span>
                </div>
              </div>
            </div>

            {/* Mobile PWA Install button */}
            {deferredPrompt && (
              <button
                onClick={handleInstallPWA}
                className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-700 text-white text-xs font-semibold shadow-xs hover:bg-amber-800"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar</span>
              </button>
            )}
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex items-center justify-center w-full md:w-auto bg-[#EED8C5]/80 p-1.5 rounded-2xl border border-amber-300/40">
            <button
              onClick={() => onRoleChange('employee')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                currentRole === 'employee'
                  ? 'bg-white text-stone-900 shadow-sm border border-amber-200 scale-[1.02]'
                  : 'text-amber-950/70 hover:text-stone-900 hover:bg-white/40'
              }`}
            >
              <UserCheck className={`w-4 h-4 ${currentRole === 'employee' ? 'text-amber-700' : 'text-stone-400'}`} />
              <span>Modo Empleado</span>
            </button>

            <button
              onClick={() => onRoleChange('admin')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                currentRole === 'admin' && isAdminAuthenticated
                  ? 'bg-[#3D2214] text-amber-300 shadow-md shadow-stone-900/10 scale-[1.02]'
                  : 'text-amber-950/70 hover:text-stone-900 hover:bg-white/40'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${currentRole === 'admin' && isAdminAuthenticated ? 'text-amber-400' : 'text-stone-400'}`} />
              <span>Administrador</span>
              {!isAdminAuthenticated && <Lock className="w-3 h-3 text-amber-700 ml-0.5" />}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
            
            {/* Supabase status indicator */}
            <button
              onClick={onOpenConfigModal}
              title="Configurar Supabase"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-100/70 text-amber-900 border-amber-300 hover:bg-amber-200/70'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured ? 'Supabase Live' : 'Modo Local'}</span>
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-600'}`} />
            </button>

            {/* History button */}
            <button
              onClick={onOpenHistoryModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-200/80 text-stone-700 text-xs font-semibold shadow-xs hover:bg-amber-50/50"
            >
              <History className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Histórico</span>
            </button>

            {/* Admin Logout button if authenticated */}
            {currentRole === 'admin' && isAdminAuthenticated && (
              <button
                onClick={onLogoutAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-300"
                title="Bloquear Modo Administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salir Admin</span>
              </button>
            )}

            {/* Admin Daily Reset button */}
            {currentRole === 'admin' && isAdminAuthenticated && (
              <button
                onClick={onOpenResetModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs"
                title="Cierre de Jornada y Reinicio de Tareas"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Diario</span>
              </button>
            )}

            {/* Desktop PWA Install button */}
            {deferredPrompt && (
              <button
                onClick={handleInstallPWA}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-800 text-white text-xs font-semibold shadow-xs hover:bg-amber-900"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar PWA</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
