import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function ProgressBar({ value = 0, color, className, showLabel }) {
  const pct = Math.min(100, Math.max(0, value));
  const barColor = color || (pct >= 100 ? '#10b981' : '#f59e0b');

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-end mb-1">
          <span className="text-xs font-mono" style={{ color: barColor }}>{pct}%</span>
        </div>
      )}
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: barColor, boxShadow: `0 0 8px ${barColor}66` }}
        />
      </div>
    </div>
  );
}

export function ProgressRing({ value = 0, size = 80, stroke = 6, color, children }) {
  const pct      = Math.min(100, Math.max(0, value));
  const r        = (size - stroke) / 2;
  const circ     = 2 * Math.PI * r;
  const offset   = circ - (pct / 100) * circ;
  const ringColor = color || (pct >= 100 ? '#10b981' : '#f59e0b');

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 4px ${ringColor}88)` }}
          className="progress-ring__circle"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
