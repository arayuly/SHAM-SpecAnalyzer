import React, { createContext, useContext, useEffect, useState } from 'react';

// 1. Создаем сам контекст
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Проверяем, была ли сохранена тема в браузере, иначе ставим светлую
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Эффект, который вешает/снимает класс .dark на тег <html>
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Функция для переключения
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Собственный хук для удобного использования в компонентах
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }
  return context;
};