import { createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Dashboard from "./views/Dashboard";
import DefaultLayout from "./layouts/DefaultLayout";
import GuestLayout from "./layouts/GuestLayout";
import TaskForm from "./components/TaskForm";

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
