interface Airport {
    airportName: string;
    location: string;
}

const combineAirportDetail = (allAirport: Airport[]): string[] => {
    return allAirport.map((airport: Airport) => {
        return airport.airportName + ' - ' + airport.location;
    });
};

export default combineAirportDetail;
