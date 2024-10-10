// UserContext.js
import { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user_id, setUser_id] = useState('');
  const [organizer_id, setOrg_id] = useState('');

  return (
    <UserContext.Provider value={{ user_id, setUser_id, organizer_id, setOrg_id }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
