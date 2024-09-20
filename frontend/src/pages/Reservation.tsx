import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import dateFormat, { masks } from 'dateformat';
import useUserStore from '../store/user';
import Modal from 'react-bootstrap/Modal';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';

type Inputs = {
    phoneNumber: string;
    email: string;
    firstName: string;
    lastName: string;
    nationalIDCard: string;
};

interface Airport {
    airportCode: number;
    airportName: string;
    location: string;
}

interface Flight {
    arrivalDateTime: string;
    availableSeats: number;
    departureDateTime: string;
    flightId: number;
    price: number;
    destinationAirport: Airport;
    originAirport: Airport;
}

interface requestData {
    flightId: number;
    passengerInfo: Inputs;
    price: number;
    point: number;
}

const Reservation: React.FC = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [point, setPoint] = useState<number>(0);
    const [showPoint, setShowPoint] = useState<boolean>(false);
    const { refetch } = useQuery({
        queryKey: ['get-info'],
        queryFn: () => axios.get('/passenger/get-info'),
        enabled: false,
    });
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { id: flightId } = useParams();
    const { state }: { state: Flight } = useLocation();
    const { auth } = useUserStore();
    useUserStore.subscribe((state) => {
        if (state.auth === null) {
            setShowPoint(false);
            setPoint(0);
        }
    });

    const bookingMutation = useMutation({
        mutationFn: (data: requestData) => axios.post('/flight/booking', data),
        onSuccess: (res) => {
            navigate(`/payment/${res.data}`);
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        bookingMutation.mutate({
            passengerInfo: data,
            price: state.price,
            point,
            flightId: Number(flightId),
        });
    };

    const handleDiscount = async () => {
        if (auth) {
            const res = await refetch();
            setPoint(res.data?.data.point);
            setShowPoint(true);
        } else {
            handleShow();
        }
    };

    return (
        <Container>
            <Row>
                <Col lg={8}>
                    <Form
                        onSubmit={handleSubmit(onSubmit)}
                        className="border border-2 mt-5 p-3 rounded"
                    >
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
                                <div className="text-danger">
                                    Phonenumber required
                                </div>
                            )}
                            {errors.phoneNumber?.type === 'pattern' && (
                                <div className="text-danger">
                                    Dont matching phonenumber
                                </div>
                            )}
                        </Form.Group>

                        <div className="d-flex">
                            <Form.Group
                                className="mb-3 me-5"
                                controlId="firstName"
                            >
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter first name"
                                    {...register('firstName', {
                                        required: true,
                                    })}
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
                                    {...register('lastName', {
                                        required: true,
                                    })}
                                />
                                {errors.lastName?.type === 'required' && (
                                    <div className="text-danger">
                                        lastname required
                                    </div>
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
                                    pattern:
                                        /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
                                })}
                            />
                            {errors.email?.type === 'required' && (
                                <div className="text-danger">
                                    Email required
                                </div>
                            )}
                            {errors.email?.type === 'pattern' && (
                                <div className="text-danger">
                                    Email not true format
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="nationalIDCard">
                            <Form.Label>National ID Card</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter national ID card"
                                {...register('nationalIDCard', {
                                    required: true,
                                })}
                            />
                            {errors.nationalIDCard?.type === 'required' && (
                                <div className="text-danger">
                                    National ID card required
                                </div>
                            )}
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Book Now
                        </Button>
                    </Form>
                </Col>
                <Col lg={4}>
                    <div className="border border-2 mt-5 p-3 rounded text-center">
                        <div className="fw-bold">
                            {state.originAirport.location} -{' '}
                            {state.destinationAirport.location}
                        </div>
                        <div>
                            {dateFormat(
                                state.departureDateTime,
                                masks.longDate
                            )}
                        </div>
                        <div>
                            {dateFormat(
                                state.departureDateTime,
                                masks.shortTime
                            )}{' '}
                            -{' '}
                            {dateFormat(state.arrivalDateTime, masks.shortTime)}
                        </div>
                        <div>
                            Total Price: {state.price}{' '}
                            <Button onClick={handleDiscount}>
                                Use discount
                            </Button>
                        </div>
                        {showPoint && (
                            <>
                                <div>
                                    <>discount {point / 100}% </>({point} point)
                                </div>
                                <hr className="w-50 mx-auto" />
                                <div>{state.price * (1 - point / 10000)}</div>
                            </>
                        )}
                    </div>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose}>
                <Modal.Body>Please login</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Reservation;
