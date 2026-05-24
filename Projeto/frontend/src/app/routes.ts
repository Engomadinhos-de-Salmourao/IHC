import { createBrowserRouter } from 'react-router';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import CalendarPage from './pages/CalendarPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Dashboard,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/calendar',
    Component: CalendarPage,
  },
]);
