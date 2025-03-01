"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "../theme-toggle";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Family Meal Planner</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4 text-sm font-medium">
            <Link 
              href="/" 
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/recipes" 
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith("/recipes") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Recipes
            </Link>
            <Link 
              href="/meal-plans" 
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith("/meal-plans") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Meal Plans
            </Link>
            <Link 
              href="/shopping" 
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith("/shopping") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Shopping Lists
            </Link>
          </div>
          
          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </nav>
        
        {/* Mobile Menu Button and Theme Toggle */}
        <div className="flex md:hidden flex-1 justify-end items-center space-x-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b pb-4">
          <nav className="container flex flex-col space-y-4 pt-2 text-sm font-medium">
            <Link 
              href="/" 
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/recipes" 
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith("/recipes") ? "text-foreground" : "text-foreground/60"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Recipes
            </Link>
            <Link 
              href="/meal-plans" 
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith("/meal-plans") ? "text-foreground" : "text-foreground/60"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Meal Plans
            </Link>
            <Link 
              href="/shopping" 
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith("/shopping") ? "text-foreground" : "text-foreground/60"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shopping Lists
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
} 