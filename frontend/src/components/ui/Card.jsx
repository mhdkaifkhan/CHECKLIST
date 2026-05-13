import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function Card({ children, className, hover = true, glow, onClick, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={hover ? { y: -2 } : undefined}
      onClick={onClick}
      className={clsx(
        'card',
        glow && 'shadow-glow-gold',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={clsx('font-semibold text-sm tracking-wide uppercase', 'text-slate-400', className)}>
      {children}
    </h3>
  );
}
