import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
}

export function Sidebar({ className, isOpen = false }: SidebarProps) {
  const sidebarClasses = cn(
    "fixed top-0 left-0 z-40 h-screen w-64 bg-card shadow-lg transition-transform duration-300 transform",
    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
    className
  );

  return (
    <div className={sidebarClasses}>
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="flex items-center pl-2.5 mb-5">
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            メニュー
          </span>
        </div>
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              href="/"
              className="flex items-center p-2 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
            >
              <svg
                className="w-5 h-5 transition duration-75"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="ml-3">ダッシュボード</span>
            </Link>
          </li>
          <li>
            <Link
              href="/symbols"
              className="flex items-center p-2 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
            >
              <svg
                className="w-5 h-5 transition duration-75"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="ml-3">銘柄検索</span>
            </Link>
          </li>
          <li>
            <Link
              href="/favorites"
              className="flex items-center p-2 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
            >
              <svg
                className="w-5 h-5 transition duration-75"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span className="ml-3">お気に入り</span>
            </Link>
          </li>
          <li>
            <Link
              href="/components"
              className="flex items-center p-2 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
            >
              <svg
                className="w-5 h-5 transition duration-75"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
              <span className="ml-3">共通UIコンポーネント</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              className="flex items-center p-2 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
            >
              <svg
                className="w-5 h-5 transition duration-75"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="ml-3">管理者パネル</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
} 