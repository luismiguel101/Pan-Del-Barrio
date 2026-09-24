import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

export function TaskModal({ isOpen, onClose, onSave, taskToEdit = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cajera');
  const [shift, setShift] = useState('manana');
  const [order, setOrder] = useState(1);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category || 'Cajera');
      setShift(taskToEdit.shift || 'manana');
      setOrder(taskToEdit.order || 1);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Cajera');
      setShift('manana');
      setOrder(1);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: taskToEdit?.id || null,
      title: title.trim(),
      description: description.trim(),
      category,
      shift,
      order: Number(order) || 1
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF0E6] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-amber-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              {taskToEdit ? <Save className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
            </div>
            <h3 className="text-lg font-bold font-heading text-stone-900">
              {taskToEdit ? 'Editar Tarea de Puesto' : 'Nueva Tarea Pan del Barrio'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-amber-100/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Título */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
              Título de la Tarea <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Revisión de temperatura de equipos..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
              Detalle / Descripción Operativa
            </label>
            <textarea
              rows={2}
              placeholder="Detalle o instrucción para el personal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Turno y Puesto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Turno */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                Turno Asignado
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="manana">Turno Mañana</option>
                <option value="tarde">Turno Tarde</option>
              </select>
            </div>

            {/* Puesto / Rol */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                Puesto Asignado
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Cajera">Cajera 💳</option>
                <option value="Despacho">Despacho 🥖</option>
              </select>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-200/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-amber-100/60 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl shadow-xs active:scale-95 transition-all"
            >
              {taskToEdit ? 'Guardar Cambios' : 'Crear Tarea'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
