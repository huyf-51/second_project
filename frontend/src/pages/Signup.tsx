import { useForm, SubmitHandler } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from '../utils/axios';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Inputs = {
    phoneNumber: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    nationalIDCard: string;
};

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | undefined>(undefined);
    const loginMutation = useMutation({
        mutationFn: (data: Inputs) => {
            return axios.post('/auth/signup', data);
        },
        onSuccess: () => {
            navigate('/login');
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
                        {...register('phoneNumber', {
                            required: true,
                            pattern: /^0\d{9}$/,
                        })}
                    />
                    {errors.phoneNumber?.type === 'required' && (
                        <div className="text-danger">Phonenumber required</div>
                    )}
                    {errors.phoneNumber?.type === 'pattern' && (
                        <div className="text-danger">
                            Dont matching phonenumber
                        </div>
                    )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        {...register('password', {
                            required: true,
                            minLength: 8,
                            pattern:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/,
                        })}
                    />
                    {errors.password?.type === 'required' && (
                        <div className="text-danger">Password required</div>
                    )}
                    {errors.password?.type === 'minLength' && (
                        <div className="text-danger">
                            Password must be at least 8 characters
                        </div>
                    )}
                    {errors.password?.type === 'pattern' && (
                        <div className="text-danger">
                            Password must contain at least one lowercase letter,
                            one uppercase letter, one digit, one special
                            character
                        </div>
                    )}
                </Form.Group>

                <div className="d-flex">
                    <Form.Group className="mb-3 me-5" controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter first name"
                            {...register('firstName', { required: true })}
                        />
                        {errors.firstName?.type === 'required' && (
                            <div className="text-danger">
                                firstname required
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter last name"
                            {...register('lastName', { required: true })}
                        />
                        {errors.lastName?.type === 'required' && (
                            <div className="text-danger">lastname required</div>
                        )}
                    </Form.Group>
                </div>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter email"
                        {...register('email', {
                            required: true,
                            pattern: /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
                        })}
                    />
                    {errors.email?.type === 'required' && (
                        <div className="text-danger">Email required</div>
                    )}
                    {errors.email?.type === 'pattern' && (
                        <div className="text-danger">Email not true format</div>
                    )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="nationalIDCard">
                    <Form.Label>National ID Card</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter national ID card"
                        {...register('nationalIDCard', { required: true })}
                    />
                    {errors.nationalIDCard?.type === 'required' && (
                        <div className="text-danger">
                            National ID card required
                        </div>
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

export default Signup;
