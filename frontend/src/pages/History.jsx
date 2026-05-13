import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Calendar, ChevronRight, CheckCircle2, XCircle, Clock, TrendingUp, BookOpen } from 'lucide-react';
import Layout from '../components/layout/Layout';
import DailyNotes from '../components/notes/DailyNotes';
import { ProgressBar } from '../components/ui/Progress';
import { EmptyState } from '../components/ui/LoadingSpinner';
import api from '../utils/api';
import { formatMinutes } from '../utils/formatTime';

const StatusIcon = ({ status }) => {
  if (status === 'completed') return <CheckCircle2 size={14} className="text-emerald-400" />;
  if (status === 'failed')    return <XCircle size={14} className="text-red-400" />;
  return <Clock size={14} className="text-slate-400" />;
};

const statusLabel = {
  completed: { label: 'Completed', color: '#10b981' },
  failed:    { label: 'Missed',    color: '#ef4444' },
  skipped:   { label: 'Skipped',   color: '#64748b' },
  active:    { label: 'Active',    color: '#f59e0b' },
};

export default function History() {
  const [records,  setRecords]  = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [hasMore,  setHasMore]  = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/days/history?page=${page}&limit=20`);
        setRecords(prev => page === 1 ? data.records : [...prev, ...data.records]);
        setHasMore(page < data.pages);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">History</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Browse your past sessions and progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-2">
            {loading && page === 1 ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : records.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No history yet"
                description="Complete your first full day to see history here."
              />
            ) : (
              <>
                {records.map((rec, i) => {
                  const s = statusLabel[rec.status] || statusLabel.skipped;
                  const isSelected = selected?._id === rec._id;

                  return (
                    <motion.button
                      key={rec._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelected(isSelected ? null : rec)}
                      className={`w-full text-left glass rounded-xl p-4 transition-all duration-150 ${
                        isSelected ? 'ring-1' : 'hover:bg-white/5'
                      }`}
                      style={{ ringColor: s.color }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-sm">
                            {format(parseISO(rec.date), 'MMMM d, yyyy')}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {format(parseISO(rec.date), 'EEEE')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <StatusIcon status={rec.status} />
                          <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
                        </div>
                      </div>

                      <ProgressBar value={rec.completionPercent} color={s.color} />

                      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>{formatMinutes(Math.floor(rec.completedSeconds / 60))} completed</span>
                        <span>{rec.completionPercent}%</span>
                      </div>
                    </motion.button>
                  );
                })}

                {hasMore && (
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={loading}
                    className="w-full py-3 text-sm font-medium rounded-xl glass transition-colors hover:bg-white/05"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {loading ? 'Loading...' : 'Load more'}
                  </button>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <div className="glass rounded-2xl p-5">
                    <h2 className="font-bold text-base mb-4">
                      {format(parseISO(selected.date), 'EEEE, MMMM d, yyyy')}
                    </h2>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Completed', value: formatMinutes(Math.floor(selected.completedSeconds / 60)), icon: Clock, color: '#10b981' },
                        { label: 'Target',    value: formatMinutes(selected.targetMinutes), icon: TrendingUp, color: '#3b82f6' },
                        { label: 'Progress',  value: `${selected.completionPercent}%`,     icon: CheckCircle2, color: '#f59e0b' },
                      ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
                          <Icon size={14} className="mb-1.5" style={{ color }} />
                          <p className="font-bold text-sm" style={{ color }}>{value}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                        </div>
                      ))}
                    </div>

                    {selected.taskProgress?.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Task Breakdown</p>
                        {selected.taskProgress.map(tp => (
                          <div key={tp.taskId} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tp.taskColor }} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm truncate">{tp.taskTitle}</span>
                                <span className="text-xs font-mono ml-2 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                                  {formatMinutes(Math.floor(tp.completedSeconds / 60))}
                                </span>
                              </div>
                              <ProgressBar
                                value={Math.min(100, Math.round((tp.completedSeconds / (tp.targetMinutes * 60)) * 100))}
                                color={tp.isCompleted ? '#10b981' : tp.taskColor}
                              />
                            </div>
                            {tp.isCompleted && <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <DailyNotes date={selected.date} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="h-64 flex flex-col items-center justify-center gap-3 glass rounded-2xl"
                >
                  <BookOpen size={24} style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select a day to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
