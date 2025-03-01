# Implementation Plan

## Data Management

- [x] Step 1: Create data models and local storage utilities
  - **Task**: Define TypeScript interfaces for Recipe, MealPlan, and other data structures, then create utility functions to interact with the Origin Private File System (OPFS)
  - **Files**:
    - `lib/types.ts`: Define interface types for Recipe, MealPlan, etc.
    - `lib/storage.ts`: Create OPFS utility functions for reading/writing data
    - `lib/data-manager.ts`: Implement higher-level functions for managing application data
  - **Step Dependencies**: None

- [x] Step 2: Implement data initialization and migration
  - **Task**: Create a system to initialize the data store on first run and handle data migrations for future updates
  - **Files**:
    - `lib/data-manager.ts`: Add initialization and migration functions
    - `lib/migrations.ts`: Define version-specific migration logic
    - `app/providers.tsx`: Create a provider to initialize data on app startup
  - **Step Dependencies**: Step 1

## UI Components

- [x] Step 3: Install and set up shadcn UI components
  - **Task**: Install basic shadcn components needed for the application
  - **Files**: 
    - `components/ui/button.tsx`: Button component
    - `components/ui/input.tsx`: Input component
    - `components/ui/textarea.tsx`: Textarea component
    - `components/ui/select.tsx`: Select component
    - `components/ui/dialog.tsx`: Dialog component
    - `components/ui/card.tsx`: Card component
    - `components/ui/form.tsx`: Form component
  - **Step Dependencies**: None
  - **User Instructions**: Run `npx shadcn@latest add button input textarea select dialog card form`

- [x] Step 4: Create shared layout components
  - **Task**: Implement the application layout with header, navigation, and main content area
  - **Files**:
    - `components/layout/header.tsx`: App header with title and navigation
    - `components/layout/navigation.tsx`: Navigation menu component
    - `components/layout/page-container.tsx`: Container component for consistent page layout
    - `app/layout.tsx`: Update the root layout to include navigation and structure
  - **Step Dependencies**: Step 3

## Recipe Management

- [x] Step 5: Create recipe form components
  - **Task**: Implement form components for adding and editing recipes
  - **Files**:
    - `components/recipes/recipe-form.tsx`: Form for creating/editing recipes
    - `components/recipes/ingredient-input.tsx`: Component for managing ingredients
    - `components/recipes/tag-input.tsx`: Component for managing recipe tags
  - **Step Dependencies**: Steps 1, 3

- [x] Step 6: Implement recipe list and detail components
  - **Task**: Create components to display recipes in list and detail views
  - **Files**:
    - `components/recipes/recipe-list.tsx`: List of recipes with filtering
    - `components/recipes/recipe-card.tsx`: Card component for recipe preview
    - `components/recipes/recipe-detail.tsx`: Detailed view of a recipe
    - `components/recipes/recipe-tags.tsx`: Component to display recipe tags
  - **Step Dependencies**: Steps 1, 3

- [x] Step 7: Create recipe management pages
  - **Task**: Implement pages for viewing, adding, and editing recipes
  - **Files**:
    - `app/recipes/page.tsx`: Main recipes listing page
    - `app/recipes/[id]/page.tsx`: Recipe detail page
    - `app/recipes/new/page.tsx`: Page for adding a new recipe
    - `app/recipes/[id]/edit/page.tsx`: Page for editing an existing recipe
  - **Step Dependencies**: Steps 2, 4, 5, 6

- [ ] Step 8: Add recipe search and filtering
  - **Task**: Implement search and tag filtering functionality for recipes
  - **Files**:
    - `components/recipes/search-bar.tsx`: Search input component
    - `components/recipes/filter-tags.tsx`: Tag filter component
    - `lib/search.ts`: Search utility functions
    - `app/recipes/page.tsx`: Update to include search and filtering
  - **Step Dependencies**: Steps 6, 7

## Meal Planning

- [ ] Step 9: Create meal plan components
  - **Task**: Implement components for creating and viewing meal plans
  - **Files**:
    - `components/meal-plans/meal-plan-form.tsx`: Form for creating/editing meal plans
    - `components/meal-plans/day-selector.tsx`: Component for selecting days in the plan
    - `components/meal-plans/recipe-selector.tsx`: Component for selecting recipes for each day
  - **Step Dependencies**: Steps 1, 6

- [ ] Step 10: Implement meal plan list and detail components
  - **Task**: Create components to display meal plans in list and detail views
  - **Files**:
    - `components/meal-plans/meal-plan-list.tsx`: List of meal plans
    - `components/meal-plans/meal-plan-card.tsx`: Card component for meal plan preview
    - `components/meal-plans/meal-plan-detail.tsx`: Detailed view of a meal plan
  - **Step Dependencies**: Step 9

- [ ] Step 11: Create meal planning pages
  - **Task**: Implement pages for viewing, adding, and editing meal plans
  - **Files**:
    - `app/meal-plans/page.tsx`: Main meal plans listing page
    - `app/meal-plans/[id]/page.tsx`: Meal plan detail page
    - `app/meal-plans/new/page.tsx`: Page for adding a new meal plan
    - `app/meal-plans/[id]/edit/page.tsx`: Page for editing an existing meal plan
  - **Step Dependencies**: Steps 2, 4, 9, 10

## Shopping List

- [ ] Step 12: Implement shopping list generation
  - **Task**: Create utility functions to generate shopping lists from meal plans
  - **Files**:
    - `lib/shopping-list.ts`: Functions to generate and manage shopping lists
    - `components/shopping/shopping-list.tsx`: Component to display shopping list
    - `components/shopping/shopping-list-item.tsx`: Component for individual shopping list items
  - **Step Dependencies**: Steps 1, 2

- [ ] Step 13: Create shopping list pages
  - **Task**: Implement pages for viewing and managing shopping lists
  - **Files**:
    - `app/shopping/page.tsx`: Main shopping list page
    - `app/shopping/[id]/page.tsx`: Specific shopping list for a meal plan
  - **Step Dependencies**: Steps 4, 11, 12

## Dashboard and Integration

- [ ] Step 14: Create home page dashboard
  - **Task**: Implement the main dashboard showing current meal plan and quick access to features
  - **Files**:
    - `app/page.tsx`: Update to show dashboard
    - `components/dashboard/current-plan.tsx`: Component showing current meal plan
    - `components/dashboard/quick-actions.tsx`: Component for quick action buttons
    - `components/dashboard/recent-recipes.tsx`: Component showing recently used recipes
  - **Step Dependencies**: Steps 7, 11, 13

- [ ] Step 15: Implement theme and mobile responsiveness
  - **Task**: Enhance UI with theming and ensure good mobile experience
  - **Files**:
    - `app/globals.css`: Update for additional theme styling
    - `components/theme-toggle.tsx`: Component for toggling light/dark mode
    - `app/layout.tsx`: Update to include theme provider
  - **Step Dependencies**: Steps 4, 14

## Offline Functionality and Testing

- [ ] Step 16: Finalize offline functionality
  - **Task**: Ensure all features work properly offline and data persists correctly
  - **Files**:
    - `lib/storage.ts`: Enhance with error handling and offline detection
    - `components/offline-indicator.tsx`: Component to show offline status
    - `app/providers.tsx`: Update to handle offline scenarios
  - **Step Dependencies**: Steps 2, 7, 11, 13

- [ ] Step 17: Create data export/import functionality
  - **Task**: Implement features to allow users to backup and restore their data
  - **Files**:
    - `lib/export-import.ts`: Utility functions for exporting and importing data
    - `components/settings/data-management.tsx`: Component for managing data export/import
    - `app/settings/page.tsx`: Settings page including data management
  - **Step Dependencies**: Steps 1, 2

## Summary

This implementation plan outlines the development of the Family Meal Planner application as a progressive enhancement of the existing Next.js codebase. It starts with implementing the core data management system using OPFS for offline storage, then builds out UI components with shadcn, followed by feature-specific implementations for recipes, meal planning, and shopping lists.

Key considerations include:
1. Early focus on data models and storage to establish the foundation
2. Progressive enhancement of the UI with reusable components
3. Feature implementation in logical order (recipes → meal plans → shopping lists)
4. Offline functionality baked in from the beginning
5. Mobile-first approach with responsive design

The plan ensures that each step builds logically on previous ones and keeps changes manageable. The application will be fully functional offline using local storage, with all the requested features for recipe management, meal planning, and shopping list generation.