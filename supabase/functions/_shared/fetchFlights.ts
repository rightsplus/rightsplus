export const transformAviationEdgeFlight = (aviationEdgeFlight: FlightAviationEdge): Flight => {
	const airline: Flight['airline'] = {
		name: aviationEdgeFlight.airline.name,
		iata: aviationEdgeFlight.airline.iataCode.toUpperCase(),
	};

	const flight: Flight['flight'] = {
		number: aviationEdgeFlight.flight.number,
		iata: aviationEdgeFlight.flight.iataNumber.toUpperCase(),
	};

	const departure: Flight['departure'] = {
		iata: aviationEdgeFlight.departure.iataCode.toUpperCase(),
		delay: aviationEdgeFlight.departure.delay,
		scheduledTime: aviationEdgeFlight.departure.scheduledTime,
		estimatedTime: aviationEdgeFlight.departure.estimatedTime,
		actualTime: aviationEdgeFlight.departure.actualTime,
		estimatedRunway: aviationEdgeFlight.departure.estimatedRunway,
		actualRunway: aviationEdgeFlight.departure.actualRunway,
	};

	const arrival: Flight['arrival'] = {
		iata: aviationEdgeFlight.arrival.iataCode.toUpperCase(),
		delay: aviationEdgeFlight.arrival.delay || 0, // Ensure delay is a number
		scheduledTime: aviationEdgeFlight.arrival.scheduledTime,
		estimatedTime: aviationEdgeFlight.arrival.estimatedTime,
		actualTime: aviationEdgeFlight.arrival.actualTime,
		estimatedRunway: aviationEdgeFlight.arrival.estimatedRunway,
		actualRunway: aviationEdgeFlight.arrival.actualRunway,
	};

	const transformedFlight: Flight = {
		type: aviationEdgeFlight.type,
		status: aviationEdgeFlight.status,
		departure,
		arrival,
		airline,
		flight,
	};

	if (aviationEdgeFlight.codeshared) {
		transformedFlight.codeshared = {
			airline: {
				name: aviationEdgeFlight.codeshared.airline.name,
				iata: aviationEdgeFlight.codeshared.airline.iataCode.toUpperCase(),
			},
			flight: {
				number: aviationEdgeFlight.codeshared.flight.number,
				iata: aviationEdgeFlight.codeshared.flight.iataNumber.toUpperCase(),
			},
		}
	}
	return transformedFlight
}

export const prepareFlight = (flight: Flight) => {
	return {
		iata: flight.flight.iata,
		status: flight.status,
		airlineIata: flight.airline.iata,
		airportDeparture: flight.departure.iata,
		airportArrival: flight.arrival.iata,
		actualDeparture: flight.departure.actualTime,
		actualArrival: flight.arrival.actualTime,
		dateDeparture: flight.departure.scheduledTime.toLowerCase()?.split('t')[0],
		dateArrival: flight.arrival.scheduledTime.toLowerCase()?.split('t')[0],
		scheduledDeparture: flight.departure.scheduledTime,
		scheduledArrival: flight.arrival.scheduledTime,
		delayArrival: flight.arrival.delay,
		data: flight,
	} as Omit<RowFlight, 'id' | 'createdAt'>;
}


export default () => {
	
}