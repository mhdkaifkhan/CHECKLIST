import { create } from 'zustand';
import api from './api';
import toast from 'react-hot-toast';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  dayRecord: null,
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const [tasksRes, dayRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/days/today'),
      ]);
      set({ tasks: tasksRes.data.tasks, dayRecord: dayRes.data.dayRecord, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addTask: async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      set(s => ({ tasks: [...s.tasks, data.task] }));
      await get().fetchTasks();
      toast.success(`"${data.task.title}" added`);
      return data.task;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add task');
      throw err;
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      set(s => ({ tasks: s.tasks.map(t => t._id === id ? data.task : t) }));
      toast.success('Task updated');
      return data.task;
    } catch (err) {
      toast.error('Failed to update task');
      throw err;
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set(s => ({ tasks: s.tasks.filter(t => t._id !== id) }));
      toast.success('Task removed');
    } catch {
      toast.error('Failed to delete task');
    }
  },

  reorderTasks: async (orderedIds) => {
    try {
      await api.put('/tasks/reorder', { orderedIds });
      const reordered = orderedIds.map(id => get().tasks.find(t => t._id === id)).filter(Boolean);
      set({ tasks: reordered });
    } catch {}
  },

  refreshDay: async () => {
    try {
      const { data } = await api.get('/days/today');
      set({ dayRecord: data.dayRecord });
      return data.dayRecord;
    } catch {}
  },

  updateDayRecord: (dayRecord) => set({ dayRecord }),
}));
