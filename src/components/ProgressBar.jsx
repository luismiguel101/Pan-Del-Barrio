import React from 'react';
import { Sunrise, Sunset, CheckCircle2, Clock, Trophy } from 'lucide-react';

export function ProgressBar({ tasks = [], selectedShift = 'todos' }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completada').length;
  const pending = total - completed;
  const overallPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Shift metrics
  const mananaTasks = tasks.filter(t => t.shift === 'manana');
  const mananaCompleted = mananaTasks.filter(t => t.status === 'completada').length;
  const mananaPercentage = mananaTasks.length > 0 ? Math.round((mananaCompleted / mananaTasks.length) * 100) : 0;

  const tardeTasks = tasks.filter(t => t.shift === 'tarde');
  const tardeCompleted = tardeTasks.filter(t => t.status === 'completada').length;
  const tardePercentage = tardeTasks.length > 0 ? Math.round((tardeCompleted / tardeTasks.length) * 100) : 0;

  // Active view breakdown
  let activeShiftLabel = 'Jornada Completa';
  let activeShiftPct = overallPercentage;
  let activeShiftCompleted = completed;
  let activeShiftTotal = total;

  if (selectedShift === 'manana') {
    activeShiftLabel = 'Turno Mañana 🌅';
    activeShiftPct = mananaPercentage;
    activeShiftCompleted = mananaCompleted;
    activeShiftTotal = mananaTasks.length;
  } else if (selectedShift === 'tarde') {
    activeShiftLabel = 'Turno Tarde 🌇';
    activeShiftPct = tardePercentage;
    activeShiftCompleted = tardeCompleted;
    activeShiftTotal = tardeTasks.length;
  }

  // Circular gauge SVG calculations
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm transition-all">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Main Gauge & Overall Stats */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Circular Progress Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-stone-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className={`transition-all duration-700 ease-out ${
                  overallPercentage === 100
                    ? 'text-emerald-500'
                    : overallPercentage > 50
                    ? 'text-amber-500'
                    : 'text-rose-500'
                }`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold font-heading text-stone-900 leading-none">
                {overallPercentage}%
              </span>
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mt-0.5">
                Cumplido
              </span>
            </div>
          </div>

          {/* Text Summary */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-800 tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                Progreso Diario
              </span>
              {overallPercentage === 100 && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Trophy className="w-3.5 h-3.5 text-emerald-500" />
                  ¡100% Completado!
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900">
              {activeShiftLabel}
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              <span className="font-bold text-stone-700">{activeShiftCompleted}</span> de{' '}
              <span className="font-bold text-stone-700">{activeShiftTotal}</span> tareas finalizadas
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full md:flex-1 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-stone-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {completed} Completadas (Verde)
            </span>
            <span className="text-stone-600 flex items-center gap-1">
              <Clock className="w-4 h-4 text-rose-500" />
              {pending} Pendientes (Rojo)
            </span>
          </div>

          {/* Progress track */}
          <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60 relative">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                overallPercentage === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500'
              }`}
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Shift Specific Cards */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
          
          {/* Turno Mañana */}
          <div className={`p-3 rounded-2xl border transition-all ${
            selectedShift === 'manana'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20'
              : 'bg-stone-50/80 border-stone-200/70'
          }`}>
            <div className="flex items-center gap-1.5 mb-1 text-amber-800 font-bold text-xs">
              <Sunrise className="w-4 h-4 text-amber-600" />
              <span>Mañana</span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-lg font-extrabold font-heading text-stone-900">
                {mananaPercentage}%
              </span>
              <span className="text-[11px] text-stone-500 font-semibold">
                {mananaCompleted}/{mananaTasks.length}
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${mananaPercentage}%` }}
              />
            </div>
          </div>

          {/* Turno Tarde */}
          <div className={`p-3 rounded-2xl border transition-all ${
            selectedShift === 'tarde'
              ? 'bg-orange-50/80 border-orange-300 ring-2 ring-orange-400/20'
              : 'bg-stone-50/80 border-stone-200/70'
          }`}>
            <div className="flex items-center gap-1.5 mb-1 text-orange-800 font-bold text-xs">
              <Sunset className="w-4 h-4 text-orange-600" />
              <span>Tarde</span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-lg font-extrabold font-heading text-stone-900">
                {tardePercentage}%
              </span>
              <span className="text-[11px] text-stone-500 font-semibold">
                {tardeCompleted}/{tardeTasks.length}
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${tardePercentage}%` }}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
