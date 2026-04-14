import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import LogoutButton from './LogoutButton';
import { FileText } from 'lucide-react';

const MainLayout = ({ currentFileName }) => {
  const { isDark } = useTheme();

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${
      isDark ? "bg-[#0B0F19] text-white" : "bg-[#F8FAFC] text-slate-900"
    }`}>
      
      
      {isDark && (
        <>
          <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[128px] pointer-events-none" />
          <div className="fixed bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />
        </>
      )}

      {/* Сайдбар теперь здесь */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Хедер теперь здесь и он меняет тему! */}
        <header className={`h-16 flex items-center justify-between px-8 border-b transition-colors ${
          isDark 
            ? "bg-[#0B0F19]/50 border-white/5 backdrop-blur-md" 
            : "bg-white/80 border-slate-100 backdrop-blur-md"
        }`}>
          <div className="flex items-center gap-3">
            {currentFileName && (
              <>
                <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <FileText className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-[#10B981]"}`} />
                </div>
                <span className="text-sm font-bold truncate max-w-[300px]">
                  {currentFileName}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LogoutButton />
            <div className="hidden md:block text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic">
              Hackathon Prototype v1.0
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;