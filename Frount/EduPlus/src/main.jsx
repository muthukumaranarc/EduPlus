import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource/inter";

import './index.css'
import App from './App.jsx'
import Login from './Components/Login.jsx';

import { NotFound } from './Components/NotFound.jsx';
import { UserProvider } from './context/UserContext.jsx';
import Home from './Components/Home.jsx';
import Navigater from './Components/Navigater.jsx';

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
