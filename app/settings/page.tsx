import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import { DataManagement } from '@/components/settings/data-management';

export const metadata: Metadata = {
  title: 'Settings | Family Meal Planner',
  description: 'Manage your app settings and data',
};

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application settings and data
          </p>
        </div>
        
        <div className="grid gap-6">
          <DataManagement />
        </div>
      </div>
    </PageContainer>
  );
} 