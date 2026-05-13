import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TaskList from '../components/tasks/TaskList';
import Heatmap from '../components/heatmap/Heatmap';
import DailyNotes from '../components/notes/DailyNotes';
import { useTaskStore } from '../utils/taskStore';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Dashboard() {
  const { fetchTasks, dayRecord, loading } = useTaskStore();
  const { isDark } = useTheme();

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="h-96 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading your workspace..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DashboardHeader dayRecord={dayRecord} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TaskList />
          </div>

          <div className="space-y-5">
            <DailyNotes />
          </div>
        </div>

        <div className="mt-8">
          <Heatmap isDark={isDark} />
        </div>
      </motion.div>
    </Layout>
  );
}
