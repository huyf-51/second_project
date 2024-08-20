import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Header from './components/Header';
import RequireAuth from './components/RequireAuth';
import UserProfile from './pages/UserProfile';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Header />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/',
        element: <RequireAuth />,
        children: [
            {
                path: '/user-profile',
                element: <UserProfile />,
            },
        ],
    },
]);

export default router;
