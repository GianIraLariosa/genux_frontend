// App.js
import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes, useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import { UserProvider } from "./Usercontext";
import { EventProvider } from "./Eventcontext";
import Login from "./views/Login";
import OutsideLayout from "./layouts/OutsideLayout";

const App = () => {
  // const routing = useRoutes(Themeroutes);

  return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<OutsideLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
  );
};

export default App;
