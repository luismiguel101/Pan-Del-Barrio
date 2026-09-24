import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Sunrise, 
  Sunset, 
  Clock, 
  ShieldCheck, 
  Search, 
  Receipt,
  Wheat,
  ListCheck
} from 'lucide-react';

export function AdminDashboard({
  tasks = [],
  onOpenCreateTaskModal,
  onOpenEditTaskModal,
  onDeleteTask,
  onOpenResetModal,
  onOpenHistoryModal,
  onToggleTask,
  onLogoutAdmin
}) {
  const [activeShiftFilter, setActiveShiftFilter] = useState('manana'); // 'manana' | 'tarde' | 'todos'
  const [activeRoleFilter, setActiveRoleFilter] = useState('Cajera'); // 'Cajera' | 'Despacho'
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics
  const total = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'completada').length;
  const pendingTasks = tasks.filter(t => t.status === 'pendiente');
  const pendingCount = pendingTasks.length;
  const globalPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const mananaTasks = tasks.filter(t => t.shift === 'manana');
  const mananaCompleted = mananaTasks.filter(t => t.status === 'completada').length;
  const mananaPct = mananaTasks.length > 0 ? Math.round((mananaCompleted / mananaTasks.length) * 100) : 0;

  const tardeTasks = tasks.filter(t => t.shift === 'tarde');
  const tardeCompleted = tardeTasks.filter(t => t.status === 'completada').length;
  const tardePct = tardeTasks.length > 0 ? Math.round((tardeCompleted / tardeTasks.length) * 100) : 0;

  // Strictly 2 role buttons
  const rolesList = [
    { id: 'Cajera', name: 'Labores de Cajera 💳', icon: Receipt },
    { id: 'Despacho', name: 'Labores de Despacho 🥖', icon: Wheat }
  ];

  // Filtered tasks
  const displayedTasks = tasks.filter(task => {
    const matchesShift = activeShiftFilter === 'todos' || task.shift === activeShiftFilter;
    const matchesRole = task.category === activeRoleFilter;
    const matchesQuery = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesShift && matchesRole && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Admin Dashboard Banner */}
      <div className="bg-[#3D2214] text-white rounded-3xl p-6 shadow-xl border border-amber-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Panel Administrador (PIN Autenticado)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-amber-100">
              Gestión de Puestos: Cajera y Despacho
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Administra las labores asignadas a Cajera y Despacho para los turnos Mañana y Tarde.
            </p>
          </div>

          {/* Quick Action Admin Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateTaskModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nueva Tarea</span>
            </button>

            <button
              onClick={onOpenResetModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Cierre de Jornada (Reset)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Global Compliance */}
        <div className="bg-white/90 p-5 rounded-3xl border border-amber-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>Cumplimiento Global</span>
            <Receipt className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-heading text-stone-900">{globalPct}%</span>
            <span className="text-xs font-semibold text-stone-500">{completedCount}/{total} finalizadas</span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${globalPct}%` }} />
          </div>
        </div>

        {/* URGENT RED PENDING TASKS ALERT */}
        <div className={`p-5 rounded-3xl border shadow-xs space-y-2 transition-all ${
          pendingCount > 0 
            ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20' 
            : 'bg-emerald-50 border-emerald-300'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={pendingCount > 0 ? 'text-rose-800' : 'text-emerald-800'}>
              Tareas Pendientes (Retrasos)
            </span>
            <AlertTriangle className={`w-4 h-4 ${pendingCount > 0 ? 'text-rose-600 animate-bounce' : 'text-emerald-600'}`} />
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-extrabold font-heading ${pendingCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              {pendingCount}
            </span>
            <span className="text-xs font-bold text-rose-600 bg-white px-2 py-0.5 rounded-full border border-rose-200">
              Estado Rojo
            </span>
          </div>
          <p className="text-[11px] text-stone-600 font-medium">
            {pendingCount > 0 ? 'Requiere atención operativa inmediata' : '¡Excelente! Sin retrasos'}
          </p>
        </div>

        {/* Shift Mañana Metric */}
        <div className="bg-white/90 p-5 rounded-3xl border border-amber-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800">
            <span className="flex items-center gap-1"><Sunrise className="w-3.5 h-3.5 text-amber-600" /> Turno Mañana</span>
            <span className="font-extrabold">{mananaPct}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-heading text-stone-900">{mananaCompleted} <span className="text-xs font-normal text-stone-400">/ {mananaTasks.length}</span></span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${mananaPct}%` }} />
          </div>
        </div>

        {/* Shift Tarde Metric */}
        <div className="bg-white/90 p-5 rounded-3xl border border-amber-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-orange-800">
            <span className="flex items-center gap-1"><Sunset className="w-3.5 h-3.5 text-orange-600" /> Turno Tarde</span>
            <span className="font-extrabold">{tardePct}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-heading text-stone-900">{tardeCompleted} <span className="text-xs font-normal text-stone-400">/ {tardeTasks.length}</span></span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${tardePct}%` }} />
          </div>
        </div>

      </div>

      {/* Turno Selector & Role Buttons */}
      <div className="space-y-4">
        
        {/* Shift selector */}
        <div className="grid grid-cols-3 gap-2 bg-[#EED8C5]/80 p-1.5 rounded-2xl border border-amber-300/40">
          <button
            onClick={() => setActiveShiftFilter('manana')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeShiftFilter === 'manana'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-stone-800 hover:bg-white/40'
            }`}
          >
            Turno Mañana ({mananaTasks.length})
          </button>
          <button
            onClick={() => setActiveShiftFilter('tarde')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeShiftFilter === 'tarde'
                ? 'bg-orange-700 text-white shadow-xs'
                : 'text-stone-800 hover:bg-white/40'
            }`}
          >
            Turno Tarde ({tardeTasks.length})
          </button>
          <button
            onClick={() => setActiveShiftFilter('todos')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeShiftFilter === 'todos'
                ? 'bg-[#3D2214] text-amber-300 shadow-xs'
                : 'text-stone-800 hover:bg-white/40'
            }`}
          >
            Jornada Completa ({total})
          </button>
        </div>

        {/* Visual STRICTLY 2 Role Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rolesList.map((role) => {
            const Icon = role.icon;
            const isSelected = activeRoleFilter === role.id;
            const roleTasksCount = tasks.filter(t => 
              (activeShiftFilter === 'todos' || t.shift === activeShiftFilter) &&
              t.category === role.id
            ).length;

            return (
              <button
                key={role.id}
                onClick={() => setActiveRoleFilter(role.id)}
                className={`flex items-center justify-between p-4 rounded-3xl font-bold text-sm sm:text-base transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-700 text-white border-amber-800 shadow-md scale-[1.02]'
                    : 'bg-white/90 text-stone-800 border-amber-200 hover:bg-amber-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{role.name}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-950'
                }`}>
                  {roleTasksCount} Labores
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Admin Task Management Table */}
      <div className="bg-white/90 rounded-3xl border border-amber-200/80 shadow-sm overflow-hidden">
        
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-amber-100 bg-[#FAF0E6]/50">
          
          <div className="flex items-center gap-2 text-xs font-extrabold text-stone-800">
            <ListCheck className="w-4 h-4 text-amber-700" />
            <span>Filtro Actual: Labores de {activeRoleFilter} ({displayedTasks.length} Tareas)</span>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

        </div>

        {/* Task List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF0E6]/80 text-stone-700 text-[11px] font-extrabold uppercase tracking-wider border-b border-amber-200">
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Tarea / Descripción</th>
                <th className="py-3 px-4">Turno</th>
                <th className="py-3 px-4">Puesto / Rol</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 text-xs font-medium">
              {displayedTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">
                    No hay tareas registradas para este filtro.
                  </td>
                </tr>
              ) : (
                displayedTasks.map((task) => {
                  const isCompleted = task.status === 'completada';

                  return (
                    <tr 
                      key={task.id}
                      className={`hover:bg-amber-50/40 transition-colors ${
                        !isCompleted ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      {/* Estado */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => onToggleTask(task.id, task.status)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border cursor-pointer transition-transform active:scale-95 ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-rose-600 text-white border-rose-700 animate-pulse'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Completada
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              Pendiente
                            </>
                          )}
                        </button>
                      </td>

                      {/* Título & Desc */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className={`font-bold text-stone-900 ${isCompleted ? 'line-through text-stone-400' : ''}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-[11px] text-stone-500 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Turno */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          task.shift === 'manana'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-orange-100 text-orange-900'
                        }`}>
                          {task.shift === 'manana' ? <Sunrise className="w-3 h-3 text-amber-600" /> : <Sunset className="w-3 h-3 text-orange-600" />}
                          <span className="capitalize">{task.shift}</span>
                        </span>
                      </td>

                      {/* Puesto / Rol */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                          task.category === 'Cajera'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-orange-100 text-orange-900 border-orange-300'
                        }`}>
                          {task.category === 'Cajera' ? '💳 Cajera' : '🥖 Despacho'}
                        </span>
                      </td>

                      {/* Acciones CRUD */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenEditTaskModal(task)}
                            className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-100/60 rounded-lg transition-colors"
                            title="Editar Tarea"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar Tarea"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
