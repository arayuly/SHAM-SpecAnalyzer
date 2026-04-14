import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Проверь правильность пути

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300
        ${isDark 
          ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
          : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
        }
      `}
    >
      {/* Анимированная иконка */}
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 transform transition-all duration-500 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`} 
          size={20} 
        />
        <Moon 
          className={`absolute inset-0 transform transition-all duration-500 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`} 
          size={20} 
        />
      </div>

      {/* Текст (можно скрыть на мобилках) */}
      <span className="text-xs font-bold uppercase tracking-wider">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
};

export default ThemeToggle;