// UserContext.js
import { createContext, useState } from 'react';

const EventContext = createContext();

const EventProvider = ({ children }) => {
  const [event_id, setEventid] = useState('');
  const [organizer_id, setOrg_id] = useState('');

  return (
    <EventContext.Provider value={{ event_id, setEventid, organizer_id, setOrg_id }}>
      {children}
    </EventContext.Provider>
  );
};

export { EventContext, EventProvider };
