import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource/inter";

import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx';

import { NotFound } from './pages/NotFound.jsx';
import { UserProvider } from './context/UserContext.jsx';
import Home from './pages/home/Home.jsx';
import Navigater from './navigater/Navigater.jsx';
import ActionNav from './navigater/ActionNav.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/home',
    element: <Home />,
    children: [
       {
        path: '/home/:nav',
        element: <Navigater />
      },
      {
        path: '/home/action/:nav',
        element: <ActionNav />
      }
    ],
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
