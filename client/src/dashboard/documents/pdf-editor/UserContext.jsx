import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(undefined);

// Mock users
export const MOCK_USERS = {
  current: { id: 'user-1', name: 'You (John Doe)', email: 'john.doe@example.com' },
  mock1: { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@example.com' },
  mock2: { id: 'user-3', name: 'Bob Johnson', email: 'bob.johnson@example.com' },
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS.current);

  const switchUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <UserContext.Provider value={{ currentUser, switchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
