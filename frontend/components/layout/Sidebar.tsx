import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  FileText,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  userEmail?: string;
  onLogout: () => void;
  activeRoute: string;
}

export function Sidebar({ userEmail, onLogout, activeRoute }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Subjects", href: "/subjects", icon: BookOpen },
    { name: "Doubts", href: "/subjects/doubts", icon: HelpCircle },
    { name: "Papers", href: "/subjects/papers", icon: FileText },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-surface border border-border text-main"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-56 bg-surface border-r border-border transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Branding */}
        <div className="p-6 flex items-center gap-3 border-b border-border">
          <div className="bg-primary text-primary-fg p-1.5 rounded-md font-bold text-lg">S</div>
          <span className="font-bold text-xl tracking-tight text-main">StudyStack</span>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden ml-auto p-1 text-muted hover:text-main"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                activeRoute === item.href
                  ? "bg-selected text-primary"
                  : "text-muted hover:bg-selected/50 hover:text-main"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bottom User Controls */}
        <div className="p-4 border-t border-border space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted truncate">
            <User size={18} />
            <span className="truncate">{userEmail || "User"}</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-danger hover:bg-danger-bg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
