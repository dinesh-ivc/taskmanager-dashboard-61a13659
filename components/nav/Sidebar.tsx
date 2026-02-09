import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Task Manager</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <a href="/dashboard" className="block hover:bg-gray-700 p-2 rounded">
              Dashboard
            </a>
          </li>
          <li className="mb-2">
            <a href="/tasks" className="block hover:bg-gray-700 p-2 rounded">
              My Tasks
            </a>
          </li>
          <li className="mb-2">
            <a href="/profile" className="block hover:bg-gray-700 p-2 rounded">
              Profile
            </a>
          </li>
          <li className="mb-2">
            <a href="/settings" className="block hover:bg-gray-700 p-2 rounded">
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;