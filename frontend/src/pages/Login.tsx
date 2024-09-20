import { useForm, SubmitHandler } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AxiosError } from 'axios';
import useUserStore from '../store/user';

type Inputs = {
    phoneNumber: string;
    password: string;
};

const Login: React.FC = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const setAuth = useUserStore((state) => state.setAuth);

    const loginMutation = useMutation({
        mutationFn: (data: Inputs) => {
            return axios.post('/auth/login', data);
        },
        onSuccess: (res) => {
            setAuth(res.data);
            navigate(-1);
        },
        onError: (error: AxiosError) => {
            setError(error.response?.data as string);
        },
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        loginMutation.mutate(data);
    };

    return (
        <Container className="border border-2 mt-5 p-3 rounded w-50">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="phoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        {...register('phoneNumber', { required: true })}
                    />
                    {errors.phoneNumber && (
                        <div className="text-danger">Phonenumber required</div>
                    )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        {...register('password', { required: true })}
                    />
                    {errors.password && (
                        <div className="text-danger">Password required</div>
                    )}
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
                {error && <div className="text-danger">{error}</div>}
            </Form>
        </Container>
    );
};

export default Login;
