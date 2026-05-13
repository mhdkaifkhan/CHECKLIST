const DayRecord = require('../models/DayRecord');
const Task = require('../models/Task');
const User = require('../models/User');
const { getTodayDate, updateUserStreak } = require('../utils/streakCalculator');

const getToday = async (req, res, next) => {
  try {
    const today = getTodayDate();
    const tasks = await Task.find({ user: req.user._id, isActive: true }).sort({ order: 1 });

    let dayRecord = await DayRecord.findOne({ user: req.user._id, date: today });

    if (!dayRecord) {
      const taskProgress = tasks.map(t => ({
        taskId: t._id,
        taskTitle: t.title,
        taskColor: t.color,
        targetMinutes: t.targetMinutes,
        completedSeconds: 0,
        isCompleted: false,
      }));
      const totalTarget = tasks.reduce((sum, t) => sum + t.targetMinutes, 0);

      dayRecord = await DayRecord.create({
        user: req.user._id,
        date: today,
        targetMinutes: totalTarget,
        completedSeconds: 0,
        taskProgress,
        sessions: [],
        status: 'active',
      });
    }

    res.json({ dayRecord, user: req.user });
  } catch (err) {
    next(err);
  }
};

const startSession = async (req, res, next) => {
  try {
    const { taskId } = req.body;
    const today = getTodayDate();
    const task = await Task.findOne({ _id: taskId, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const dayRecord = await DayRecord.findOneAndUpdate(
      { user: req.user._id, date: today },
      {
        $push: {
          sessions: {
            taskId: task._id,
            taskTitle: task.title,
            taskColor: task.color,
            startTime: new Date(),
            targetMinutes: task.targetMinutes,
          },
        },
      },
      { new: true, upsert: true }
    );

    const session = dayRecord.sessions[dayRecord.sessions.length - 1];
    res.json({ session, sessionId: session._id });
  } catch (err) {
    next(err);
  }
};

const stopSession = async (req, res, next) => {
  try {
    const { sessionId, durationSeconds } = req.body;
    const today = getTodayDate();
    const duration = Math.max(0, Math.round(Number(durationSeconds)));

    const dayRecord = await DayRecord.findOne({ user: req.user._id, date: today });
    if (!dayRecord) return res.status(404).json({ message: 'Day record not found' });

    const session = dayRecord.sessions.id(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.endTime = new Date();
    session.durationSeconds = duration;

    const taskProgress = dayRecord.taskProgress.find(
      tp => tp.taskId.toString() === session.taskId.toString()
    );

    if (taskProgress) {
      taskProgress.completedSeconds += duration;
      taskProgress.isCompleted =
        taskProgress.completedSeconds >= taskProgress.targetMinutes * 60;
    }

    dayRecord.completedSeconds += duration;
    await dayRecord.save();

    const allDone = dayRecord.allTasksCompleted;
    if (allDone && !dayRecord.streakCounted) {
      dayRecord.streakCounted = true;
      dayRecord.status = 'completed';
      await dayRecord.save();
      await updateUserStreak(req.user._id, today);
    }

    res.json({ dayRecord });
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      DayRecord.find({ user: req.user._id, status: { $ne: 'active' } })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      DayRecord.countDocuments({ user: req.user._id, status: { $ne: 'active' } }),
    ]);

    res.json({ records, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const getHeatmapData = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const records = await DayRecord.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).select('date completionPercent status allTasksCompleted completedSeconds');

    res.json({ records });
  } catch (err) {
    next(err);
  }
};

module.exports = { getToday, startSession, stopSession, getHistory, getHeatmapData };
