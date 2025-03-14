import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import { useParams } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { socketClient } from '../configs/socket'
import { Socket } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';

interface Seat {
    seatId: number;
    seatName?: string;
    available?: boolean;
}

const Checkin: React.FC = () => {
    const [seat, setSeat] = useState<Seat | null>(null);
    const [msg, setMsg] = useState<string>('');
    const { id } = useParams();
    const socket = useRef<Socket>(socketClient)
    const [occupiedSeat, setOccupiedSeat] = useState<Seat | null>(null)

    useEffect(() => {
        socket.current.connect()
        socket.current.on('set seat', (seatId: number) => {
            setOccupiedSeat({seatId})
        })
    })
 
    const getAllSeats = (): Promise<Seat[]> =>
        axios.get(`/seat/get-all-seats/${id}`).then((res) => res.data);
    const query = useQuery({
        queryKey: ['get-all-seats'],
        queryFn: getAllSeats,
    });
    const chooseSeatMutation = useMutation({
        mutationFn: (data: Seat) => axios.post(`/seat/choose-seat/${id}`, data),
        onSuccess: (res) => {
            if (res.data === 'seat is not available') {
                toast.warning("Seat is not available");
            } else {
                setMsg(res.data);
            }
        },
    });
    const handleChooseSeat = () => {
        if (!seat) {
            setMsg('You must choose seat');
        } else {
            chooseSeatMutation.mutate(seat);
        }
    };
    if (query.data) {
        return (
            <Container className="mt-3">
                <div className="mb-3">
                    <Button variant="success" className="me-2"></Button>
                    chosen
                    <Button variant="secondary" className="mx-2"></Button>
                    available
                    <Button variant="warning" className="mx-2"></Button>
                    not available
                </div>
                {query.data.map((item: Seat, index: number) => (
                    <Button
                    variant={
                        seat && item.seatId === seat.seatId
                            ? 'success'
                            : occupiedSeat && item.seatId === occupiedSeat.seatId
                            ? 'warning'
                            : item.available
                            ? 'secondary'
                            : 'warning'
                    }
                        key={index}
                        className="me-3 mb-3"
                        onClick={() => {
                            if (item.available) {
                                setSeat(item);
                            }
                        }}
                    >
                        {item.seatName}
                    </Button>
                ))}
                <Button onClick={handleChooseSeat} className="d-block mx-auto">
                    Submit
                </Button>
                {msg !== '' && <div className="text-center">{msg}</div>}
                <ToastContainer />
            </Container>
        );
    }
};

export default Checkin;
