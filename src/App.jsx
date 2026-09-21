import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { EmployeeView } from './components/EmployeeView';
import { AdminDashboard } from './components/AdminDashboard';
import { TaskModal } from './components/TaskModal';
import { ResetModal } from './components/ResetModal';
import { HistoryModal } from './components/HistoryModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { AdminPinModal } from './components/AdminPinModal';
import { 
  fetchTasks, 
  toggleTaskStatus, 
  saveTask, 
  deleteTask, 
  executeDailyReset,
  initLocalStorage,
  checkAutoDailyReset,
  supabase
} from './lib/supabase';
import { Heart } from 'lucide-react';

export function App() {
  const [currentRole, setCurrentRole] = useState('employee'); // 'employee' | 'admin'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('pan_admin_auth') === 'true';
  });
  const [selectedShift, setSelectedShift] = useState('manana'); // 'manana' | 'tarde' | 'todos'
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);

  // Load tasks on mount
  const loadTasksData = async () => {
    setLoading(true);
    const data = await fetchTasks();
    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    initLocalStorage();
    checkAutoDailyReset();
    loadTasksData();

    // Setup Supabase Realtime subscription if available
    if (supabase) {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'daily_task_logs' },
          () => {
            console.log('⚡ Evento en tiempo real de Supabase recibido');
            loadTasksData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Role Switching Handler
  const handleRoleChange = (role) => {
    if (role === 'admin') {
      if (isAdminAuthenticated) {
        setCurrentRole('admin');
      } else {
        setIsAdminPinModalOpen(true);
      }
    } else {
      setCurrentRole('employee');
    }
  };

  const handleAdminPinSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('pan_admin_auth', 'true');
    setIsAdminPinModalOpen(false);
    setCurrentRole('admin');
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('pan_admin_auth');
    setCurrentRole('employee');
  };

  // Toggle task completion status
  const handleToggleTask = async (taskId, currentStatus) => {
    // Optimistic UI update
    const newStatus = currentStatus === 'completada' ? 'pendiente' : 'completada';
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          completedAt: newStatus === 'completada' ? new Date().toISOString() : null
        };
      }
      return t;
    }));

    await toggleTaskStatus(taskId, currentStatus);
  };

  // Save (Create/Update) task
  const handleSaveTask = async (taskData) => {
    await saveTask(taskData);
    await loadTasksData();
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('¿Estás segura de eliminar esta tarea de la plantilla maestra?')) {
      await deleteTask(taskId);
      await loadTasksData();
    }
  };

  // Execute daily reset
  const handleConfirmReset = async (notes) => {
    await executeDailyReset(notes);
    await loadTasksData();
  };

  return (
    <div className="min-h-screen bg-[#F8E7D8] text-stone-900 flex flex-col font-sans">
      
      {/* Header Bar */}
      <Header
        currentRole={currentRole}
        isAdminAuthenticated={isAdminAuthenticated}
        onRoleChange={handleRoleChange}
        onLogoutAdmin={handleLogoutAdmin}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:px-6 space-y-6">
        
        {/* Global Progress Bar Barometer */}
        <ProgressBar
          tasks={tasks}
          selectedShift={selectedShift}
        />

        {/* View Switcher based on currentRole */}
        {loading ? (
          <div className="bg-white/90 rounded-3xl p-12 text-center border border-amber-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-stone-600">Cargando tareas de Pan del Barrio...</p>
          </div>
        ) : currentRole === 'employee' ? (
          <EmployeeView
            tasks={tasks}
            selectedShift={selectedShift}
            onSelectShift={setSelectedShift}
            onToggleTask={handleToggleTask}
          />
        ) : (
          <AdminDashboard
            tasks={tasks}
            onOpenCreateTaskModal={() => {
              setTaskToEdit(null);
              setIsTaskModalOpen(true);
            }}
            onOpenEditTaskModal={(task) => {
              setTaskToEdit(task);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onOpenResetModal={() => setIsResetModalOpen(true)}
            onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
            onToggleTask={handleToggleTask}
            onLogoutAdmin={handleLogoutAdmin}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#FAF0E6]/90 border-t border-amber-200/60 py-6 mt-12 text-center text-xs text-stone-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-[#3D2214]">
            <img src="/logo.png" alt="Logo" className="w-5 h-5 rounded-md object-cover" />
            <span>Pan del Barrio - Control de Salón y Producción</span>
          </div>
          <div className="flex items-center gap-1 text-amber-900/70 font-semibold">
            <span>Diseñado con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>para el equipo de panadería (Est. 2020)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AdminPinModal
        isOpen={isAdminPinModalOpen}
        onClose={() => setIsAdminPinModalOpen(false)}
        onSuccess={handleAdminPinSuccess}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

    </div>
  );
}

export default App;
