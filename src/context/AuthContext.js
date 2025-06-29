// src/context/AuthContext.js
import React, { createContext } from 'react';

// Create a Context for authentication data.
// It will hold userId, userName, userEmail, isLoggedIn, and isAuthReady.
// Providing default values helps with autocompletion and understanding the shape of the context.
export const AuthContext = createContext({
    userId: null,
    userName: null,
    userEmail: null,
    isLoggedIn: false,
    isAuthReady: false,
    // You can also add setters if you want them to be available globally via context,
    // but typically state setters are passed as props to immediate children.
    // However, for completeness as "existing auth data", I'll include them.
    setUserId: () => {},
    setUserName: () => {},
    setUserEmail: () => {},
    setIsLoggedIn: () => {},
    setIsAuthReady: () => {}
});

// A simple provider component (can be placed here or in App.js directly)
// It's often good practice to define the provider where the state lives (e.g., App.js)
// but defining the context itself here makes it easy to import across the app.
