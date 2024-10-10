// UserContext.js
import { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  // Initialize user state from localStorage
  const [user_id, setUser_id] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Update localStorage whenever user state changes
  useEffect(() => {
    if (user_id) {
      localStorage.setItem('user', JSON.stringify(user_id));
    } else {
      localStorage.removeItem('user'); // Clear user on logout
    }
  }, [user_id]);

  return (
    <UserContext.Provider value={{ user_id, setUser_id }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
