// src/context/HandlerContext.js
import React, { createContext, useContext } from 'react';

const HandlerContext = createContext();

export const useHandlers = () => {
  const context = useContext(HandlerContext);
  if (!context) {
    throw new Error('useHandlers must be used within a HandlerProvider');
  }
  return context;
};

export const HandlerProvider = ({ children, handlers }) => {
  return (
    <HandlerContext.Provider value={handlers}>
      {children}
    </HandlerContext.Provider>
  );
};

export default HandlerContext;