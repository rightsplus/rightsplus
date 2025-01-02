import type { ClaimsForm, ClaimState, Flight, FlightStatus, RowAirline } from "~/types";
import claimMachine from "~/machines/claimSubmission";



const processEligibility = (claim: ClaimsForm, airlines: Record<string, RowAirline>): {
	ineligible: string | false | null;
	message: string | null;
} => {
	let ineligible: string | false | null = null;
	let message: string | null = null

	if (!claim) return {
		message: 'errors.noClaim', // No claim
		ineligible,
	}

	const { airport, leg, flight, disruption, replacement, connection } = claim;
	const { departure, arrival, trip } = airport || {};

	// Validate trip details
	const validateTrip = () => {
		if (!departure || !Object.keys(departure).length || !arrival || !Object.keys(arrival).length) {
			return 'errors.airport.missing';
		}

		if (departure.iata === arrival.iata) return 'errors.airport.identical';
		if (!departure.ec261 && !arrival.ec261) return 'errors.ec261.airport';
		if (!leg || !generateLegs(trip)[leg]) return 'errors.leg.missing';
	};

	const tripError = validateTrip();
	console.log('tripError', tripError)
	if (tripError) message ??= tripError;

	// Validate flight details
	const validateFlight = () => {
		if (!flight) return 'errors.flight.missing'

		const airline = airlines[flight.airline.iata];
		if (!departure?.ec261 && !airline?.isEuMember) {
			ineligible = 'errors.ec261.airline';
			return ineligible; // Ineligible
		}


		if (!credibleFlightStatus(flight)) {
			console.log('incredible')
			return
		}

		if (flight.status === "delayed") {
			if (flight.arrival.delay < 180) {
				const { departure, arrival } = nextLeg(claim);

				console.log('flight.srarys', departure, arrival)
				// if (!disruption.connectingFlight) return ineligible
				if (!(departure || arrival) || flight.arrival.delay < 30) {
					ineligible = 'errors.delayed.<3.noConnection';
					return ineligible
				}

				if (!disruption.connectingFlight) return ineligible;
				if (!connection?.flight) return 'errors.connectionFlight.missing';
				if (reachedConnectionFlight(claim)) {
					ineligible = 'errors.flight.reached';
					return ineligible
				}
			} else {
				ineligible = false
			}
		} else if (flight.status === "cancelled") {
			if (!disruption.details) return 'errors.disruption.detail.cancelled';

			if (isReplacementFlightWithinBounds(claim)) {
				ineligible = 'errors.replacement.withinBounds';
				return ineligible
			}
			ineligible = false
		} else if (flight.status === 'landed') {
			ineligible = 'errors.landed.onTime';
			return ineligible
		}
	};

	const flightError = validateFlight();
	console.log('flightError', flightError)
	if (flightError) message ??= flightError;


	// If disruption has not yet been defined 
	// make a guesstimate base on the flight data
	if (!disruption || !disruption.type) {
		console.log("A")
		return {
			ineligible,
			message
		}
	}

	// When we can trust the flight status,
	// we do not check the disruption input by the user
	// disruption.type is noBoarding
	console.log('claim.disruption.connectingFlight', claim.disruption.connectingFlight)
	if ((disruption && disruption?.type !== "noBoarding") && (!claim.disruption.connectingFlight) && credibleFlightStatus(flight)) {
		console.log("B")
		return {
			ineligible,
			message
		}
	}

	// If the client was denied boarding by no fault of their owninflicted
	// we believe the client
	if (disruption.type === 'noBoarding' && !disruption.selfInflicted) {
		console.log("C")
		return {
			ineligible: false,
			message: ''
		}
	}


	// Validate disruption details
	const validateDisruption = () => {
		console.log('disruption', disruption)
		if (!disruption || !disruption.type) return 'errors.disruption.missing';

		if (disruption.type === "delayed") {
			if (!disruption.details) return 'errors.disruption.detail.delay';

			if (disruption.details === "<3") {
				const { departure, arrival } = nextLeg(claim);

				console.log(connection)
				if (!connection || !(departure || arrival)) {
					ineligible = 'errors.delayed.<3.noConnection';
					return ineligible
				}

				if (!connection.flight) return 'errors.connectionFlight.missing';
				if (reachedConnectionFlight(claim)) {
					ineligible = 'errors.connection.reached';
					return ineligible
				} else {
					ineligible = false;
					return ineligible
				}
			}
		} else if (disruption.type === "cancelled") {
			if (!disruption.details) return 'errors.disruption.detail.cancelled';

			if (disruption.details === '>14') {
				ineligible = 'errors.connection.reached';
				return ineligible
			}

			if (isReplacementFlightWithinBounds(claim)) {
				ineligible = 'errors.replacement.withinBounds';
				return ineligible
			}
		} else if (disruption.type === "noBoarding") {
			if (disruption.selfInflicted) {
				ineligible = 'errors.disruption.selfInflicted';
				return ineligible
			} else {
				ineligible = null;
				return 'errors.disruption.selfInflicted'
			}
		}
	};


	const disruptionError = validateDisruption();

	if (disruptionError) message ??= disruptionError;

	if (!tripError && !flightError && !disruptionError) ineligible = false
	console.log('D')
	return {
		ineligible,
		message
	}
};

export default () => {
	const { t } = useI18n()
	const claim = useClaim()

	const machine = useMachine<ClaimState, ClaimsForm>(claimMachine, {
		context: claim,
	});

	const { assignLeg } = useFlightLeg(claim);

	const { airlines } = useAirlines()

	const eligible = ref<boolean | null>(null);
	const ineligible = ref<string | false | null>(null);
	const compensation = ref(0);
	const distance = ref(0);
	const message = ref<string>();


	const getCompensation = () => {
		const distance = getDistance(claim)

		assignLeg()
		const { message, ineligible } = processEligibility(claim, airlines.value)

		let compensation = 0
		if (!ineligible) {
			const delay = claim.flight?.arrival.delay || 0
			compensation = 250
			if (distance > 1500) compensation = 400
			const beyondEU = [claim.airport.departure, claim.airport.arrival].some(e => !e?.ec261)
			if (distance > 3500 && beyondEU) compensation = 600
			if (distance > 3500 && delay > 180 && delay < 240) compensation /= 2
		}
		console.log('ineligible', ineligible)
		return {
			distance,
			compensation,
			message: message ? t(message) : "",
			ineligible: ineligible ? t(ineligible) : ineligible,
			eligible: ineligible != null ? ineligible === false : null
		}
	}

	watch(() => machine.state.value, () => {
		const { compensation: c, distance: d, message: m, ineligible: i, eligible: e, } = getCompensation()

		compensation.value = c
		distance.value = d
		message.value = m
		eligible.value = e
		ineligible.value = i
		claim.isEligible = e
	}, { immediate: true, deep: true })

	return { compensation, distance, message, ineligible, eligible }
}