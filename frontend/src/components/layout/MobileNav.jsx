import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/history',   icon: History,         label: 'History'   },
  { to: '/settings',  icon: Settings,        label: 'Settings'  },
];

export default function MobileNav() {
  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t"
      style={{ borderColor: 'var(--border)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors
               ${isActive ? 'text-amber-400' : 'text-slate-500'}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}
