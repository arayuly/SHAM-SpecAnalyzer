import React from 'react';
// 1. Добавляем импорты хуков из роутера
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  LayoutGrid, 
  FileSearch, 
  History, 
  MessageSquare, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  // 2. Инициализируем хуки
  const location = useLocation();
  const navigate = useNavigate();
  const lastId = localStorage.getItem('lastId') || '1';

  const menuItems = [
    { id: 'Upload', label: 'Upload or Select', icon: <UploadCloud size={20} />, path: '/' },
    { id: 'Dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} />, path: `/result/${lastId}` },
    { id: 'AI Text Diff', label: 'AI Text Diff', icon: <FileSearch size={20} />, path: `/analysis/${lastId}` },
    { id: 'Academics', label: 'Academics', icon: <History size={20} />, path: '/academy' },
    { id: 'Settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
   <aside className="w-72 h-screen bg-[var(--card)] border-r border-[var(--card-border)] flex flex-col p-6 font-sans sticky top-0 transition-colors duration-300 z-20">
  
  {/* LOGO SECTION */}
  <div className="flex items-center gap-3 mb-12 px-2">
    <div className="w-10 h-10 bg-[var(--foreground)] rounded-xl flex items-center justify-center shadow-lg transition-colors">
      <span className="text-[var(--background)] font-black text-xl italic">S</span>
    </div>
    <div>
      <h1 className="text-[15px] font-black text-[var(--foreground)] leading-none tracking-tight">SHAM AI</h1>
      <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-[0.1em] mt-1">
        Analysis Platform
      </p>
    </div>
  </div>

  {/* NAVIGATION LABEL */}
  <div className="px-4 mb-4">
    <span className="text-[10px] font-black text-[var(--muted)] opacity-50 uppercase tracking-[0.2em]">
      Navigation
    </span>
  </div>

  {/* MENU ITEMS */}
  <nav className="flex-1 space-y-2">
    {menuItems.map((item) => {
      const isActive = item.path === '/' 
        ? location.pathname === '/' 
        : location.pathname.startsWith(item.path.replace('/latest', ''));

      return (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
            isActive
              ? 'bg-emerald-500/10 text-[var(--accent)] shadow-sm shadow-emerald-500/10'
              : 'text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]'
          }`}
        >
          <span className={`transition-colors ${isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)] opacity-50 group-hover:opacity-100'}`}>
            {item.icon}
          </span>
          <span className="text-[14px] font-bold tracking-tight">
            {item.label}
          </span>
          
          {isActive && (
            <div className="ml-auto w-1.5 h-1.5 bg-[var(--accent)] rounded-full shadow-[0_0_8px_var(--accent)]" />
          )}
        </button>
      );
    })}
  </nav>

  {/* FOOTER STATUS */}
  <div className="mt-auto pt-6 border-t border-[var(--card-border)]">
    <div className="bg-[var(--hover)] rounded-2xl p-4 border border-[var(--card-border)]">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse shadow-[0_0_8px_var(--accent)]" />
        <span className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-wide">
          System Online
        </span>
      </div>
      <p className="text-[10px] text-[var(--muted)] font-medium italic opacity-70">
        v2.4.1 — Multi-Agent Mode
      </p>
    </div>
  </div>
</aside>
  );
};

export default Sidebar;