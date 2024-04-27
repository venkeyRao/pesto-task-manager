import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Dashboard from "./views/Dashboard";
import TaskForm from "./views/TaskForm";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: 'tasks/new', element: <TaskForm key="taskCreate" /> },
      { path: 'tasks/:id', element: <TaskForm key="taskUpdate" /> },
    ]
  },
  { path: '/login', element: <GuestLayout><Login /></GuestLayout> },
  { path: '/signup', element: <GuestLayout><Signup /></GuestLayout> },
  { path: "*", element: <NotFound /> }
]);

export default router;
