// App.js
import React, { Suspense } from "react";
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
            <Suspense fallback={<div>Loading...</div>}>
              {routing}
            </Suspense>
          </div>
        </UserProvider>
      </EventProvider>
  );
};

export default App;
