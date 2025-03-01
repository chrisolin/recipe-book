'use client';

import CurrentPlan from '@/components/dashboard/current-plan';
import QuickActions from '@/components/dashboard/quick-actions';
import RecentRecipes from '@/components/dashboard/recent-recipes';

export default function Home() {
  return (
    <div className="container py-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <CurrentPlan />
          <RecentRecipes />
        </div>
        
        {/* Sidebar - 1/3 width on large screens */}
        <div className="space-y-6 lg:col-span-2">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
