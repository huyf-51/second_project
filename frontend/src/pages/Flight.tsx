import React from 'react';
import { Button, Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useLocation, useNavigate } from 'react-router-dom';
import dateFormat from 'dateformat';

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

const Flight: React.FC = () => {
    const navigate = useNavigate();
    const { state }: { state: Flight[] } = useLocation();
    return (
        <Container className="mt-5">
            {state.length !== 0 ? (
                <>
                    <div className="text-center fw-bold">
                        {state[0].originAirport.location} -{' '}
                        {state[0].destinationAirport.location}
                    </div>
                    <Table striped className="mt-3">
                        <thead>
                            <tr>
                                <th>Departure DateTime</th>
                                <th>Arrival DateTime</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.map((item: Flight, index: number) => (
                                <tr key={index}>
                                    <td>
                                        {dateFormat(item.departureDateTime)}
                                    </td>
                                    <td>{dateFormat(item.arrivalDateTime)}</td>
                                    <td>
                                        {item.availableSeats
                                            ? item.price
                                            : 'sold out'}
                                    </td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            disabled={!item.availableSeats}
                                            onClick={() =>
                                                navigate(
                                                    `/reservation/${item.flightId}`,
                                                    {
                                                        state: item,
                                                    }
                                                )
                                            }
                                        >
                                            Book
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            ) : (
                <div>
                    No flights found for your selection. Back to choose another
                    day.
                </div>
            )}
        </Container>
    );
};

export default Flight;
