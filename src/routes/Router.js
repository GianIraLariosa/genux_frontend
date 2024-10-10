// ThemeRoutes.js
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { element, exact } from "prop-types";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const OutsideLayout = lazy(() => import("../layouts/OutsideLayout.js"));
const NoSidebarLayout = lazy(() => import("../layouts/NoSidebarLayout.js"));

/***** Pages ****/

const Registration = lazy(() => import("../views/Registration.js"));
const User = lazy(() => import("../views/User.js"));
const Login = lazy(() => import("../views/Login.js"));
const Result = lazy(() => import("../views/Result.js"));
const BpmnDiagram = lazy(() => import("../layouts/Diagram_Editor.js"));
const GenerateResult = lazy(() => import("../assets/UtilityComponents/GenerateResult.js"));


const ThemeRoutes = [
  {
    element: <FullLayout />,
    children: [
      { path: "/user", exact: true, element: <User/> }, 
      { path: "/diagram-editor", exact: true, element: <BpmnDiagram /> },
    ],
  },
  {
    element: <NoSidebarLayout />,
    children: [
      { path: "/result", exact: true, element: <Result/> },
      { path: "/PlantUMLResult", exact: true, element: <GenerateResult/> },
    ],
  },
  {
    path: "/",
    element: <OutsideLayout />,
    children: [
      { path: "/", element: <Navigate to="/user" /> },
      { path: "/login", exact: true, element: <Login /> },
      { path: "/register", exact: true, element: <Registration /> },
      
    ],
  },
];

export default ThemeRoutes;
