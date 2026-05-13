import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} border-2 border-amber-500/20 border-t-amber-500 rounded-full`}
      />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50" style={{ background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold gradient-text tracking-tight">CHECKLIST</h1>
          <p className="text-sm text-slate-500 mt-1">Loading your workspace...</p>
        </div>
      </motion.div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(245,158,11,0.08)' }}>
          <Icon size={28} className="text-amber-500/60" />
        </div>
      )}
      <h3 className="font-semibold text-base mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-5 max-w-xs">{description}</p>}
      {action}
    </motion.div>
  );
}
