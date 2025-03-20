
import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call with timeout
    setTimeout(() => {
      onLogin(username);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="glass-panel rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome to MessageFlow</h2>
          <p className="text-gray-600">Enter a username to start chatting</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="input-field"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
            ) : null}
            {isLoading ? 'Logging in...' : 'Join Chat'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
