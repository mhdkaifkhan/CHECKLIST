import { motion } from 'framer-motion';
import { getDayLabel } from '../../utils/dateUtils';
import { formatMinutes } from '../../utils/formatTime';
import { ProgressRing } from '../ui/Progress';
import { useAuth } from '../../context/AuthContext';
import { Flame, Target, Clock, TrendingUp } from 'lucide-react';

export default function DashboardHeader({ dayRecord }) {
  const { user } = useAuth();
  const today = new Date();

  const completedMin  = dayRecord ? Math.floor(dayRecord.completedSeconds / 60) : 0;
  const targetMin     = dayRecord?.targetMinutes || 0;
  const pct           = dayRecord?.completionPercent || 0;

  const stats = [
    { label: 'Streak',    value: `${user?.streak || 0}d`, icon: Flame,     color: '#f59e0b' },
    { label: 'Target',    value: formatMinutes(targetMin),  icon: Target,    color: '#3b82f6' },
    { label: 'Completed', value: formatMinutes(completedMin), icon: Clock,   color: '#10b981' },
    { label: 'Progress',  value: `${pct}%`,                  icon: TrendingUp, color: '#8b5cf6' },
  ];

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-6"
      >
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--gold)', opacity: 0.7 }}>
            {today.toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">
            {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {pct >= 100
              ? '🎉 All tasks completed — excellent work!'
              : pct > 0
              ? `${pct}% complete — keep going!`
              : 'Start your first session for today'}
          </p>
        </div>

        <ProgressRing value={pct} size={72} stroke={5}>
          <span className="text-xs font-bold font-mono">{pct}%</span>
        </ProgressRing>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
              <motion.p
                key={value}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-base font-mono"
                style={{ color }}
              >
                {value}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
