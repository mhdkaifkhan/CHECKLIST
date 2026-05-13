import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, History, Settings, LogOut, Flame, CheckSquare } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../theme/ThemeToggle';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/history',   icon: History,         label: 'History'   },
  { to: '/settings',  icon: Settings,        label: 'Settings'  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 z-40 glass border-r"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="p-5 flex items-center gap-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(192,38,211,0.15)' }}>
          <CheckSquare size={16} className={isDark ? 'text-amber-400' : 'text-purple-500'} />
        </div>
        <span className="font-bold text-base tracking-tight gradient-text">CHECKLIST</span>
      </div>

      {user?.streak > 0 && (
        <div className="mx-4 mt-4 px-3 py-2 rounded-xl flex items-center gap-2" style={{ background: 'rgba(245,158,11,0.08)' }}>
          <Flame size={14} className="text-amber-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-amber-400">{user.streak} day streak</span>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1 mt-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
        <ThemeToggle />
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
          <Avatar src={user?.avatar} name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-500" title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
