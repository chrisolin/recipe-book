"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "../theme-toggle";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-200 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Family Meal Planner
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink href="/" active={pathname === "/"}>
            Dashboard
          </NavLink>
          <NavLink href="/recipes" active={pathname.startsWith("/recipes")}>
            Recipes
          </NavLink>
          <NavLink href="/meal-plans" active={pathname.startsWith("/meal-plans")}>
            Meal Plans
          </NavLink>
          <NavLink href="/shopping" active={pathname.startsWith("/shopping")}>
            Shopping Lists
          </NavLink>
          <div className="ml-2 border-l pl-2 border-border h-6"></div>
          <NavLink href="/settings" active={pathname.startsWith("/settings")}>
            Settings
          </NavLink>
          
          {/* Theme Toggle */}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu} 
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            className="relative"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b animate-fade-in">
          <nav className="container flex flex-col space-y-4 py-4">
            <MobileNavLink href="/" active={pathname === "/"} onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink href="/recipes" active={pathname.startsWith("/recipes")} onClick={() => setMobileMenuOpen(false)}>
              Recipes
            </MobileNavLink>
            <MobileNavLink href="/meal-plans" active={pathname.startsWith("/meal-plans")} onClick={() => setMobileMenuOpen(false)}>
              Meal Plans
            </MobileNavLink>
            <MobileNavLink href="/shopping" active={pathname.startsWith("/shopping")} onClick={() => setMobileMenuOpen(false)}>
              Shopping Lists
            </MobileNavLink>
            <div className="border-t my-2 border-border"></div>
            <MobileNavLink href="/settings" active={pathname.startsWith("/settings")} onClick={() => setMobileMenuOpen(false)}>
              Settings
            </MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

// Desktop navigation link component
function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
        active 
          ? "text-foreground" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
      )}
    </Link>
  );
}

// Mobile navigation link component
function MobileNavLink({ 
  href, 
  active, 
  onClick, 
  children 
}: { 
  href: string; 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode 
}) {
  return (
    <Link 
      href={href} 
      className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
        active 
          ? "text-foreground bg-muted/50" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
} 