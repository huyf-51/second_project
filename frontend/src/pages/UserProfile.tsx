import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import { Container } from 'react-bootstrap';

interface UserInfo {
    passengerId: number;
    phoneNumber: string;
    lastName: string;
    email: string;
    firstName: string;
    nationalIDCard: string;
    point: number;
}

const getUserInfo = (): Promise<UserInfo> => {
    return axios.get('/passenger/get-info').then((res) => res.data);
};

const UserProfile: React.FC = () => {
    const { data, isSuccess } = useQuery({
        queryKey: ['get-user-info'],
        queryFn: getUserInfo,
    });
    if (isSuccess) {
        return (
            <Container className="mt-5">
                <div>
                    {data.firstName} {data.lastName}
                </div>
                <div>Point: {data.point}</div>
            </Container>
        );
    }
};

export default UserProfile;
