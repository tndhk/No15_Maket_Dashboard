"use client";

import { useState } from "react";
import { Header } from "@/components/common/header/Header";
import { Footer } from "@/components/common/footer/Footer";
import { Sidebar } from "@/components/common/sidebar/Sidebar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex flex-col flex-1 md:ml-64">
        <Header onMenuClick={toggleSidebar} />
        
        <main className="flex-1 p-6">
          {children}
        </main>
        
        <Footer />
      </div>

      {/* モバイル用オーバーレイ */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
} 