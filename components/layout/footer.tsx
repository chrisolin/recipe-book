import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6">
      <div className="container max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Family Meal Planner. All rights reserved.
          </p>
        </div>        
      </div>
    </footer>
  );
} 