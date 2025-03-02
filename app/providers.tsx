'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { AppData } from '@/lib/types';
import { initializeDataManager } from '@/lib/data-manager';
import { migrateData, needsMigration } from '@/lib/migrations';
import { isOnline, requestStoragePersistence, isStoragePersisted } from '@/lib/storage';

// Create a context for the app data
interface DataContextType {
  isLoading: boolean;
  isError: boolean;
  data: AppData | null;
  refreshData: () => Promise<void>;
  isOnline: boolean;
  isPersisted: boolean;
  requestPersistence: () => Promise<boolean>;
}

const DataContext = createContext<DataContextType>({
  isLoading: true,
  isError: false,
  data: null,
  refreshData: async () => {},
  isOnline: true,
  isPersisted: false,
  requestPersistence: async () => false,
});

// Hook to use the data context
export const useAppData = () => useContext(DataContext);

// Provider component
export function Providers({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<AppData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [persistedStatus, setPersistedStatus] = useState(false);

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
  const refreshData = useCallback(async () => {
    await loadData();
  }, []);

  // Check online status and set up listeners
  useEffect(() => {
    if (mounted) {
      // Set initial online status
      setOnlineStatus(isOnline());
      
      // Set up event listeners for online/offline events
      const handleOnline = () => {
        setOnlineStatus(true);
        // Refresh data when coming back online
        refreshData();
      };
      
      const handleOffline = () => {
        setOnlineStatus(false);
      };
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Check storage persistence status
      const checkPersistence = async () => {
        const persisted = await isStoragePersisted();
        setPersistedStatus(persisted);
        
        // If not persisted, try to request it automatically
        if (!persisted) {
          const granted = await requestStoragePersistence();
          setPersistedStatus(granted);
        }
      };
      
      checkPersistence();
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [mounted]);

  // Function to request storage persistence
  const requestPersistence = async (): Promise<boolean> => {
    const granted = await requestStoragePersistence();
    setPersistedStatus(granted);
    return granted;
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
      refreshData();
    }
  }, [mounted, refreshData]);

  return (
    <DataContext.Provider
      value={{
        isLoading,
        isError,
        data,
        refreshData,
        isOnline: onlineStatus,
        isPersisted: persistedStatus,
        requestPersistence,
      }}
    >
      {children}
      {!onlineStatus && (
        <div className="fixed bottom-4 left-4 right-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded-md shadow-md text-sm text-center">
          You are currently offline. Changes will be saved locally and synced when you reconnect.
        </div>
      )}
    </DataContext.Provider>
  );
} 