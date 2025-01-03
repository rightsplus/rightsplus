import type { FlightAviationEdge, FlightAviationStack } from "~/flight-api.types";
import type { Flight, FlightStatus, FlightStatusApi, RowAirline, RowFlight } from "~/types";


function addMinutesToIsoDate(isoDateStr: string, delay: number | null): string {
	console.log(isoDateStr, delay)
	if (!isoDateStr || !delay) return ''
	const date = new Date(isoDateStr);
	date.setMinutes(date.getMinutes() + delay);
	return date.toISOString();
}

function transformAviationEdgeFlightPhase(phaseData: FlightAviationEdge['arrival'] | FlightAviationEdge['departure']) {
	const delayDepature = parseInt(phaseData.delay || "0", 10)
	return {
		iata: phaseData.iataCode.toUpperCase(),
		delay: delayDepature,
		scheduledTime: phaseData.scheduledTime,
		estimatedTime: phaseData.estimatedTime,
		actualTime: phaseData.actualTime || addMinutesToIsoDate(phaseData.scheduledTime, delayDepature),
		estimatedRunway: phaseData.estimatedRunway,
		actualRunway: phaseData.actualRunway,
	};
}
function transformAirline(airline: FlightAviationEdge['airline']) {
	return {
		name: airline.name,
		iata: airline.iataCode.toUpperCase(),
	}
}
function transformFlight(flight: FlightAviationEdge['flight']) {
	return {
		number: flight.number,
		iata: flight.iataNumber.toUpperCase(),
	}
}
export const transformAviationEdgeFlight = (aviationEdgeFlight: FlightAviationEdge): Flight => {
	const transformedFlight: Flight = {
		type: aviationEdgeFlight.type,
		status: aviationEdgeFlight.status,
		departure: transformAviationEdgeFlightPhase(aviationEdgeFlight.departure),
		arrival: transformAviationEdgeFlightPhase(aviationEdgeFlight.arrival),
		airline: transformAirline(aviationEdgeFlight.airline),
		flight: transformFlight(aviationEdgeFlight.flight),
	};

	if (aviationEdgeFlight.codeshared) {
		const { airline, flight } = aviationEdgeFlight.codeshared
		transformedFlight.codeshared = {
			airline: transformAirline(airline),
			flight: transformFlight(flight),
		}
	}
	return transformedFlight
}
function transformAviationStackFlightPhase(phaseData: FlightAviationStack['arrival'] | FlightAviationStack['departure']) {
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
function sanitizeFlightStatus(flight: {
	status: FlightStatusApi;
	actualArrival: string;
	delay: number
}): FlightStatus {
	const status = flight.status
	if (flight.status === 'cancelled') return flight.status
	if (flight.delay > 0) return 'delayed'
	if (flight.actualArrival) {
		const arrival = new Date(flight.actualArrival)
		const now = new Date()
		return arrival < now ? 'landed' : 'active'
	}
	if (flight.status === 'landed') return 'unknown'
	return status
}

export const transformAviationStackFlight = (flight: FlightAviationStack): Flight => {

	const arrival = transformAviationStackFlightPhase(flight.arrival)
	const departure = transformAviationStackFlightPhase(flight.departure)
	return {
		type: "arrival",
		status: sanitizeFlightStatus({
			status: flight.flight_status,
			actualArrival: arrival.actualTime,
			delay: arrival.delay,
		}),
		departure,
		arrival,
		airline: {
			name: flight.airline.name,
			iata: flight.airline.iata
		},
		flight: {
			number: flight.flight.number,
			iata: flight.flight.iata
		},
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