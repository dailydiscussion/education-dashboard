// src/components/LoginPage.js
import React, { useState } from 'react';

const LoginPage = React.memo(({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div id="login-page" className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
            <div className="w-full">
                <div className="text-center mb-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-auto text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 21h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z"></path><path d="M12 18a2 2 0 0 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M12 10V6"></path></svg>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Welcome Back!</h1>
                    <p className="text-gray-500 mt-2">Sign in to continue your progress.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input type="text" id="username" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" id="password" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300">
                        Login
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account? <a href="#" className="font-medium text-blue-600 hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    );
});

export default LoginPage;