import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const variants = {
  primary: 'btn-primary',
  ghost:   'btn-ghost',
  danger:  'px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
  outline: 'px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 border border-white/10 hover:border-white/20 hover:bg-white/05 text-slate-300',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: '',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size    = 'md',
  className,
  loading,
  icon,
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={clsx(
        variants[variant],
        size !== 'md' && sizes[size],
        'flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
