import React from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  className?: string;
}

export function Header({ title, className }: HeaderProps) {
  return (
    <header className={cn(
      "h-16 flex items-center justify-between px-8 bg-surface border-b border-border sticky top-0 z-30",
      className
    )}>
      <h1 className="text-xl font-semibold text-main">{title}</h1>
      <div className="flex items-center gap-4">
        {/* Right side slots for profile/settings can go here */}
      </div>
    </header>
  );
}
