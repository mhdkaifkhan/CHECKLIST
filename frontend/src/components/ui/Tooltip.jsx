import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tooltip({ children, content, side = 'top' }) {
  const [visible, setVisible] = useState(false);

  const pos = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full  left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full  top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-flex" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      <AnimatePresence>
        {visible && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.1 }}
            className={`absolute z-50 pointer-events-none whitespace-nowrap ${pos[side]}`}
          >
            <div className="px-2.5 py-1.5 rounded-lg text-xs font-medium glass-strong text-white shadow-lg">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
