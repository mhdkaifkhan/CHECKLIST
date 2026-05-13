import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Square, Minimize2 } from 'lucide-react';
import { useTimer } from '../../context/TimerContext';
import { useTaskStore } from '../../utils/taskStore';
import { formatSeconds, formatMinutes, progressPercent } from '../../utils/formatTime';
import { ProgressRing } from '../ui/Progress';

export default function FocusMode() {
  const { activeTaskId, elapsed, stopTask, setFocusMode, completedTaskIds } = useTimer();
  const { tasks, dayRecord, refreshDay } = useTaskStore();

  const task = tasks.find(t => t._id === activeTaskId);
  const taskProgress = dayRecord?.taskProgress?.find(tp => tp.taskId === activeTaskId || tp.taskId?._id === activeTaskId);
  const completedSec = taskProgress?.completedSeconds || 0;
  const totalSec = completedSec + elapsed;
  const pct = task ? progressPercent(totalSec, task.targetMinutes) : 0;
  const isCompleted = completedTaskIds.has(activeTaskId);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setFocusMode(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setFocusMode]);

  const handleStop = async () => {
    const day = await stopTask();
    if (day) await refreshDay();
    setFocusMode(false);
  };

  if (!task) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="focus-overlay flex flex-col items-center justify-center"
        style={{ background: `radial-gradient(ellipse at center, ${task.color}08 0%, #0a0a0f 60%)` }}
      >
        {/* Ambient particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width:  Math.random() * 200 + 60,
              height: Math.random() * 200 + 60,
              background: `radial-gradient(circle, ${task.color}06, transparent)`,
              left:   `${Math.random() * 100}%`,
              top:    `${Math.random() * 100}%`,
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setFocusMode(false)}
            className="absolute top-4 right-4 md:-top-16 md:-right-16 p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          >
            <Minimize2 size={20} />
          </motion.button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl mb-4"
          >
            {task.icon}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl font-bold mb-1"
          >
            {task.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.2 }}
            className="text-sm mb-12"
            style={{ color: 'var(--text-muted)' }}
          >
            {formatMinutes(task.targetMinutes)} target · Focus Session
          </motion.p>

          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <ProgressRing value={pct} size={200} stroke={8} color={isCompleted ? '#10b981' : task.color}>
              <div className="text-center">
                <div
                  className="text-4xl font-bold timer-display tracking-tighter"
                  style={{ color: isCompleted ? '#10b981' : task.color }}
                >
                  {formatSeconds(totalSec)}
                </div>
                <div className="text-sm font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
                  {pct}%
                </div>
              </div>
            </ProgressRing>
          </motion.div>

          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                ✓ Target Reached — Great Work!
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 mt-10"
          >
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20"
            >
              <Square size={14} fill="currentColor" />
              End Session
            </button>
          </motion.div>

          <p className="text-xs mt-6" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
            Press Esc to minimize
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
