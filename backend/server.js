const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const cron = require('node-cron');
const dotenv = require('dotenv');

dotenv.config();

require('./src/config/passport');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/auth');
const taskRoutes = require('./src/routes/tasks');
const dayRoutes = require('./src/routes/days');
const noteRoutes = require('./src/routes/notes');

const app = express();

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://checklist-ten-sigma.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'checklist-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/days', dayRoutes);
app.use('/api/notes', noteRoutes);

cron.schedule('0 0 * * *', async () => {
  try {
    const { runMidnightArchive } = require('./src/utils/streakCalculator');
    await runMidnightArchive();
    console.log('[CRON] Midnight archive completed');
  } catch (err) {
    console.error('[CRON] Error during midnight archive:', err.message);
  }
}, { timezone: 'UTC' });

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 CHECKLIST server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Frontend: ${process.env.FRONTEND_URL || 'https://checklist-ten-sigma.vercel.app'}\n`);
});

module.exports = app;
