import useUserStore from '../store/user';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth: React.FC = () => {
    const auth = useUserStore((state) => state.auth);
    return <>{auth ? <Outlet /> : <Navigate to={'/login'} />}</>;
};

export default RequireAuth;
