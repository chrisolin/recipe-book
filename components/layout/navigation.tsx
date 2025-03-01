"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BookOpen, 
  Calendar, 
  ShoppingCart 
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
}

export function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      isActive: (path) => path === "/"
    },
    {
      title: "Recipes",
      href: "/recipes",
      icon: <BookOpen className="h-5 w-5" />,
      isActive: (path) => path.startsWith("/recipes")
    },
    {
      title: "Meal Plans",
      href: "/meal-plans",
      icon: <Calendar className="h-5 w-5" />,
      isActive: (path) => path.startsWith("/meal-plans")
    },
    {
      title: "Shopping Lists",
      href: "/shopping",
      icon: <ShoppingCart className="h-5 w-5" />,
      isActive: (path) => path.startsWith("/shopping")
    }
  ];

  return (
    <nav className={cn("flex md:flex-col gap-4", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            item.isActive(pathname)
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          {item.icon}
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
} 