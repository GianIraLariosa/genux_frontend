// App.js
import React, { Suspense, useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes, useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import { EventProvider } from "./Eventcontext";
import Login from "./views/Login";
import OutsideLayout from "./layouts/OutsideLayout";
import UserPage from "./views/User";
import BpmnDiagram from "./layouts/Diagram_Editor";
import FullLayout from "./layouts/FullLayout.js";
import ProtectedRoute from "./ProtectedRoute.js";
import NoSidebarLayout from "./layouts/NoSidebarLayout.js";
import { UserContext } from "./Usercontext.js";
import GenerateResult from "./assets/UtilityComponents/GenerateResult.js";
import Result from "./views/Result.js";

const App = () => {
  // const routing = useRoutes(Themeroutes);
  const { user_id } = useContext(UserContext);

  return (
      <div>
        <BrowserRouter>
          <Routes>

            {/* Default root route ("/") */}
            <Route
              path="/"
              element={
                user_id ? <Navigate to="/user" /> : <Navigate to="/login" />
              }
            />

            {/* Layout for routes that are accessible without login */}
            <Route element={<OutsideLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>
            
            {/* Layout for routes that require login */}
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <FullLayout>
                    <BpmnDiagram />
                  </FullLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/PlantUMLResult"
              element={
                <ProtectedRoute>
                  {/* <NoSidebarLayout> */}
                    <GenerateResult />
                  {/* </NoSidebarLayout> */}
                </ProtectedRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      </div>
  );
};

export default App;
