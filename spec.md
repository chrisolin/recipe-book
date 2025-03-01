# Family Meal Planner
## Project Description
A Next.js web application that helps individuals and families plan their weekly meals and create consolidated grocery lists. The app will work offline using local storage to save user data, making it convenient for home cooks who plan and shop for the entire week.

## Target Audience
Individuals and families who plan daily family dinners and do weekly grocery shopping based on their meal plans.

## Desired Features
### Recipe Management
- [ ] Add new recipes
  - [ ] Title
  - [ ] Description
  - [ ] List of ingredients (free text entry)
  - [ ] Tags for categorization
  - [ ] Optional image URL field
- [ ] Edit existing recipes
- [ ] Delete recipes
- [ ] View last usage date for each recipe
- [ ] Sort recipes by last used date

### Meal Planning
- [ ] Create weekly meal plans
  - [ ] Select specific dates for the plan
  - [ ] Associate recipes with the plan
- [ ] View meal plan history as scrollable list of cards

### Shopping
- [ ] Generate grocery lists based on weekly meal plans
  - [ ] Group ingredients by recipe

### Search and Organization
- [ ] Search recipes by keyword
- [ ] Filter recipes by tags

## Design Requests
- [ ] Offline functionality
  - [ ] Use Origin Private File System (OPFS) with a single JSON file for all data
- [ ] Use Tailwind CSS for styling
- [ ] Implement shadcn components for UI elements

## Other Notes
- App should function completely offline
- Focus on simplicity and ease of use for weekly meal planning workflow
- No recipe scaling or reminder functionality needed