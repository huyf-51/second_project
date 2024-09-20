import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Header from './components/Header';
import RequireAuth from './components/RequireAuth';
import UserProfile from './pages/UserProfile';
import Flight from './pages/Flight';
import Reservation from './pages/Reservation';
import Payment from './pages/Payment';
import FindTicket from './pages/FindTicket';
import PaymentSuccess from './pages/PaymentSuccess';
import Checkin from './pages/Checkin';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Header />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/flight',
                element: <Flight />,
            },
            {
                path: '/reservation/:id',
                element: <Reservation />,
            },
            {
                path: '/payment/:id',
                element: <Payment />,
            },
            {
                path: '/find-ticket',
                element: <FindTicket />,
            },
            {
                path: '/payment-success',
                element: <PaymentSuccess />,
            },
            {
                path: '/checkin/:id',
                element: <Checkin />,
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
