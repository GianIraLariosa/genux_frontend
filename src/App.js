// App.js
import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes, useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import { UserProvider } from "./Usercontext";
import { EventProvider } from "./Eventcontext";
import Login from "./views/Login";
import OutsideLayout from "./layouts/OutsideLayout";

const App = () => {
  const routing = useRoutes(Themeroutes);

  return (
      <EventProvider>
        <UserProvider>
          <BrowserRouter>
          <div className="dark">
            {/* <Suspense fallback={<div>Loading...</div>}>
              {routing}
            </Suspense> */}
            <Routes>
              <Route path="/" element={<OutsideLayout />}>
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>
          </div>
          </BrowserRouter>
        </UserProvider>
      </EventProvider>
  );
};

export default App;
