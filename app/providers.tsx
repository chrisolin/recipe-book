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

  // Function to refresh data
  const refreshData = async () => {
    await loadData();
  };

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