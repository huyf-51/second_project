import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import axios from '../utils/axios';
import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { AxiosError } from 'axios';

type Inputs = {
    bankCode: string;
    language: string;
};

interface RequestData extends Inputs {
    paymentId: number;
}

const Payment: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const { id } = useParams();
    const [error, setError] = useState<string | undefined | null>(undefined);
    useEffect(() => {
        if (query.get('msg')) {
            setError(query.get('msg'));
        }
    }, []);

    const paymentMutation = useMutation({
        mutationFn: (data: RequestData) => {
            return axios.post('/booking/payment', data);
        },
        onSuccess: (res) => {
            window.location.href = res.data;
        },
        onError: (error: AxiosError) => {
            setError(error.response?.data as string);
        },
    });
    const { register, handleSubmit } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        paymentMutation.mutate({ ...data, paymentId: Number(id) });
    };

    return (
        <Container className="border border-2 mt-5 p-3 rounded w-50">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="bankCode">
                    <Form.Label>Choose payment method</Form.Label>
                    <Form.Check
                        type="radio"
                        value={''}
                        label={'VNPAYQR payment gateway'}
                        checked={true}
                        {...register('bankCode')}
                    />{' '}
                    <Form.Check
                        type="radio"
                        value={'VNPAYQR'}
                        label={'Payment via VNPAYQR-supported app'}
                        {...register('bankCode')}
                    />
                    <Form.Check
                        type="radio"
                        value={'VNBANK'}
                        label={'Payment via ATM-Domestic bank account'}
                        {...register('bankCode')}
                    />
                    <Form.Check
                        type="radio"
                        value={'INTCARD'}
                        label={'Payment via international card'}
                        {...register('bankCode')}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="language">
                    <Form.Label>Language</Form.Label>
                    <Form.Check
                        type="radio"
                        value={'vn'}
                        label={'Vietnamese'}
                        checked={true}
                        {...register('language')}
                    />
                    <Form.Check
                        type="radio"
                        value={'en'}
                        label={'English'}
                        {...register('language')}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
                {error && <div className="text-danger">{error}</div>}
            </Form>
        </Container>
    );
};

export default Payment;
