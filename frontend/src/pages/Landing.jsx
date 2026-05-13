import { motion } from 'framer-motion';
import { CheckSquare, Flame, Timer, BarChart3, BookOpen, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/theme/ThemeToggle';
import MatrixBackground from '../components/theme/MatrixBackground';

const features = [
  { icon: Timer,    title: 'Live Timers',       desc: 'Background-persistent timers that survive tab switching and browser minimization.' },
  { icon: Flame,    title: 'Streak Tracking',   desc: 'Daily consistency streaks with automatic midnight archiving and heatmap visualization.' },
  { icon: BarChart3,title: 'GitHub Heatmap',    desc: 'Full-year contribution graph showing your daily study consistency and progress quality.' },
  { icon: BookOpen, title: 'Daily Journal',     desc: 'Rich daily notes with screenshot uploads and mood tracking for reflection.' },
  { icon: Zap,      title: 'Focus Mode',        desc: 'Immersive fullscreen focus sessions with cinematic transitions and ambient effects.' },
  { icon: CheckSquare,title:'Task System',      desc: 'Drag-to-reorder tasks with custom durations, colors, and real-time progress tracking.' },
];

export default function Landing() {
  const { loginWithGoogle } = useAuth();
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {isDark && <MatrixBackground />}

      {!isDark && (
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at 20% 30%, rgba(244,114,182,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(192,38,211,0.1) 0%, transparent 50%)',
          }}
        />
      )}

      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-dim)' }}>
            <CheckSquare size={16} style={{ color: 'var(--gold)' }} />
          </div>
          <span className="font-bold text-lg tracking-tight gradient-text">CHECKLIST</span>
        </div>
        <ThemeToggle />
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
            style={{ background: 'var(--gold-dim)', color: 'var(--gold)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Flame size={11} />
            Premium Productivity OS
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-none">
            Build{' '}
            <span className="gradient-text glow-text">Consistency.</span>
            <br />
            Ship Every Day.
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            CHECKLIST is your personal productivity operating system. Track study sessions, build coding streaks,
            maintain focus, and see your progress visualized beautifully.
          </p>

          <motion.button
            onClick={loginWithGoogle}
            whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(245,158,11,0.35)' }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200"
            style={{
              background: isDark ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #d946ef, #a21caf)',
              color: isDark ? '#0a0a0f' : '#fff',
              boxShadow: isDark ? '0 0 25px rgba(245,158,11,0.25)' : '0 0 25px rgba(192,38,211,0.25)',
            }}
          >
            <svg viewBox="0 0 48 48" className="w-5 h-5">
              <path fill={isDark ? '#0a0a0f' : '#fff'} d="M43.6 20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.8-5.8C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continue with Google
          </motion.button>

          <p className="text-xs mt-4" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            Free to use · No credit card required
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full mt-24"
        >
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              whileHover={{ y: -3 }}
              className="glass rounded-2xl p-5 text-left"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'var(--gold-dim)' }}>
                <Icon size={18} style={{ color: 'var(--gold)' }} />
              </div>
              <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="relative z-10 border-t py-6 text-center text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        CHECKLIST · Built for students and developers who build in public.
      </footer>
    </div>
  );
}
