import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import api from '../utils/api';
import { playCompletionSound } from '../utils/sound';

const TimerContext = createContext(null);

export const TimerProvider = ({ children }) => {
  const [activeTaskId, setActiveTaskId]     = useState(null);
  const [sessionId, setSessionId]           = useState(null);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [elapsed, setElapsed]               = useState(0);
  const [focusMode, setFocusMode]           = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState(new Set());

  const intervalRef   = useRef(null);
  const completedRef  = useRef(new Set());

  const tick = useCallback(() => {
    if (startTimestamp) {
      setElapsed(Math.floor((Date.now() - startTimestamp) / 1000));
    }
  }, [startTimestamp]);

  useEffect(() => {
    if (startTimestamp) {
      intervalRef.current = setInterval(tick, 500);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [startTimestamp, tick]);

  const startTask = useCallback(async (task) => {
    if (activeTaskId && activeTaskId !== task._id) {
      await stopCurrent();
    }

    try {
      const { data } = await api.post('/days/session/start', { taskId: task._id });
      setActiveTaskId(task._id);
      setSessionId(data.sessionId);
      setStartTimestamp(Date.now());
      setElapsed(0);
    } catch (err) {
      console.error('Failed to start session:', err.message);
    }
  }, [activeTaskId]);

  const stopCurrent = useCallback(async () => {
    if (!sessionId || !startTimestamp) return null;

    const duration = Math.floor((Date.now() - startTimestamp) / 1000);
    try {
      const { data } = await api.post('/days/session/stop', {
        sessionId,
        durationSeconds: duration,
      });
      setActiveTaskId(null);
      setSessionId(null);
      setStartTimestamp(null);
      setElapsed(0);
      setFocusMode(false);
      return data.dayRecord;
    } catch (err) {
      console.error('Failed to stop session:', err.message);
      return null;
    }
  }, [sessionId, startTimestamp]);

  const stopTask = useCallback(async () => {
    return await stopCurrent();
  }, [stopCurrent]);

  const markCompleted = useCallback((taskId) => {
    if (!completedRef.current.has(taskId)) {
      completedRef.current.add(taskId);
      setCompletedTaskIds(new Set(completedRef.current));
      playCompletionSound();
    }
  }, []);

  const isRunning = !!activeTaskId && !!startTimestamp;

  return (
    <TimerContext.Provider value={{
      activeTaskId,
      sessionId,
      elapsed,
      isRunning,
      focusMode,
      setFocusMode,
      completedTaskIds,
      startTask,
      stopTask,
      markCompleted,
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be inside TimerProvider');
  return ctx;
};
