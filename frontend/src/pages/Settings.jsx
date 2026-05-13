import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Target, Palette, LogOut, Save, Flame, Trophy } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import ThemeToggle from '../components/theme/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [targetHours, setTargetHours] = useState(user?.targetHours || 8);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/preferences', { targetHours: Number(targetHours) });
      updateUser(data.user);
      toast.success('Preferences saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl space-y-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage your account and preferences</p>
        </div>

        {/* Profile */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={15} style={{ color: 'var(--gold)' }} />
            <h2 className="font-semibold text-sm">Profile</h2>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--surface-2)' }}>
            <Avatar src={user?.avatar} name={user?.name} size="lg" />
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>Signed in via Google</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={15} style={{ color: 'var(--gold)' }} />
            <h2 className="font-semibold text-sm">Your Stats</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Current Streak', value: `${user?.streak || 0} days`, icon: Flame,  color: '#f59e0b' },
              { label: 'Longest Streak', value: `${user?.longestStreak || 0} days`, icon: Trophy, color: '#8b5cf6' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--surface-2)' }}>
                <Icon size={18} style={{ color }} />
                <div>
                  <p className="font-bold text-base" style={{ color }}>{value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target size={15} style={{ color: 'var(--gold)' }} />
            <h2 className="font-semibold text-sm">Daily Goal</h2>
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              Target hours per day (reference only — actual targets come from your tasks)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={16}
                value={targetHours}
                onChange={e => setTargetHours(e.target.value)}
                className="flex-1 accent-amber-500"
              />
              <span className="font-mono font-bold w-14 text-right" style={{ color: 'var(--gold)' }}>
                {targetHours}h
              </span>
            </div>
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
              <span>1h</span><span>8h</span><span>16h</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} loading={saving} size="sm" icon={<Save size={13} />}>Save Changes</Button>
          </div>
        </div>

        {/* Theme */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={15} style={{ color: 'var(--gold)' }} />
            <h2 className="font-semibold text-sm">Appearance</h2>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
            <ThemeToggle />
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            Dark: Matte black with gold accents — Coder aesthetic<br />
            Light: Royal white-pink with floral gradients — Elegant aesthetic
          </p>
        </div>

        {/* Danger */}
        <div className="glass rounded-2xl p-5 border border-red-500/10">
          <h2 className="font-semibold text-sm text-red-400 mb-3">Account</h2>
          <Button variant="danger" onClick={handleLogout} icon={<LogOut size={14} />}>
            Sign Out
          </Button>
        </div>
      </motion.div>
    </Layout>
  );
}
