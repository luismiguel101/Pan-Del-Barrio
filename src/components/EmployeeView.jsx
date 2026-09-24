import React, { useState } from 'react';
import { 
  Sunrise, 
  Sunset, 
  Sparkles, 
  Check, 
  Clock, 
  Search, 
  CheckCircle2,
  Receipt,
  Wheat,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function EmployeeView({ 
  tasks = [], 
  selectedShift, 
  onSelectShift, 
  onToggleTask
}) {
  const [activeRoleFilter, setActiveRoleFilter] = useState('Todas'); // 'Todas' | 'Cajera' | 'Despacho'
  const [searchQuery, setSearchQuery] = useState('');

  // Define only 2 main roles plus "Todas"
  const roleButtons = [
    { id: 'Todas', name: 'Todas las Labores', icon: Sparkles, color: 'from-[#3D2214] to-[#5C2C16]' },
    { id: 'Cajera', name: 'Labores de Cajera', subtitle: 'Caja, Atención y Café', icon: Receipt, color: 'from-amber-700 to-amber-600' },
    { id: 'Despacho', name: 'Labores de Despacho', subtitle: 'Mostrador, Panes y Salón', icon: Wheat, color: 'from-orange-700 to-amber-600' }
  ];

  // Trigger celebration confetti when completing tasks
  const handleTaskClick = (taskId, currentStatus) => {
    onToggleTask(taskId, currentStatus);

    if (currentStatus === 'pendiente') {
      const currentCompleted = tasks.filter(t => t.status === 'completada').length;
      const totalTasks = tasks.length;
      
      if (currentCompleted + 1 === totalTasks) {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // Filter tasks by current shift, active role filter, and search query
  const filteredTasks = tasks.filter(task => {
    const matchesShift = selectedShift === 'todos' || task.shift === selectedShift;
    const matchesRole = activeRoleFilter === 'Todas' || task.category === activeRoleFilter;
    const matchesQuery = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesShift && matchesRole && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Turno Switcher Tabs (Mañana vs Tarde vs Todos) */}
      <div className="grid grid-cols-3 gap-2 bg-[#EED8C5]/80 p-1.5 rounded-3xl border border-amber-300/40 shadow-xs">
        <button
          onClick={() => {
            onSelectShift('manana');
            setActiveRoleFilter('Todas');
          }}
          className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl font-heading font-extrabold text-xs sm:text-sm transition-all duration-200 ${
            selectedShift === 'manana'
              ? 'bg-amber-700 text-white shadow-md shadow-amber-900/20 scale-[1.02]'
              : 'text-stone-800 hover:text-stone-900 hover:bg-white/40'
          }`}
        >
          <Sunrise className="w-4 h-4" />
          <span>Turno Mañana</span>
        </button>

        <button
          onClick={() => {
            onSelectShift('tarde');
            setActiveRoleFilter('Todas');
          }}
          className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl font-heading font-extrabold text-xs sm:text-sm transition-all duration-200 ${
            selectedShift === 'tarde'
              ? 'bg-orange-700 text-white shadow-md shadow-orange-900/20 scale-[1.02]'
              : 'text-stone-800 hover:text-stone-900 hover:bg-white/40'
          }`}
        >
          <Sunset className="w-4 h-4" />
          <span>Turno Tarde</span>
        </button>

        <button
          onClick={() => {
            onSelectShift('todos');
            setActiveRoleFilter('Todas');
          }}
          className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl font-heading font-extrabold text-xs sm:text-sm transition-all duration-200 ${
            selectedShift === 'todos'
              ? 'bg-[#3D2214] text-amber-300 shadow-md shadow-stone-900/10 scale-[1.02]'
              : 'text-stone-800 hover:text-stone-900 hover:bg-white/40'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Jornada Completa</span>
        </button>
      </div>

      {/* Visual & Dynamic Role Buttons: CAJERA vs DESPACHO */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-stone-700">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-amber-950 font-extrabold">
            <UserCheck className="w-4 h-4 text-amber-700" />
            Selección de Puesto / Rol ({selectedShift === 'tarde' ? 'Turno Tarde' : 'Turno Mañana'})
          </span>
          <span className="text-stone-500 font-medium hidden sm:inline">
            Toca un puesto para ver solo sus tareas asignadas
          </span>
        </div>

        {/* 2 Main Role Buttons + Todas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {roleButtons.map((role) => {
            const Icon = role.icon;
            const roleTasks = tasks.filter(t => 
              (selectedShift === 'todos' || t.shift === selectedShift) &&
              (role.id === 'Todas' || t.category === role.id)
            );
            const completedInRole = roleTasks.filter(t => t.status === 'completada').length;
            const totalInRole = roleTasks.length;
            const isFullyDone = totalInRole > 0 && completedInRole === totalInRole;
            const isActive = activeRoleFilter === role.id;

            return (
              <button
                key={role.id}
                onClick={() => setActiveRoleFilter(role.id)}
                className={`relative group flex flex-col justify-between p-4 rounded-3xl border-2 transition-all duration-200 text-left cursor-pointer overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-br ' + role.color + ' text-white border-stone-900 shadow-md scale-[1.02] ring-2 ring-amber-400/30'
                    : 'bg-white/95 text-stone-800 border-amber-200/90 hover:bg-amber-100/50 hover:border-amber-300'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between w-full mb-3">
                  <div className={`p-2.5 rounded-2xl flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-950'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                    isFullyDone
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-amber-100 text-amber-950 border-amber-200'
                  }`}>
                    {completedInRole}/{totalInRole} Completadas
                  </span>
                </div>

                {/* Role Name */}
                <div className="space-y-1.5">
                  <span className={`text-base font-extrabold font-heading block ${
                    isActive ? 'text-white' : 'text-stone-900'
                  }`}>
                    {role.name}
                  </span>
                  {role.subtitle && (
                    <span className={`text-xs block ${isActive ? 'text-white/80' : 'text-stone-500'}`}>
                      {role.subtitle}
                    </span>
                  )}

                  {/* Micro Progress Bar inside Button */}
                  <div className={`w-full h-2 rounded-full overflow-hidden mt-2 ${
                    isActive ? 'bg-black/20' : 'bg-stone-200'
                  }`}>
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        isFullyDone ? 'bg-emerald-400' : isActive ? 'bg-amber-300' : 'bg-amber-600'
                      }`}
                      style={{ width: `${totalInRole > 0 ? (completedInRole / totalInRole) * 100 : 0}%` }}
                    />
                  </div>
                </div>

              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar & Counter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
          <span className="bg-amber-200/80 text-amber-950 px-3 py-1 rounded-full border border-amber-300">
            {activeRoleFilter === 'Todas' ? 'Todas las Labores' : `Puesto: ${activeRoleFilter}`} ({filteredTasks.length} Tareas)
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de tarea..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/90 border border-amber-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
          />
        </div>
      </div>

      {/* Task Cards Grid (2 Visual States Only: Pendiente RED vs Completada GREEN) */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white/90 rounded-3xl p-8 text-center border border-amber-200/80 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="font-bold text-stone-800 text-sm">
              No hay tareas registradas para este filtro
            </p>
            <p className="text-xs text-stone-500">
              Prueba seleccionando el botón "CAJERA" o "DESPACHO" en los botones superiores.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTasks.map((task) => {
              const isCompleted = task.status === 'completada';

              return (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task.id, task.status)}
                  className={`group relative rounded-3xl p-4 sm:p-5 border-2 transition-all duration-200 cursor-pointer select-none ${
                    isCompleted
                      ? 'bg-gradient-to-br from-emerald-50/95 to-teal-50/80 border-emerald-400 shadow-xs glow-green-subtle hover:border-emerald-500'
                      : 'bg-gradient-to-br from-rose-50/95 to-amber-50/70 border-rose-400 shadow-sm pulse-red-glow hover:border-rose-500 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    
                    {/* Big Touchable 1-Tap Checkbox */}
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105'
                          : 'bg-white border-rose-400 text-rose-300 group-hover:border-rose-500 group-hover:text-rose-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-7 h-7 stroke-[3]" />
                      ) : (
                        <div className="w-5 h-5 rounded-md border-2 border-rose-400 group-hover:bg-rose-100" />
                      )}
                    </div>

                    {/* Task Details */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      
                      {/* Category Badge (Cajera vs Despacho) & Status Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          task.category === 'Cajera'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-orange-100 text-orange-900 border-orange-300'
                        }`}>
                          {task.category === 'Cajera' ? '💳 Cajera' : '🥖 Despacho'}
                        </span>

                        {/* Strictly 2 Visual States Badge */}
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${
                            isCompleted
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : 'bg-rose-600 text-white border-rose-700 animate-pulse'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              Completada
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              Pendiente
                            </>
                          )}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-base sm:text-lg font-bold font-heading leading-snug transition-all ${
                          isCompleted
                            ? 'line-through text-stone-500 decoration-emerald-500/70'
                            : 'text-stone-900'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Description */}
                      {task.description && (
                        <p className={`text-xs ${isCompleted ? 'text-stone-400' : 'text-stone-600 font-medium'}`}>
                          {task.description}
                        </p>
                      )}

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-[11px] pt-1.5 text-stone-500 border-t border-stone-200/50 mt-2">
                        <span className="capitalize font-bold text-stone-600">
                          Turno {task.shift}
                        </span>

                        <span className={`font-extrabold text-[11px] ${isCompleted ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {isCompleted ? '✓ Estado Verde' : '• Estado Rojo'}
                        </span>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
