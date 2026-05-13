import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Edit2, Maximize2, CheckCircle2 } from 'lucide-react';
import { ProgressBar } from '../ui/Progress';
import { formatSeconds, formatMinutes, progressPercent } from '../../utils/formatTime';
import { useTimer } from '../../context/TimerContext';
import { useTaskStore } from '../../utils/taskStore';
import { playStartSound, playClickSound } from '../../utils/sound';
import Tooltip from '../ui/Tooltip';

export default function TaskCard({ task, taskProgress, onEdit, dragHandleProps }) {
  const { activeTaskId, elapsed, startTask, stopTask, setFocusMode, completedTaskIds, markCompleted } = useTimer();
  const { refreshDay } = useTaskStore();

  const isActive = activeTaskId === task._id;
  const completed = taskProgress?.isCompleted || completedTaskIds.has(task._id);
  const completedSec = taskProgress?.completedSeconds || 0;
  const totalSec = isActive ? completedSec + elapsed : completedSec;
  const pct = progressPercent(totalSec, task.targetMinutes);

  const hasJustCompleted = useRef(false);

  useEffect(() => {
    if (isActive && pct >= 100 && !hasJustCompleted.current) {
      hasJustCompleted.current = true;
      markCompleted(task._id);
    }
    if (!isActive) hasJustCompleted.current = false;
  }, [pct, isActive]);

  const handleStart = async () => {
    playStartSound();
    await startTask(task);
  };

  const handleStop = async () => {
    playClickSound();
    const day = await stopTask();
    if (day) await refreshDay();
  };

  const handleFocus = () => {
    if (isActive) setFocusMode(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`glass rounded-2xl p-4 md:p-5 transition-all duration-300 ${
        isActive ? 'ring-1' : completed ? 'opacity-75' : ''
      }`}
      style={{
        ringColor: isActive ? task.color : 'transparent',
        borderColor: isActive ? `${task.color}40` : undefined,
        boxShadow: isActive ? `0 0 24px ${task.color}22` : undefined,
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing mt-0.5 opacity-30 hover:opacity-60 transition-opacity">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="4" cy="4" r="1.5"/><circle cx="10" cy="4" r="1.5"/>
            <circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/>
          </svg>
        </div>

        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
          style={{ background: `${task.color}18` }}>
          {task.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{task.title}</h3>
            {completed && <CheckCircle2 size={14} className="flex-shrink-0 text-emerald-400" />}
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {formatMinutes(task.targetMinutes)} target
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {isActive && (
            <Tooltip content="Focus Mode">
              <button onClick={handleFocus} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: task.color }}>
                <Maximize2 size={13} />
              </button>
            </Tooltip>
          )}
          <Tooltip content="Edit Task">
            <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-500 hover:text-white">
              <Edit2 size={13} />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={isActive ? 'running' : 'stopped'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="font-mono text-xl font-bold timer-display"
                style={{ color: isActive ? task.color : undefined }}
              >
                {formatSeconds(totalSec)}
              </span>
              <span className="text-xs font-mono font-semibold" style={{ color: pct >= 100 ? '#10b981' : 'var(--text-muted)' }}>
                {pct}%
              </span>
            </div>
            <ProgressBar value={pct} color={completed ? '#10b981' : task.color} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-90 active:scale-98"
            style={{ background: `${task.color}22`, color: task.color, border: `1px solid ${task.color}33` }}
          >
            <Play size={12} fill="currentColor" />
            Start Session
          </button>
        ) : (
          <>
            <button
              onClick={handleStop}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
            >
              <Square size={12} fill="currentColor" />
              Stop
            </button>
            <button
              onClick={handleFocus}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-90"
              style={{ background: `${task.color}22`, color: task.color, border: `1px solid ${task.color}33` }}
            >
              <Maximize2 size={12} />
            </button>
          </>
        )}
      </div>

      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: `inset 0 0 40px ${task.color}08` }}
        />
      )}
    </motion.div>
  );
}
