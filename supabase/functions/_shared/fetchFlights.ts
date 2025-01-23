import type { FlightAviationEdge, FlightAviationStack } from "~/flight-api.types";
import type { Flight, FlightPhase, FlightStatus, FlightStatusApi, RowAirline, RowFlight } from "~/types";
import { createClient } from 'supabase'


const uniqueAirlineIatas = <F extends Flight>(flights: F[]) => {
	return Array.from<string>(flights.reduce((map: Set<string>, flight: F) => {
		map.add(flight.airline.iata);
		return map;
	}, new Set<string>()))
}
const fetchAirlines = async (
	iatas: string[],
	req: { headers: { get: (arg0: string) => any } } | undefined
) => {
	const authHeader = req?.headers?.get('Authorization');
	if (!authHeader) throw new Error('Missing Authorization header');
	const supabase = createClient(
		Deno.env.get('SUPABASE_URL') || '',
		Deno.env.get('SUPABASE_ANON_KEY') || ''
	);

	const { data: airlines, error } = await supabase.from('airline').select('*').in('iata', iatas);
	if (error) throw new Error(`Failed to fetch airlines: ${error.message}`);

	const airlineMap = new Map<string, RowAirline>();
	for (const airline of airlines) {
		airlineMap.set(airline.iata, airline);
	}

	return airlineMap
}


export const credibleFlightStatus = (flight: Flight | null): FlightStatus | undefined => {
	if (!flight) return
	if (['cancelled', 'delayed', 'landed'].includes(flight.status)) return flight.status
}


export const correctedFlightStatus = (flight: Flight): FlightStatus => {
	const credible = credibleFlightStatus(flight);
	if (credible) return credible;

	const now = new Date();

	if (flight.status === 'active') {
		if (flight.arrival.actualTime && new Date(flight.arrival.actualTime) < now) {
			return "landed";
		}
	}

	if (flight.status === 'scheduled') {
		if (
			flight.departure.actualTime &&
			flight.arrival.actualTime &&
			new Date(flight.departure.actualTime) < now &&
			new Date(flight.arrival.actualTime) > now
		) {
			return "active";
		}
		if (flight.departure.scheduledTime && new Date(flight.departure.scheduledTime) > now) {
			return "scheduled";
		}
	}

	return 'unknown';
};

export const getOperatingAirline = ({ codeshared, airline }: Flight) => codeshared?.airline.iata || airline.iata;

export const getCodesharedFlightId = (flight: Flight) => {
	if (!flight?.departure) return;
	return `${flight.departure.scheduledTime}-${getOperatingAirline(flight)}`;
};

export const consolidateFlights = async (flights: Flight[], req: { headers: { get: (arg0: string) => any } } | undefined, updateAirlines = false): Promise<Flight[]> => {

	const airlines = updateAirlines ? await fetchAirlines(uniqueAirlineIatas(flights), req) : new Map<string, RowAirline>();

	const flightMaps = new Map<
		string,
		{
			flights: Flight[];
			credibleCommon: {
				departure?: FlightPhase;
				arrival?: FlightPhase;
				status?: FlightStatus;
			}
		}
	>();

	for (const flight of flights) {
		const groupKey = getCodesharedFlightId(flight);
		if (!groupKey) continue;

		if (!flightMaps.has(groupKey)) {
			flightMaps.set(groupKey, {
				flights: [],
				credibleCommon: {}
			});
		}
		const group = flightMaps.get(groupKey);
		if (!group) continue;

		if (updateAirlines) {
			const { name, iata } = airlines.get(flight.airline.iata) || flight.airline
			flight.airline.name = name;
			flight.airline.iata = iata;
			if (flight.codeshared) {
				const { name, iata } = airlines.get(flight.codeshared.airline.iata) || flight.codeshared.airline;
				flight.codeshared.airline.name = name
				flight.codeshared.airline.iata = iata
			}
		}
		group.flights.push(flight);
		group.credibleCommon.status = correctedFlightStatus(flight);
		if (flight.arrival.actualTime) {
			group.credibleCommon.arrival = flight.arrival;
		}
	}
	return [...flightMaps.values()].flatMap(e => e.flights.map(f => ({ ...f, ...e.credibleCommon })))
}

function addMinutesToIsoDate(isoDateStr: string, delay: number | null): string {
	if (!isoDateStr || delay == null) return ''
	const date = new Date(isoDateStr);
	date.setMinutes(date.getMinutes() + delay);
	return date.toISOString();
}

function transformAviationEdgeFlightPhase(phaseData: FlightAviationEdge['arrival'] | FlightAviationEdge['departure']) {
	const delayDepature = Number.parseInt(phaseData.delay || "0", 10)
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