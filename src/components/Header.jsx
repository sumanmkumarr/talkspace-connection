
import React from 'react';

const Header = ({ username, onLogout }) => {
  return (
    <header className="w-full px-6 py-4 bg-white shadow-sm z-10 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          MessageFlow
        </h1>
      </div>
      
      {username && (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Logged in as <span className="font-medium text-gray-800">{username}</span>
          </span>
          <button 
            onClick={onLogout}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
