import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import "@fontsource/inter";

import './index.css'

import App from './App.jsx'
import Login from './pages/login/Login.jsx';

import { NotFound } from './pages/NotFound.jsx';
import Home from './pages/home/Home.jsx';
import Dashboard from './pages/home/dashboard/Dashboard.jsx';
import Action from './pages/home/action/Action.jsx';
import Ai from './pages/home/ai/Ai.jsx';
import Friend from './pages/home/friends/Friend.jsx';
import Settings from './pages/home/settings/Settings.jsx';
import Plan from './pages/home/action/Plan.jsx';
import { ImageProvider } from './context/ImageProvider.jsx';
import { UserProvider } from './context/UserProvider.jsx';
import { ThemeProvider } from './context/ThemeProvider.jsx';
import CollectInfo from './pages/login/collectInfo.jsx';
import CollectInfoOAuth from './pages/login/CollectInfoOAuth';
import TestBuilder from './pages/home/action/test/TestBuilder';
import GenerateTest from './pages/home/action/test/GenerateTest';
import SavedTest from './pages/home/action/test/SavedTest';
import Trophies from './pages/home/trophies/Trophies.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />
  },
  {
    path: '/account-login',
    element: <Login />
  },
  {
    path: '/create-new-account',
    element: <CollectInfo />
  },
  {
    path: '/get-info-oauth',
    element: <CollectInfoOAuth />
  },
  {
    path: '/home',
    element: <Home />,
    children: [
      // page navigaters
      {
        path: '/home/dashboard',
        element: <Dashboard />
      },
      {
        path: '/home/action',
        element: <Action />
      },
      {
        path: '/home/ai',
        element: <Ai />
      },
      {
        path: '/home/friend',
        element: <Friend />
      },
      {
        path: '/home/setting',
        element: <Settings />
      },
      {
        path: '/home/trophies',
        element: <Trophies />
      },

      // action navigaters
      {
        path: '/home/action/plan',
        element: <Plan />
      },
      {
        path: '/home/action/test',
        element: <TestBuilder />
      },
      {
        path: '/home/action/test/saved',
        element: <SavedTest />
      },
      {
        path: '/home/action/test/generate',
        element: <GenerateTest />
      },
      {
        path: '/home/action/ai',
        element: <Ai />
      },
    ],
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <ImageProvider>
          <RouterProvider router={router} />
        </ImageProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>
);
