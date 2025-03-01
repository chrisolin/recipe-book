'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppData } from '@/lib/types';
import { initializeDataManager } from '@/lib/data-manager';
import { migrateData, needsMigration } from '@/lib/migrations';

// Create a context for the app data
interface DataContextType {
  isLoading: boolean;
  isError: boolean;
  data: AppData | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  isLoading: true,
  isError: false,
  data: null,
  refreshData: async () => {},
});

// Hook to use the data context
export const useAppData = () => useContext(DataContext);

// Provider component
export function Providers({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<AppData | null>(null);
  const [mounted, setMounted] = useState(false);

  // Function to load data
  const loadData = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      // Initialize the data manager
      let appData = await initializeDataManager();
      
      // Check if data needs migration
      if (needsMigration(appData)) {
        appData = migrateData(appData);
      }
      
      setData(appData);
    } catch (error) {
      console.error('Failed to load app data:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to refresh data
  const refreshData = async () => {
    await loadData();
  };

  // Apply theme from localStorage on client-side
  useEffect(() => {
    if (mounted) {
      const theme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
      const root = window.document.documentElement;
      
      // Remove any existing theme classes
      root.classList.remove('light', 'dark');
      
      if (theme === 'system' || !theme) {
        // Check system preference
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        root.classList.add(systemPreference);
      } else {
        // Apply the selected theme
        root.classList.add(theme);
      }
    }
  }, [mounted]);

  return (
    <DataContext.Provider
      value={{
        isLoading,
        isError,
        data,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
} 