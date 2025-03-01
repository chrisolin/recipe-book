/**
 * Data migrations for the Family Meal Planner application
 * Handles upgrading data from one version to another
 */
import { AppData, MigrationRecord } from './types';

// Current data version
export const CURRENT_DATA_VERSION = 1;

// Migration history
export const migrationHistory: MigrationRecord[] = [];

/**
 * Check if data needs migration
 */
export const needsMigration = (data: AppData): boolean => {
  return data.version < CURRENT_DATA_VERSION;
};

/**
 * Migrate data from one version to another
 */
export const migrateData = (data: AppData): AppData => {
  // If no migration is needed, return the data as is
  if (!needsMigration(data)) {
    return data;
  }

  // Clone the data to avoid mutating the original
  let migratedData = { ...data };
  
  // Apply migrations sequentially
  while (migratedData.version < CURRENT_DATA_VERSION) {
    const currentVersion = migratedData.version;
    const nextVersion = currentVersion + 1;
    
    // Apply the appropriate migration function
    switch (currentVersion) {
      case 0:
        migratedData = migrateFromV0ToV1(migratedData);
        break;
      // Add more cases as new versions are added
      default:
        // This should never happen, but just in case
        console.error(`No migration path from version ${currentVersion} to ${nextVersion}`);
        // Force the version to avoid infinite loops
        migratedData.version = nextVersion;
        break;
    }
    
    // Record the migration
    migrationHistory.push({
      fromVersion: currentVersion,
      toVersion: migratedData.version,
      migratedAt: new Date().toISOString()
    });
  }
  
  return migratedData;
};

/**
 * Migrate data from version 0 to version 1
 * This is the initial migration, which sets up the basic data structure
 */
const migrateFromV0ToV1 = (data: AppData): AppData => {
  // Create a new data object with version 1 structure
  const migratedData: AppData = {
    recipes: data.recipes || {},
    mealPlans: data.mealPlans || {},
    shoppingLists: data.shoppingLists || {},
    version: 1,
    lastUpdated: new Date().toISOString()
  };
  
  return migratedData;
};

/**
 * Get migration history
 */
export const getMigrationHistory = (): MigrationRecord[] => {
  return [...migrationHistory];
}; 