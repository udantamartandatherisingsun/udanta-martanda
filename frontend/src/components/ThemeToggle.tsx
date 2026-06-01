'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLight(document.documentElement.classList.contains('light'));
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  if (!mounted) {
    return (
      <div className="nav-icon" style={{ cursor: 'pointer' }} title="Toggle Theme">
        <Sun size={14} style={{ opacity: 0 }} />
      </div>
    );
  }

  return (
    <div className="nav-icon" onClick={toggleTheme} style={{ cursor: 'pointer' }} title="Toggle Theme">
      {isLight ? <Moon size={14} /> : <Sun size={14} />}
    </div>
  );
}
