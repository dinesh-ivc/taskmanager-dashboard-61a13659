import React from 'react';
import { useTheme } from "@/context/theme-context";

const TopNavbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white shadow-sm dark:bg-gray-800">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <span className="text-yellow-400">☀️</span>
            ) : (
              <span className="text-gray-700">🌙</span>
            )}
          </button>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Welcome back, User
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;