const User = require('../models/User');
const DayRecord = require('../models/DayRecord');
const Task = require('../models/Task');

const getTodayDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const getYesterdayDate = () => {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return now.toISOString().split('T')[0];
};

const updateUserStreak = async (userId, date) => {
  const user = await User.findById(userId);
  if (!user) return;

  const yesterday = getYesterdayDate();
  let newStreak = 1;

  if (user.lastActiveDate === yesterday) {
    newStreak = user.streak + 1;
  } else if (user.lastActiveDate === date) {
    return;
  }

  user.streak = newStreak;
  user.longestStreak = Math.max(user.longestStreak, newStreak);
  user.lastActiveDate = date;
  await user.save();

  return user;
};

const runMidnightArchive = async () => {
  const yesterday = getYesterdayDate();
  const today = getTodayDate();

  const activeDays = await DayRecord.find({ date: yesterday, status: 'active' });

  for (const day of activeDays) {
    const isCompleted = day.allTasksCompleted;
    day.status = isCompleted ? 'completed' : 'failed';

    if (isCompleted && !day.streakCounted) {
      day.streakCounted = true;
      await updateUserStreak(day.user, yesterday);
    } else if (!isCompleted) {
      await User.findByIdAndUpdate(day.user, { streak: 0 });
    }

    await day.save();
  }

  const usersWithActiveDays = activeDays.map(d => d.user);
  for (const userId of usersWithActiveDays) {
    const tasks = await Task.find({ user: userId, isActive: true }).sort({ order: 1 });
    const user = await User.findById(userId);

    if (!tasks.length) continue;

    const taskProgress = tasks.map(t => ({
      taskId: t._id,
      taskTitle: t.title,
      taskColor: t.color,
      targetMinutes: t.targetMinutes,
      completedSeconds: 0,
      isCompleted: false,
    }));

    await DayRecord.findOneAndUpdate(
      { user: userId, date: today },
      {
        $setOnInsert: {
          user: userId,
          date: today,
          targetMinutes: tasks.reduce((s, t) => s + t.targetMinutes, 0),
          completedSeconds: 0,
          taskProgress,
          sessions: [],
          status: 'active',
        },
      },
      { upsert: true }
    );
  }

  console.log(`[ARCHIVE] Processed ${activeDays.length} day records for ${yesterday}`);
};

module.exports = { getTodayDate, getYesterdayDate, updateUserStreak, runMidnightArchive };
