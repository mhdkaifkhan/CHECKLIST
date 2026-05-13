import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, eachDayOfInterval, subDays, startOfWeek, addDays } from 'date-fns';
import api from '../../utils/api';
import Tooltip from '../ui/Tooltip';
import { getCurrentYear, getMonthName } from '../../utils/dateUtils';

const getCellColor = (record, isDark) => {
  if (!record) return isDark ? '#1a1a24' : '#f0f0f5';
  const { completionPercent, status } = record;
  if (status === 'failed') return '#ef444433';
  if (status === 'skipped') return isDark ? '#2a2a3a' : '#e8e0f0';
  if (completionPercent >= 100) return '#10b981';
  if (completionPercent >= 75)  return '#34d399';
  if (completionPercent >= 50)  return '#6ee7b7';
  if (completionPercent >= 25)  return '#a7f3d0';
  if (completionPercent > 0)    return '#d1fae5';
  return isDark ? '#1a1a24' : '#f0f0f5';
};

export default function Heatmap({ isDark = true }) {
  const [records, setRecords] = useState({});
  const [tooltip, setTooltip] = useState(null);
  const [year]  = useState(getCurrentYear());

  useEffect(() => {
    api.get(`/days/heatmap?year=${year}`)
      .then(({ data }) => {
        const map = {};
        data.records.forEach(r => { map[r.date] = r; });
        setRecords(map);
      })
      .catch(() => {});
  }, [year]);

  const today = new Date();
  const start = subDays(today, 364);
  const days  = eachDayOfInterval({ start, end: today });

  const weeks = [];
  let currentWeek = [];
  const firstDay = startOfWeek(days[0], { weekStartsOn: 0 });

  let d = firstDay;
  while (d <= today) {
    const dayStr = format(d, 'yyyy-MM-dd');
    const inRange = d >= days[0];
    currentWeek.push({ date: dayStr, inRange });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    d = addDays(d, 1);
  }
  if (currentWeek.length) weeks.push(currentWeek);

  const MONTHS = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const month = parseISO(week[0].date).getMonth();
    if (month !== lastMonth) {
      MONTHS.push({ wi, month });
      lastMonth = month;
    }
  });

  const cellSize = 12;
  const gap      = 3;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Consistency Heatmap</h3>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>Less</span>
          {['#1a1a24','#d1fae5','#6ee7b7','#34d399','#10b981'].map(c => (
            <div key={c} className="heatmap-cell" style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div style={{ position: 'relative', paddingTop: 20 }}>
          {MONTHS.map(({ wi, month }) => (
            <span
              key={`${wi}-${month}`}
              className="absolute text-xs"
              style={{
                left: wi * (cellSize + gap),
                top: 0,
                color: 'var(--text-muted)',
                fontSize: 10,
                whiteSpace: 'nowrap',
              }}
            >
              {getMonthName(month)}
            </span>
          ))}

          <div style={{ display: 'flex', gap }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap }}>
                {week.map(({ date, inRange }) => {
                  const record = records[date];
                  const color  = inRange ? getCellColor(record, isDark) : 'transparent';
                  const isToday = date === format(today, 'yyyy-MM-dd');

                  return (
                    <div
                      key={date}
                      className="heatmap-cell"
                      style={{
                        width:  cellSize,
                        height: cellSize,
                        background: color,
                        outline: isToday ? `2px solid var(--gold)` : undefined,
                        outlineOffset: 1,
                      }}
                      onMouseEnter={() => inRange && setTooltip({ date, record })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {tooltip && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 px-3 py-2 rounded-xl text-xs glass-strong"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="font-semibold" style={{ color: 'var(--text)' }}>
            {format(parseISO(tooltip.date), 'MMMM d, yyyy')}
          </span>
          {tooltip.record ? (
            <span className="ml-2">
              · {tooltip.record.completionPercent}% complete
              {tooltip.record.status === 'failed' && ' · ❌ missed'}
              {tooltip.record.status === 'completed' && ' · ✓ done'}
            </span>
          ) : (
            <span className="ml-2">· No data</span>
          )}
        </motion.div>
      )}
    </div>
  );
}
