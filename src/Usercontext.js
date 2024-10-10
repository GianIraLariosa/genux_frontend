// UserContext.js
import { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Update localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user'); // Clear user on logout
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user_id, setUser_id }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
