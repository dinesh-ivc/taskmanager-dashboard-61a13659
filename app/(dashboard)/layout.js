'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/nav/Sidebar';
import { TopNavbar } from '@/components/nav/TopNavbar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <input 
        type="checkbox" 
        checked={sidebarOpen} 
        onChange={() => setSidebarOpen(!sidebarOpen)} 
        id="sidebar-toggle" 
        className="hidden" 
      />
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col lg:pl-20 min-h-screen transition-all duration-300">
        <TopNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}