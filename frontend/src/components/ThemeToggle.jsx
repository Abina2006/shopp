import React, { useEffect, useState } from 'react';

/**
 * ThemeToggle – a simple switch that toggles the `dark` class on the <html> element.
 * It persists the user's choice in localStorage so the preference survives page reloads.
 * The UI is a tiny rounded button with a sun/moon icon.
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Initialise from localStorage or prefer‑media query
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark(!isDark);

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FAFAF7] dark:bg-[#2A2A2A] border border-[#E5E7EB] dark:border-[#333333] hover:bg-[#E5E5E5] dark:hover:bg-[#3A3A3A] transition-colors"
      aria-label="Toggle dark mode"
    >
      {/* Sun for light mode, Moon for dark mode */}
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-[#E5E5E5]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-[#111111]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m8.66-12.66l-.71.71M5.05 18.95l-.71.71M21 12h-1M4 12H3m15.66 5.66l-.71-.71M5.05 5.05l-.71-.71"
          />
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      )}
    </button>
  );
}
