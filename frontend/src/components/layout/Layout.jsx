import { useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useTimer } from '../../context/TimerContext';
import FocusMode from '../timer/FocusMode';
import MatrixBackground from '../theme/MatrixBackground';
import { useTheme } from '../../context/ThemeContext';

export default function Layout({ children }) {
  const { focusMode } = useTimer();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? '' : 'theme-light'}`}>
      {isDark && <MatrixBackground />}
      <Sidebar />
      <main className="md:ml-60 min-h-screen pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8 page-enter">
          {children}
        </div>
      </main>
      <MobileNav />
      {focusMode && <FocusMode />}
    </div>
  );
}
