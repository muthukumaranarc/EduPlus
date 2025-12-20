import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import "@fontsource/inter";

import './index.css'
import App from './App.jsx'
import Login from './pages/login/Login.jsx';

import { NotFound } from './pages/NotFound.jsx';
import Home from './pages/home/Home.jsx';
import Quiz from './pages/home/test/Quiz.jsx';
import Dashboard from './pages/home/dashboard/Dashboard.jsx';
import Action from './pages/home/action/Action.jsx';
import Test from './pages/home/test/Test.jsx';
import Ai from './pages/home/ai/Ai.jsx';
import Friend from './pages/home/friends/Friend.jsx';
import Settings from './pages/home/settings/Settings.jsx';
import Plan from './pages/home/action/Plan.jsx';
import Communication from './pages/home/action/Communication.jsx';
import Progress from './pages/home/action/Progress.jsx';
import { ImageProvider } from './context/ImageProvider.jsx';
import { UserProvider } from './context/UserProvider.jsx';
import CollectInfo from './pages/login/collectInfo.jsx';

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
    path: '/info',
    element: <CollectInfo />
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
        path: '/home/test',
        element: <Test />
      },
      {
        path: '/home/friend',
        element: <Friend />
      },
      {
        path: '/home/setting',
        element: <Settings />
      },
      
      // action navigaters
      {
        path: '/home/action/plan',
        element: <Plan />
      },
      {
        path: '/home/action/communication',
        element: <Communication />
      },
      {
        path: '/home/action/progress',
        element: <Progress />
      },
      {
        path: '/home/action/ai',
        element: <Ai />
      },

      // test navigaters
      {
        path: '/home/test/:testName',
        element: <Quiz />
      }
    ],
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ImageProvider>
        <RouterProvider router={router} />
      </ImageProvider>
    </UserProvider>
  </StrictMode>
);
