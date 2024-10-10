// App.js
import React from "react";
import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import { UserProvider } from "./Usercontext";
import { EventProvider } from "./Eventcontext";

const App = () => {
  const routing = useRoutes(Themeroutes);

  return (
      <EventProvider>
        <UserProvider>
          <div className="dark">
            {routing}
          </div>
        </UserProvider>
      </EventProvider>
  );
};

export default App;
