import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import dateFormat, { masks } from 'dateformat';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type Inputs = {
    bookingCode: string;
};

interface Airport {
    location: string;
    airportName: string;
}

interface Flight {
    arrivalDateTime: string;
    departureDateTime: string;
    destinationAirport: Airport;
    originAirport: Airport;
}

interface Seat {
    passengerId: number;
}

interface Payment {
    paymentId: number;
}

interface Passenger {
    Seat: null | Seat;
    firstName: string;
    lastName: string;
}

interface RespData {
    paymentStatus: boolean;
    Flight: Flight;
    Passenger: Passenger;
    Payment: Payment;
    bookingId: string;
    flightId: number;
}

interface Checkin {
    checkin: boolean;
}

const FindTicket: React.FC = () => {
    const [msg, setMsg] = useState<string>('');
    const cancelTicketMutation = useMutation({
        mutationFn: () =>
            axios.delete(`/booking/cancel-booking/${ticketInfo?.bookingId}`),
        onSuccess: (res) => {
            setMsg(res.data);
        },
        onError: (error: AxiosError) => {
            const err = error.response?.data as { message: string };
            setMsg(err.message);
        },
    });
    const [ticketInfo, setTicketInfo] = useState<RespData | null | undefined>(
        undefined
    );
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const respData: RespData | null = (
            await axios.get(`/booking/find-ticket/${data.bookingCode}`)
        ).data;
        setTicketInfo(respData);
    };
    const handlePayment = () => {
        navigate(`/payment/${ticketInfo?.Payment.paymentId}`);
    };
    const handleCheckin = async () => {
        const res: Checkin = (
            await axios.get(`/booking/checkin/${ticketInfo?.flightId}`)
        ).data;
        if (res.checkin) {
            navigate(`/checkin/${ticketInfo?.bookingId}`);
        } else {
            setMsg('Online check-in is not yet available');
        }
    };
    const handleCancelTicket = () => {
        cancelTicketMutation.mutate();
    };
    return (
        <>
            <Container className="border border-2 mt-5 p-3 rounded w-50">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3" controlId="bookingCode">
                        <Form.Label>Booking Code</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter booking code"
                            {...register('bookingCode', { required: true })}
                        />
                        {errors.bookingCode && (
                            <div className="text-danger">
                                Booking code required
                            </div>
                        )}
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
            {ticketInfo && (
                <div className="mt-5 p-3 rounded text-center">
                    <div className="fw-bold">
                        {ticketInfo?.Flight.originAirport.location} -{' '}
                        {ticketInfo?.Flight.destinationAirport.location}
                    </div>
                    <div>
                        {dateFormat(
                            ticketInfo?.Flight.departureDateTime,
                            masks.longDate
                        )}
                    </div>
                    <div>
                        {dateFormat(
                            ticketInfo?.Flight.departureDateTime,
                            masks.shortTime
                        )}{' '}
                        -{' '}
                        {dateFormat(
                            ticketInfo?.Flight.arrivalDateTime,
                            masks.shortTime
                        )}
                    </div>
                    <div>
                        Passenger Fullname:{' '}
                        {ticketInfo.Passenger.lastName +
                            ' ' +
                            ticketInfo.Passenger.firstName}
                    </div>
                    <div>
                        {ticketInfo.paymentStatus ? (
                            <div className="me-3">Payed</div>
                        ) : (
                            <Button
                                variant="warning"
                                onClick={handlePayment}
                                className="me-3"
                            >
                                Pay
                            </Button>
                        )}
                        {ticketInfo.Passenger.Seat ? (
                            <div className="me-3">Checked in</div>
                        ) : (
                            <Button
                                variant="success"
                                onClick={handleCheckin}
                                className="me-3"
                            >
                                Checkin
                            </Button>
                        )}
                        <Button onClick={handleCancelTicket} variant="danger">
                            Cancel Ticket
                        </Button>
                    </div>
                    {msg !== '' && <div>{msg}</div>}
                </div>
            )}
            {ticketInfo === null && (
                <div className="text-center">Can't find the ticket</div>
            )}
        </>
    );
};

export default FindTicket;
