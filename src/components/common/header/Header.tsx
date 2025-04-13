"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface HeaderProps {
  className?: string;
  onMenuClick?: () => void;
}

export function Header({ className, onMenuClick }: HeaderProps) {
  const { isSignedIn } = useAuth();

  return (
    <header className={cn("w-full bg-primary text-primary-foreground py-4 px-6 shadow-md", className)}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          金融データダッシュボード
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-accent-foreground transition-colors">
            ダッシュボード
          </Link>
          <Link href="/symbols" className="hover:text-accent-foreground transition-colors">
            銘柄検索
          </Link>
          <Link href="/admin" className="hover:text-accent-foreground transition-colors">
            管理者パネル
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <button
            className="md:hidden focus:outline-none"
            aria-label="メニュー"
            onClick={onMenuClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link 
              href="/sign-in" 
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 