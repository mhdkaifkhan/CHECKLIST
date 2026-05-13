import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, ListTodo } from 'lucide-react';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import { useTaskStore } from '../../utils/taskStore';
import Button from '../ui/Button';
import { EmptyState } from '../ui/LoadingSpinner';

function SortableTask({ task, taskProgress, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        taskProgress={taskProgress}
        onEdit={onEdit}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function TaskList() {
  const { tasks, dayRecord, reorderTasks } = useTaskStore();
  const [addOpen,  setAddOpen]  = useState(false);
  const [editTask, setEditTask] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const getProgress = (taskId) =>
    dayRecord?.taskProgress?.find(tp => tp.taskId === taskId || tp.taskId?._id === taskId);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = tasks.findIndex(t => t._id === active.id);
    const newIdx = tasks.findIndex(t => t._id === over.id);
    const reordered = arrayMove(tasks, oldIdx, newIdx);
    reorderTasks(reordered.map(t => t._id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-base">Today's Tasks</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {tasks.filter((t) => getProgress(t._id)?.isCompleted).length}/{tasks.length} completed
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} size="sm" icon={<Plus size={14} />}>
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks yet"
          description="Add your first task to start tracking your productivity sessions."
          action={
            <Button onClick={() => setAddOpen(true)} icon={<Plus size={14} />}>
              Add Your First Task
            </Button>
          }
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              <AnimatePresence>
                {tasks.map(task => (
                  <SortableTask
                    key={task._id}
                    task={task}
                    taskProgress={getProgress(task._id)}
                    onEdit={setEditTask}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}

      <AddTaskModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditTaskModal open={!!editTask} onClose={() => setEditTask(null)} task={editTask} />
    </div>
  );
}
