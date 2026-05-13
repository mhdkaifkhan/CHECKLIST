import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/05 text-sm"
      style={{ color: 'var(--text-muted)' }}
      title="Toggle theme"
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0,   opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? <Moon size={15} /> : <Sun size={15} />}
      </motion.div>
      <span className="text-xs font-medium">{isDark ? 'Dark Theme' : 'Light Theme'}</span>
      <div className="ml-auto w-8 h-4 rounded-full relative transition-colors duration-300" style={{ background: isDark ? 'rgba(245,158,11,0.3)' : 'rgba(192,38,211,0.3)' }}>
        <motion.div
          layout
          className="absolute top-0.5 w-3 h-3 rounded-full"
          style={{ background: isDark ? '#f59e0b' : '#d946ef' }}
          animate={{ left: isDark ? '2px' : '18px' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      </div>
    </button>
  );
}
