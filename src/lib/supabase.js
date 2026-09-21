import { createClient } from '@supabase/supabase-js';
import { INITIAL_TASKS } from '../data/initialTasks';

// Retrieve credentials from env or localStorage
const storedUrl = localStorage.getItem('pan_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '';
const storedKey = localStorage.getItem('pan_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(storedUrl && storedKey && storedUrl.includes('supabase.co'));

export const supabase = isSupabaseConfigured
  ? createClient(storedUrl, storedKey)
  : null;

// Helper to format today's date YYYY-MM-DD
export const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Storage keys for local fallback engine
const LOCAL_TASKS_KEY = 'pan_del_barrio_tasks_v4';
const LOCAL_HISTORY_KEY = 'pan_del_barrio_history_v4';
const LAST_RESET_DATE_KEY = 'pan_del_barrio_last_reset_tag';

// Initial local storage setup
export const initLocalStorage = () => {
  const existing = localStorage.getItem(LOCAL_TASKS_KEY);
  if (!existing || JSON.parse(existing).length < 20) {
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(INITIAL_TASKS));
  }

  if (!localStorage.getItem(LOCAL_HISTORY_KEY)) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const mockHistory = [
      {
        id: 'hist-1',
        snapshot_date: yesterday.toISOString().split('T')[0],
        total_tasks: 82,
        completed_tasks: 78,
        pending_tasks: 4,
        completion_percentage: 95,
        morning_completion_pct: 98,
        afternoon_completion_pct: 92,
        summary_notes: 'Jornada oficial completada a las 22:00h.'
      }
    ];
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(mockHistory));
  }
};

// Check and perform auto reset at 22:00h (10 PM) or when date changes
export const checkAutoDailyReset = () => {
  const now = new Date();
  const today = getTodayString();
  const currentHour = now.getHours(); // 0 to 23
  const lastResetTag = localStorage.getItem(LAST_RESET_DATE_KEY);
  const todayResetTag = `${today}-22pm`;

  if (currentHour >= 22 && lastResetTag !== todayResetTag) {
    console.log('🔄 Cierre de local (22:00h): ejecutando reset diario automático...');
    executeDailyReset('Reset diario automático a las 22:00h (Cierre de Local)');
  } else if (!lastResetTag) {
    localStorage.setItem(LAST_RESET_DATE_KEY, todayResetTag);
  }
};

// FETCH TASKS
export const fetchTasks = async () => {
  if (supabase) {
    try {
      const today = getTodayString();
      const { data: dbTasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (!error && dbTasks && dbTasks.length > 0) {
        const { data: logs } = await supabase
          .from('daily_task_logs')
          .select('*')
          .eq('log_date', today);

        return dbTasks.map(t => {
          const log = logs?.find(l => l.task_id === t.id);
          return {
            id: t.id,
            title: t.title,
            description: t.description || '',
            category: t.category || 'Apertura',
            shift: t.shift_id,
            order: t.display_order,
            active: t.active,
            status: log ? log.status : 'pendiente',
            completedAt: log?.completed_at || null,
            completedBy: log?.completed_by_name || null
          };
        });
      }
    } catch (err) {
      console.warn('Error conectando a Supabase, usando local storage:', err);
    }
  }

  // Fallback LocalStorage
  initLocalStorage();
  checkAutoDailyReset();
  const raw = localStorage.getItem(LOCAL_TASKS_KEY);
  return raw ? JSON.parse(raw) : INITIAL_TASKS;
};

// TOGGLE TASK STATUS (PENDIENTE <-> COMPLETADA)
export const toggleTaskStatus = async (taskId, currentStatus) => {
  const newStatus = currentStatus === 'completada' ? 'pendiente' : 'completada';
  const completedAt = newStatus === 'completada' ? new Date().toISOString() : null;

  if (supabase) {
    try {
      const today = getTodayString();
      const { error } = await supabase
        .from('daily_task_logs')
        .upsert({
          log_date: today,
          task_id: taskId,
          status: newStatus,
          completed_at: completedAt,
          updated_at: new Date().toISOString()
        }, { onConflict: 'log_date,task_id' });

      if (!error) {
        return { success: true, newStatus };
      }
    } catch (err) {
      console.warn('Falló upsert en Supabase, guardando localmente:', err);
    }
  }

  // Fallback LocalStorage
  initLocalStorage();
  const tasks = JSON.parse(localStorage.getItem(LOCAL_TASKS_KEY) || '[]');
  const updated = tasks.map(t => {
    if (t.id === taskId) {
      return {
        ...t,
        status: newStatus,
        completedAt
      };
    }
    return t;
  });

  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(updated));
  return { success: true, newStatus, tasks: updated };
};

// CREATE / EDIT TASK
export const saveTask = async (taskData) => {
  if (supabase) {
    try {
      if (taskData.id && !taskData.id.includes('-')) {
        const { data, error } = await supabase
          .from('tasks')
          .update({
            title: taskData.title,
            description: taskData.description,
            category: taskData.category,
            shift_id: taskData.shift,
            display_order: taskData.order || 1,
            active: true
          })
          .eq('id', taskData.id)
          .select();
        if (!error) return { success: true, data };
      } else {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            title: taskData.title,
            description: taskData.description,
            category: taskData.category,
            shift_id: taskData.shift,
            display_order: taskData.order || 1,
            active: true
          })
          .select();
        if (!error) return { success: true, data };
      }
    } catch (err) {
      console.warn('Error al guardar en Supabase, guardando local:', err);
    }
  }

  // Fallback LocalStorage
  initLocalStorage();
  const tasks = JSON.parse(localStorage.getItem(LOCAL_TASKS_KEY) || '[]');
  let updated;
  if (taskData.id) {
    updated = tasks.map(t => t.id === taskData.id ? { ...t, ...taskData } : t);
  } else {
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      active: true,
      status: 'pendiente',
      completedAt: null
    };
    updated = [...tasks, newTask];
  }
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(updated));
  return { success: true, tasks: updated };
};

// DELETE TASK
export const deleteTask = async (taskId) => {
  if (supabase && !taskId.startsWith('m-') && !taskId.startsWith('t-')) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      if (!error) return { success: true };
    } catch (err) {
      console.warn('Error al eliminar en Supabase:', err);
    }
  }

  // Fallback LocalStorage
  initLocalStorage();
  const tasks = JSON.parse(localStorage.getItem(LOCAL_TASKS_KEY) || '[]');
  const updated = tasks.filter(t => t.id !== taskId);
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(updated));
  return { success: true, tasks: updated };
};

// DAILY RESET (CIERRE DE JORNADA A LAS 22:00H)
export const executeDailyReset = async (notes = 'Cierre de jornada manual a las 22:00h') => {
  const today = getTodayString();
  const todayResetTag = `${today}-22pm`;

  if (supabase) {
    try {
      // 1. Call stored procedure in Supabase
      await supabase.rpc('fn_reset_daily_tasks', { target_date: today });

      // 2. Force reset all daily task logs for today to 'pendiente'
      await supabase
        .from('daily_task_logs')
        .update({
          status: 'pendiente',
          completed_at: null,
          completed_by_name: null,
          updated_at: new Date().toISOString()
        })
        .eq('log_date', today);

      localStorage.setItem(LAST_RESET_DATE_KEY, todayResetTag);
    } catch (err) {
      console.warn('Error ejecutando rpc reset en Supabase:', err);
    }
  }

  // LocalStorage reset
  initLocalStorage();
  const tasks = JSON.parse(localStorage.getItem(LOCAL_TASKS_KEY) || '[]');
  
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completada').length;
  const pending = total - completed;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const mananaTotal = tasks.filter(t => t.shift === 'manana').length;
  const mananaCompleted = tasks.filter(t => t.shift === 'manana' && t.status === 'completada').length;
  const mananaPct = mananaTotal > 0 ? Math.round((mananaCompleted / mananaTotal) * 100) : 0;

  const tardeTotal = tasks.filter(t => t.shift === 'tarde').length;
  const tardeCompleted = tasks.filter(t => t.shift === 'tarde' && t.status === 'completada').length;
  const tardePct = tardeTotal > 0 ? Math.round((tardeCompleted / tardeTotal) * 100) : 0;

  // Save history snapshot
  const history = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]');
  const newSnapshot = {
    id: `hist-${Date.now()}`,
    snapshot_date: today,
    total_tasks: total,
    completed_tasks: completed,
    pending_tasks: pending,
    completion_percentage: pct,
    morning_completion_pct: mananaPct,
    afternoon_completion_pct: tardePct,
    summary_notes: notes,
    created_at: new Date().toISOString()
  };

  const updatedHistory = [newSnapshot, ...history.filter(h => h.snapshot_date !== today)];
  localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updatedHistory));

  // Reset ALL tasks to 'pendiente' (0% completion, state RED)
  const resetTasks = tasks.map(t => ({
    ...t,
    status: 'pendiente',
    completedAt: null
  }));

  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(resetTasks));
  localStorage.setItem(LAST_RESET_DATE_KEY, todayResetTag);

  return { success: true, snapshot: newSnapshot, tasks: resetTasks };
};

// FETCH HISTORY SNAPSHOTS
export const fetchHistory = async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('daily_history_snapshots')
        .select('*')
        .order('snapshot_date', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Error obteniendo historial de Supabase:', err);
    }
  }

  // Fallback LocalStorage
  initLocalStorage();
  const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
};

// API CREDENTIAL MANAGERS
export const saveSupabaseCredentials = (url, key) => {
  localStorage.setItem('pan_supabase_url', url.trim());
  localStorage.setItem('pan_supabase_key', key.trim());
  window.location.reload();
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('pan_supabase_url');
  localStorage.removeItem('pan_supabase_key');
  window.location.reload();
};
