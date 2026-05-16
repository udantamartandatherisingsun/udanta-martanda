'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="search-overlay open"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            onClick={onClose}
            style={{ 
              position: 'absolute', 
              top: '40px', 
              right: '44px', 
              background: 'none', 
              border: 'none', 
              color: 'var(--ink3)', 
              cursor: 'pointer' 
            }}
          >
            <X size={32} />
          </button>

          <div className="search-box">
            <motion.input 
              ref={inputRef}
              type="text" 
              placeholder="Search the archives..." 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            />
            <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
              <span className="sec-aside">TRENDING:</span>
              <a href="#" className="sec-link">Artificial Intelligence</a>
              <a href="#" className="sec-link">Climate Change</a>
              <a href="#" className="sec-link">Election 2026</a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
