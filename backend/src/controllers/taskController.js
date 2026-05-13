const Task = require('../models/Task');
const DayRecord = require('../models/DayRecord');
const { getTodayDate } = require('../utils/streakCalculator');

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id, isActive: true }).sort({ order: 1 });
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, targetMinutes, color, icon } = req.body;
    const count = await Task.countDocuments({ user: req.user._id, isActive: true });

    const task = await Task.create({
      user: req.user._id,
      title,
      targetMinutes: Number(targetMinutes),
      color: color || '#f59e0b',
      icon: icon || '📋',
      order: count,
    });

    const today = getTodayDate();
    await DayRecord.findOneAndUpdate(
      { user: req.user._id, date: today },
      {
        $addToSet: {
          taskProgress: {
            taskId: task._id,
            taskTitle: task.title,
            taskColor: task.color,
            targetMinutes: task.targetMinutes,
            completedSeconds: 0,
            isCompleted: false,
          },
        },
        $inc: { targetMinutes: task.targetMinutes },
      },
      { upsert: true }
    );

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isActive: false },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

const reorderTasks = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    const ops = orderedIds.map((id, index) =>
      Task.findOneAndUpdate({ _id: id, user: req.user._id }, { order: index })
    );
    await Promise.all(ops);
    res.json({ message: 'Tasks reordered' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, reorderTasks };
