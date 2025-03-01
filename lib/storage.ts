/**
 * Storage utilities for interacting with Origin Private File System (OPFS)
 */
import { AppData } from './types';

// Constants
const DATA_FILE_NAME = 'family-meal-planner-data.json';
const CURRENT_DATA_VERSION = 1;

// Default empty app data
export const DEFAULT_APP_DATA: AppData = {
  recipes: {},
  mealPlans: {},
  shoppingLists: {},
  version: CURRENT_DATA_VERSION,
  lastUpdated: new Date().toISOString(),
};

/**
 * Check if OPFS is supported in the current browser
 */
export const isOPFSSupported = (): boolean => {
  return typeof window !== 'undefined' && 'storage' in navigator && 'getDirectory' in navigator.storage;
};

/**
 * Get the OPFS root directory
 */
export const getOPFSRoot = async (): Promise<FileSystemDirectoryHandle | null> => {
  if (!isOPFSSupported()) {
    console.warn('OPFS is not supported in this browser');
    return null;
  }

  try {
    return await navigator.storage.getDirectory();
  } catch (error) {
    console.error('Failed to get OPFS root directory:', error);
    return null;
  }
};

/**
 * Save data to OPFS
 */
export const saveToOPFS = async (data: AppData): Promise<boolean> => {
  const root = await getOPFSRoot();
  if (!root) return false;

  try {
    // Update the lastUpdated timestamp
    data.lastUpdated = new Date().toISOString();
    
    // Create a file handle
    const fileHandle = await root.getFileHandle(DATA_FILE_NAME, { create: true });
    
    // Create a writable stream
    const writable = await fileHandle.createWritable();
    
    // Write the data as JSON
    await writable.write(JSON.stringify(data, null, 2));
    
    // Close the stream
    await writable.close();
    
    return true;
  } catch (error) {
    console.error('Failed to save data to OPFS:', error);
    return false;
  }
};

/**
 * Load data from OPFS
 */
export const loadFromOPFS = async (): Promise<AppData | null> => {
  const root = await getOPFSRoot();
  if (!root) return null;

  try {
    // Get the file handle
    const fileHandle = await root.getFileHandle(DATA_FILE_NAME);
    
    // Get the file
    const file = await fileHandle.getFile();
    
    // Read the file as text
    const text = await file.text();
    
    // Parse the JSON
    const data = JSON.parse(text) as AppData;
    
    return data;
  } catch (error) {
    // If the file doesn't exist, return null
    if ((error as any).name === 'NotFoundError') {
      console.info('No existing data found in OPFS');
      return null;
    }
    
    console.error('Failed to load data from OPFS:', error);
    return null;
  }
};

/**
 * Delete data from OPFS
 */
export const deleteFromOPFS = async (): Promise<boolean> => {
  const root = await getOPFSRoot();
  if (!root) return false;

  try {
    await root.removeEntry(DATA_FILE_NAME);
    return true;
  } catch (error) {
    // If the file doesn't exist, consider it a success
    if ((error as any).name === 'NotFoundError') {
      return true;
    }
    
    console.error('Failed to delete data from OPFS:', error);
    return false;
  }
};

/**
 * Fallback to localStorage if OPFS is not supported
 */
export const saveToLocalStorage = (data: AppData): boolean => {
  try {
    // Update the lastUpdated timestamp
    data.lastUpdated = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem('familyMealPlannerData', JSON.stringify(data));
    
    return true;
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
    return false;
  }
};

/**
 * Load data from localStorage
 */
export const loadFromLocalStorage = (): AppData | null => {
  try {
    const data = localStorage.getItem('familyMealPlannerData');
    if (!data) return null;
    
    return JSON.parse(data) as AppData;
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return null;
  }
};

/**
 * Delete data from localStorage
 */
export const deleteFromLocalStorage = (): boolean => {
  try {
    localStorage.removeItem('familyMealPlannerData');
    return true;
  } catch (error) {
    console.error('Failed to delete data from localStorage:', error);
    return false;
  }
}; 