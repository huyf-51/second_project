import React, { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import { Container, Form, Button } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import combineAirportDetail from '../utils/combineAirportDetail';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';

type Inputs = {
    originAirport: string;
    destinationAirport: string;
    departureDate: string;
};

interface Airport {
    airportName: string;
    location: string;
}

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [destinationAirport, setDestinationAirport] = useState<string>('');
    const [originAirport, setOriginAirport] = useState('');
    const [allAirport, setAllAirport] = useState<Airport[]>([]);
    const query = useQuery({
        queryKey: ['get-all-airport'],
        queryFn: () => {
            return axios.get('/flight/get-all-airport');
        },
    });
    useEffect(() => {
        if (query.data) {
            setAllAirport(query.data?.data);
        }
    }, [query.data]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const findFlightMutation = useMutation({
        mutationFn: (data: Inputs) => {
            return axios.post('/flight/find', data);
        },
        onSuccess: (res: AxiosResponse) => {
            navigate('/flight', {
                state: res.data,
            });
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        findFlightMutation.mutate(data);
    };
    if (query.isSuccess) {
        return (
            <Container className="mt-5">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            list="originAirport"
                            placeholder="Origin Airport"
                            {...register('originAirport', { required: true })}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setOriginAirport(e.target.value);
                            }}
                        />
                        <datalist id="originAirport">
                            {combineAirportDetail(allAirport).map(
                                (airport: string, index: number) => {
                                    if (airport !== destinationAirport) {
                                        return (
                                            <option key={index}>
                                                {airport}
                                            </option>
                                        );
                                    }
                                }
                            )}
                        </datalist>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            list="destinationAirport"
                            placeholder="Destination Airport"
                            {...register('destinationAirport', {
                                required: true,
                            })}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setDestinationAirport(e.target.value);
                            }}
                        />
                        <datalist id="destinationAirport">
                            {combineAirportDetail(allAirport).map(
                                (airport: string, index: number) => {
                                    if (airport !== originAirport) {
                                        return (
                                            <option key={index}>
                                                {airport}
                                            </option>
                                        );
                                    }
                                }
                            )}
                        </datalist>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            {...register('departureDate', {
                                required: true,
                            })}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Find Flight
                    </Button>
                    {(errors.departureDate ||
                        errors.destinationAirport ||
                        errors.originAirport) && (
                        <div className="text-danger">Input required</div>
                    )}
                </Form>
            </Container>
        );
    }
};

export default Home;
