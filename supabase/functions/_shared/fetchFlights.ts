import type { FlightAviationEdge, FlightAviationStack } from "~/aviation-edge.types";
import type { Flight, RowAirline, RowFlight } from "~/types";


function addMinutesToIsoDate(isoDateStr: string, delay: number | null): string {
	console.log(isoDateStr, delay)
	if (!isoDateStr || !delay) return ''
	const date = new Date(isoDateStr);
	date.setMinutes(date.getMinutes() + delay);
	return date.toISOString();
}

export const transformAviationEdgeFlight = (aviationEdgeFlight: FlightAviationEdge): Flight => {
	const airline: Flight['airline'] = {
		name: aviationEdgeFlight.airline.name,
		iata: aviationEdgeFlight.airline.iataCode.toUpperCase(),
	};

	const flight: Flight['flight'] = {
		number: aviationEdgeFlight.flight.number,
		iata: aviationEdgeFlight.flight.iataNumber.toUpperCase(),
	};
	const delayDepature = parseInt(aviationEdgeFlight.departure.delay || "0", 10)
	const departure: Flight['departure'] = {
		iata: aviationEdgeFlight.departure.iataCode.toUpperCase(),
		delay: delayDepature,
		scheduledTime: aviationEdgeFlight.departure.scheduledTime,
		estimatedTime: aviationEdgeFlight.departure.estimatedTime,
		actualTime: aviationEdgeFlight.departure.actualTime || addMinutesToIsoDate(aviationEdgeFlight.departure.scheduledTime, delayDepature),
		estimatedRunway: aviationEdgeFlight.departure.estimatedRunway,
		actualRunway: aviationEdgeFlight.departure.actualRunway,
	};
	
	const delayArrival = parseInt(aviationEdgeFlight.arrival.delay || "0", 10)
	const arrival: Flight['arrival'] = {
		iata: aviationEdgeFlight.arrival.iataCode.toUpperCase(),
		delay: delayArrival,
		scheduledTime: aviationEdgeFlight.arrival.scheduledTime,
		estimatedTime: aviationEdgeFlight.arrival.estimatedTime,
		actualTime: aviationEdgeFlight.arrival.actualTime || addMinutesToIsoDate(aviationEdgeFlight.departure.scheduledTime, delayArrival),
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
function transformFlightPhase(phaseData: FlightAviationStack['arrival'] | FlightAviationStack['departure']) {
	return {
		iata: phaseData.iata,
		delay: phaseData.delay || 0,
		scheduledTime: phaseData.scheduled,
		estimatedTime: phaseData.estimated,
		actualTime: phaseData.actual || addMinutesToIsoDate(phaseData.scheduled, phaseData.delay) || '',
		estimatedRunway: phaseData.estimated_runway || '',
		actualRunway: phaseData.actual_runway || ''
	};
}
export const transformAviationStackFlight = (flight: FlightAviationStack): Flight => {
	// @todo: sanitize flight status

	return {
		type: "arrival",  // This could be dynamically determined based on context
		status: flight.flight_status,
		departure: transformFlightPhase(flight.departure),
		arrival: transformFlightPhase(flight.arrival),
		airline: {
			name: flight.airline.name,
			iata: flight.airline.iata
		},
		flight: {
			number: flight.flight.number,
			iata: flight.flight.iata
		},
		distance: undefined,
		codeshared: flight.flight.codeshared ? {
			airline: {
				name: flight.flight.codeshared.airline_name,
				iata: flight.flight.codeshared.airline_iata.toUpperCase()
			},
			flight: {
				number: flight.flight.codeshared.flight_number,
				iata: flight.flight.codeshared.flight_iata.toUpperCase()
			}
		} : undefined
	}
}

const fixedAirlines: Record<string, RowAirline> = {}
export const prepareFlight = (flight: Flight, airlines?: RowAirline[]) => {
	// console.log("before:",flight)
	// const airline = fixedAirlines[flight.airline.iata] || airlines?.find(airline => airline.iata === flight.airline.iata) || { iata: flight.airline.iata, name: flight.airline.name }
	// fixedAirlines[flight.airline.iata] = airline
	// flight.airline = airline

	// console.log("after:",flight)

	// @todo: add arrival delay to actual arrival timestamp ??
	return {
		iata: flight.flight.iata,
		status: flight.status,
		airlineIata: flight.airline.iata,
		airportDeparture: flight.departure.iata,
		airportArrival: flight.arrival.iata,
		actualDeparture: flight.departure.actualTime || null,
		actualArrival: flight.arrival.actualTime || null,
		scheduledDeparture: flight.departure.scheduledTime || null,
		scheduledArrival: flight.arrival.scheduledTime || null,
		dateDeparture: flight.departure.scheduledTime?.toLowerCase().split('t')[0],
		dateArrival: flight.arrival.scheduledTime?.toLowerCase().split('t')[0],
		delayArrival: flight.arrival.delay,
		data: flight,
	} as Omit<RowFlight, 'id' | 'createdAt'>;
}


export default () => { }