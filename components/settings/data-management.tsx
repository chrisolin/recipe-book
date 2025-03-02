'use client';

import { useState } from 'react';
import { useAppData } from '@/app/providers';
import { exportData, importData, resetData, mergeData } from '@/lib/export-import';
import { estimateStorageUsage, estimateStorageQuota } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function DataManagement() {
  const { data, refreshData, isPersisted, requestPersistence } = useAppData();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState<{ usage: number; quota: number } | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');

  // Function to handle exporting data
  const handleExport = async () => {
    if (!data) return;
    
    try {
      setIsExporting(true);
      await exportData(data);
    } catch (error) {
      console.error('Failed to export data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Function to handle importing data
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !data) return;
    
    try {
      setIsImporting(true);
      setImportError(null);
      
      if (importMode === 'replace') {
        await importData(file);
      } else {
        const importedData = await importData(file);
        await mergeData(data, importedData);
      }
      
      await refreshData();
    } catch (error) {
      console.error('Failed to import data:', error);
      setImportError('Failed to import data. Please check the file format.');
    } finally {
      setIsImporting(false);
      // Reset the input value so the same file can be selected again
      event.target.value = '';
    }
  };

  // Function to handle resetting data
  const handleReset = async () => {
    try {
      setIsResetting(true);
      await resetData();
      await refreshData();
      setShowResetDialog(false);
    } catch (error) {
      console.error('Failed to reset data:', error);
    } finally {
      setIsResetting(false);
    }
  };

  // Function to get storage information
  const getStorageInfo = async () => {
    const usage = await estimateStorageUsage();
    const quota = await estimateStorageQuota();
    setStorageInfo({ usage, quota });
  };

  // Format bytes to a human-readable format
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Export, import, or reset your data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Storage Information */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Storage Information</h3>
            <Button variant="outline" size="sm" onClick={getStorageInfo}>
              Check Storage
            </Button>
          </div>
          
          {storageInfo && (
            <div className="text-sm">
              <p>Used: {formatBytes(storageInfo.usage)}</p>
              <p>Available: {formatBytes(storageInfo.quota)}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 mt-1 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full" 
                  style={{ width: `${(storageInfo.usage / storageInfo.quota) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Persistence Status */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Storage Persistence</h3>
            {!isPersisted && (
              <Button variant="outline" size="sm" onClick={requestPersistence}>
                Request Persistence
              </Button>
            )}
          </div>
          <p className="text-sm">
            {isPersisted 
              ? 'Your data is set to persist even when storage is low.' 
              : 'Your data may be cleared by the browser when storage is low.'}
          </p>
        </div>

        {/* Export Data */}
        <div>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || !data}
            className="w-full"
          >
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Download a backup of all your recipes, meal plans, and shopping lists.
          </p>
        </div>

        {/* Import Data */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setImportMode('replace')}
              data-active={importMode === 'replace'}
            >
              Replace
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setImportMode('merge')}
              data-active={importMode === 'merge'}
            >
              Merge
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {importMode === 'replace' 
              ? 'Replace will overwrite all existing data with the imported data.' 
              : 'Merge will add imported data to your existing data without overwriting.'}
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting || !data}
              className="flex-1"
            />
          </div>
          {importError && (
            <p className="text-xs text-red-500">{importError}</p>
          )}
        </div>

        {/* Reset Data */}
        <div>
          <Button 
            variant="destructive" 
            onClick={() => setShowResetDialog(true)}
            className="w-full"
          >
            Reset All Data
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This will permanently delete all your recipes, meal plans, and shopping lists.
          </p>
        </div>
      </CardContent>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset All Data</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your recipes, meal plans, and shopping lists will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReset}
              disabled={isResetting}
            >
              {isResetting ? 'Resetting...' : 'Reset Data'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 