'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [mounted, setMounted] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Get the current theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    setTheme(savedTheme || 'system');
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      // Check system preference
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemPreference);
    } else {
      // Apply the selected theme
      root.classList.add(theme);
    }
    
    // Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    if (!mounted) return;
    
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'light';
      
      // If system, check the current system preference and switch to the opposite
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      return systemPreference === 'dark' ? 'light' : 'dark';
    });
  };

  // Determine if dark mode is active
  const isDarkMode = mounted && (
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Avoid rendering the toggle with the wrong icon during SSR
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 opacity-0"
        disabled
      >
        <Moon className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="relative h-9 w-9 overflow-hidden rounded-md transition-colors hover:bg-muted/80"
    >
      <div className="relative h-full w-full">
        {/* Sun icon */}
        <Sun 
          className={`absolute h-4 w-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-spring ${
            isDarkMode 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`} 
        />
        
        {/* Moon icon */}
        <Moon 
          className={`absolute h-4 w-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-spring ${
            !isDarkMode 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`} 
        />
      </div>
    </Button>
  );
} 