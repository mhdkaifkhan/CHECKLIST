import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTaskStore } from '../../utils/taskStore';

const COLORS = [
  '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ef4444', '#f97316', '#06b6d4', '#ec4899',
];
const ICONS = ['📋', '💻', '📚', '🏋️', '🎯', '🔬', '🎨', '✍️', '🧠', '⚡', '🚀', '🎵'];

export default function EditTaskModal({ open, onClose, task }) {
  const { updateTask, deleteTask } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ title: '', hours: '1', minutes: '0', color: '#f59e0b', icon: '📋' });
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title:   task.title,
        hours:   String(Math.floor(task.targetMinutes / 60)),
        minutes: String(task.targetMinutes % 60),
        color:   task.color,
        icon:    task.icon,
      });
      setConfirmDelete(false);
    }
  }, [task]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    const totalMin = parseInt(form.hours || 0) * 60 + parseInt(form.minutes || 0);
    if (!form.title.trim() || totalMin < 1) return;
    setLoading(true);
    try {
      await updateTask(task._id, { title: form.title.trim(), targetMinutes: totalMin, color: form.color, icon: form.icon });
      onClose();
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setLoading(true);
    try {
      await deleteTask(task._id);
      onClose();
    } finally { setLoading(false); }
  };

  if (!task) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Task">
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Task Name</label>
          <input className="input-base" value={form.title} onChange={e => set('title', e.target.value)} maxLength={100} />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Target Duration</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input type="number" className="input-base pr-8" min="0" max="23" value={form.hours} onChange={e => set('hours', e.target.value)} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--text-muted)' }}>h</span>
            </div>
            <div className="flex-1 relative">
              <input type="number" className="input-base pr-8" min="0" max="59" value={form.minutes} onChange={e => set('minutes', e.target.value)} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--text-muted)' }}>m</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Icon</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map(icon => (
              <button key={icon} type="button" onClick={() => set('icon', icon)}
                className={`w-9 h-9 rounded-xl text-lg transition-all ${form.icon === icon ? 'ring-2 scale-110' : 'opacity-60 hover:opacity-100'}`}
                style={{ background: 'var(--surface-2)' }}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Color</label>
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => set('color', c)}
                className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-white/30' : 'hover:scale-110'}`}
                style={{ background: c }} />
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="danger" onClick={handleDelete} loading={loading} className="flex-shrink-0">
            {confirmDelete ? 'Confirm Delete' : 'Delete'}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
