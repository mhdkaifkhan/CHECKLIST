import { format, isToday, isYesterday, parseISO, differenceInDays, startOfWeek, eachDayOfInterval, subDays } from 'date-fns';

export const getTodayString = () => format(new Date(), 'yyyy-MM-dd');

export const formatDate = (dateStr) => {
  const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMMM d, yyyy');
};

export const formatDateShort = (dateStr) => {
  const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(d, 'MMM d');
};

export const formatDayOfWeek = (dateStr) => {
  const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(d, 'EEEE');
};

export const getDayLabel = (dateStr) => {
  const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(d, 'EEEE, MMMM d');
};

export const getWeekDays = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end: new Date() });
};

export const getLast365Days = () => {
  const today = new Date();
  return eachDayOfInterval({ start: subDays(today, 364), end: today });
};

export const daysBetween = (a, b) => differenceInDays(
  typeof a === 'string' ? parseISO(a) : a,
  typeof b === 'string' ? parseISO(b) : b
);

export const getCurrentYear = () => new Date().getFullYear();

export const getMonthName = (month) =>
  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month];
