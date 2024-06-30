import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import DefaultLayout from "./layouts/DefaultLayout";
import GuestLayout from "./layouts/GuestLayout";
import NotFound from "./views/NotFound";

const Login = lazy(() => import("./views/Login"));
const Signup = lazy(() => import("./views/Signup"));
const Dashboard = lazy(() => import("./views/Dashboard"));
const TaskForm = lazy(() => import("./components/TaskForm"));

const routes = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { path: '/', element: <Dashboard />, name: 'Dashboard' },
      { path: 'tasks/new', element: <TaskForm key="taskCreate" />, name: 'Create Task' },
      { path: 'tasks/:id', element: <TaskForm key="taskUpdate" />, name: 'Update Task' },
    ]
  },
  { path: '/login', element: <GuestLayout><Login /></GuestLayout>, name: 'Login' },
  { path: '/signup', element: <GuestLayout><Signup /></GuestLayout>, name: 'Signup' },
  { path: "*", element: <NotFound />, name: 'Not Found' }
];

const router = createBrowserRouter(routes);

export default router;
