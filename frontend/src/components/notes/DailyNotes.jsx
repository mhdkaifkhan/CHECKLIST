import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, Image, X, Smile } from 'lucide-react';
import api from '../../utils/api';
import { getTodayString } from '../../utils/dateUtils';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const MOODS = [
  { key: 'great', label: '🔥', title: 'Great' },
  { key: 'good',  label: '😊', title: 'Good'  },
  { key: 'okay',  label: '😐', title: 'Okay'  },
  { key: 'bad',   label: '😔', title: 'Bad'   },
];

export default function DailyNotes({ date }) {
  const targetDate = date || getTodayString();
  const isToday    = targetDate === getTodayString();

  const [content,    setContent]    = useState('');
  const [mood,       setMood]       = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [dirty,      setDirty]      = useState(false);

  const saveTimer = useRef(null);
  const fileRef   = useRef(null);

  useEffect(() => {
    api.get(`/notes/${targetDate}`)
      .then(({ data }) => {
        if (data.note) {
          setContent(data.note.content || '');
          setMood(data.note.mood || null);
          setScreenshot(data.note.screenshot?.url || null);
        }
      })
      .catch(() => {});
  }, [targetDate]);

  const save = useCallback(async (c, m) => {
    setSaving(true);
    try {
      await api.put(`/notes/${targetDate}`, { content: c, mood: m });
      setDirty(false);
    } catch {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  }, [targetDate]);

  const handleChange = (e) => {
    const val = e.target.value;
    setContent(val);
    setDirty(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(val, mood), 1500);
  };

  const handleMood = (key) => {
    const next = mood === key ? null : key;
    setMood(next);
    save(content, next);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('screenshot', file);
    setUploading(true);
    try {
      const { data } = await api.post(`/notes/${targetDate}/screenshot`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setScreenshot(data.note.screenshot?.url);
      toast.success('Screenshot uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDeleteScreenshot = async () => {
    try {
      await api.delete(`/notes/${targetDate}/screenshot`);
      setScreenshot(null);
      toast.success('Screenshot removed');
    } catch {
      toast.error('Failed to remove screenshot');
    }
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Daily Journal</h3>
        <div className="flex items-center gap-2">
          {dirty && (
            <Button size="sm" variant="ghost" loading={saving} onClick={() => save(content, mood)} icon={<Save size={12} />}>
              Save
            </Button>
          )}
          {saving && !dirty && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Saved</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {MOODS.map(({ key, label, title }) => (
          <button
            key={key}
            onClick={() => isToday && handleMood(key)}
            title={title}
            className={`w-9 h-9 rounded-xl text-xl transition-all flex items-center justify-center ${
              mood === key ? 'ring-2 scale-110' : 'opacity-50 hover:opacity-80'
            }`}
            style={{ background: 'var(--surface-2)', ringColor: 'var(--gold)' }}
            disabled={!isToday}
          >
            {label}
          </button>
        ))}
        <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>
          {mood ? `Feeling ${mood}` : 'How was today?'}
        </span>
      </div>

      <textarea
        value={content}
        onChange={handleChange}
        disabled={!isToday}
        placeholder="Write about your day — what went well, what you learned, what you'll improve..."
        rows={5}
        className="input-base resize-none font-sans leading-relaxed"
        style={{ minHeight: 120 }}
      />

      <div className="mt-3">
        {screenshot ? (
          <div className="relative group rounded-xl overflow-hidden">
            <img src={screenshot} alt="Daily screenshot" className="w-full h-40 object-cover rounded-xl" />
            {isToday && (
              <button
                onClick={handleDeleteScreenshot}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : isToday ? (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full py-3 rounded-xl border border-dashed text-sm flex items-center justify-center gap-2 transition-colors hover:border-amber-500/30"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            {uploading ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Image size={14} />
            )}
            {uploading ? 'Uploading...' : 'Upload screenshot (max 5MB)'}
          </button>
        ) : null}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>
    </div>
  );
}
