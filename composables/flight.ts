import { App } from 'vue'
import { euMember } from "is-european";
import { useI18n } from "#i18n"
import { ClaimsForm, Flight, FlightPhase } from "~~/types";


const circumstance = reactive({
	departure: false as boolean | string,
	arrival: false as boolean | string,
})
const getAirports = async (flight: Flight) => {
	const airports = await useAirports([flight?.departure?.iata, flight?.arrival?.iata])
	const departureAirport = airports?.[flight?.departure?.iata || ""]
	const arrivalAirport = airports?.[flight?.arrival?.iata || ""]

	if (!departureAirport || !arrivalAirport) {
		// @todo: here I could actually make sure i load the appropriate airports, if they have not been loaded yet
		console.warn("Missing airport")
		return {
			departureAirport: null,
			arrivalAirport: null,
		}
	}
	return {
		departureAirport,
		arrivalAirport,
	}
}
export function isBarred(flight: string): Date
export function isBarred(flight: Flight | null): false | Date
export function isBarred(flight: Flight | string | null) {
	if (!flight) return false
	const flightDate = typeof flight === 'string' ? flight : flight.arrival?.scheduled
	const date = flightDate && new Date(flightDate)

	if (!date || typeof date === 'string') {
		console.warn("Missing scheduled date", typeof date)
		return false
	}
	return new Date().getFullYear() - date.getFullYear() > 3 ? new Date(date.getFullYear() + 1, 0) : false
}

// legacy
export const getDelay = (flightPhase?: FlightPhase, limit?: number) => {
	if (!flightPhase) return 0
	// const scheduledDate = flightPhase.scheduled && new Date(flightPhase.scheduled)
	// const actualDate = flightPhase.actual && new Date(flightPhase.actual)

	// if (!scheduledDate || !actualDate) {
	// 	console.warn("Missing scheduled or actual date")
	// }

	// const delay = scheduledDate && actualDate && (actualDate.getTime() - scheduledDate.getTime()) / 1000 / 60 || 0
	const { delay } = flightPhase

	if (!limit) return delay
	return delay > limit ? delay : 0
}

export const isExtraordinaryCircumstance = async (flight: Flight | null) => {
	if (!flight) return circumstance

	const { departureAirport, arrivalAirport } = await getAirports(flight)

	const departureDate = flight.departure?.scheduled && new Date(flight.departure.scheduled)
	const arrivalDate = flight.arrival?.scheduled && new Date(flight.arrival.scheduled)

	if (!departureDate || !arrivalDate) {
		console.warn("Missing departure or arrival date")
		return circumstance
	}

	getWeather(departureAirport, departureDate).then((weather) => {
		circumstance.departure = isUnsafeToTakeoffOrLand(weather, departureDate.getHours())
	})
	getWeather(arrivalAirport, arrivalDate).then((weather) => {
		circumstance.arrival = isUnsafeToTakeoffOrLand(weather, departureDate.getHours())
	})


	return circumstance
}

export const getDistance = (claim: ClaimsForm | null) => {
	if (!claim?.airport.trip.departure || !claim?.airport.trip.arrival) return 0
	const { departure, arrival } = claim.airport.trip

	return getAirportDistance(departure, arrival)
}

export const getEU = (flight: Flight | null) => {
	if (!flight) return {
		departure: false,
		arrival: false,
		airline: false,
	}
	const { departureAirport, arrivalAirport } = getAirports(flight)

	const airlineObject = useAirlines(flight.airline.iata)

	const departure = euMember(departureAirport?.country_code || "")
	const arrival = euMember(arrivalAirport?.country_code || "")
	const airline = airlineObject?.isEuMember
	return {
		departure,
		arrival,
		airline,
	}
}


export const useFlightStatus = (flight: Flight | null) => {
	// isExtraordinaryCircumstance(flight)

	const barred = isBarred(flight)
	const delay = getDelay(flight?.arrival, 180)
	const eu = getEU(flight)
	return {
		barred: {
			value: barred,
			label: barred ? "Verjährt" : "Nicht verjährt",
		},
		cancelled: {
			value: flight?.flight_status === "cancelled",
			label: flight?.flight_status === "cancelled" ? "Annulliert" : "Nicht annulliert",
		},
		delayed: {
			value: delay,
			label: delay ? `Verspätet (${delay} min)` : "Nicht verspätet",
		},
		europeanUnion: {
			value: eu,
			label: Object.values(eu).some(Boolean) ? eu : "Nicht EU",
		},
		extraordinaryCirumstance: {
			value: !!Object.values(circumstance).length,
			label: circumstance,
		}
	}
}

export const getFilteredFlights = ({ departure, arrival, date, custom }: {
	departure: string,
	arrival: string,
	date: string,
	custom?: (flight: Flight) => boolean
}) => {
	const filterFlights = (flight: Flight) => {
		return (
			flight.flight.number && // @todo check if this is good
			flight.departure.iata === departure &&
			flight.arrival.iata === arrival &&
			getISODate(flight.departure.scheduled) ===
			getISODate(date)
			&& (!custom || custom && custom(flight))
		);
	};
	return useAppState().flights?.filter(filterFlights)
}

export const useDisruption = (flight: Flight | null) => {
	const { t, locale } = useI18n()

	const arrivalAirport = computed(
		() => useAirports()[flight?.arrival.iata || ""]
	);

	const format = new Intl.NumberFormat(locale.value);
	const delayedDetails = [
		{ value: "<3", preLabel: t("fewerThan").trim(), label: t("hours", 3) },
		{ value: "3-4", label: t("hours", { n: format.formatRange(3, 4) }, 3) }, // bei +3500 km: Vergütung 50%
		{ value: ">4", preLabel: t("moreThan").trim(), label: t("hours", 4) },
	];
	const cancelledDetails = [
		{ value: "<7", preLabel: t("fewerThan").trim(), label: t("days", 7) },
		{ value: "8-14", label: t("days", { n: format.formatRange(8, 14) }, 8) },
		{ value: ">14", preLabel: t("moreThan").trim(), label: t("days", 14) },
	];
	const disruptions = [
		{
			value: "delayed",
			label: t("disruptions.delayed.label"),
			sublabel: t("disruptions.delayed.sublabel", { city: arrivalAirport.value?.city || t('itsDestination') }),
			icon: "clock",
		},
		{
			value: "cancelled",
			label: t("disruptions.cancelled.label"),
			sublabel: t("disruptions.cancelled.sublabel"),
			icon: "arrow-right-arrow-left",
		},
		{
			value: "noBoarding",
			label: t("disruptions.noBoarding.label"),
			sublabel: t("disruptions.noBoarding.sublabel"),
			icon: "ban",
		},
		{ value: "other", label: t('other'), icon: "question" },
	];
	const noBoardingReasons = [
		{
			value: "missingOrInvalidTravelDocuments",
			label: t('reasons.missingOrInvalidTravelDocuments.label'),
			icon: "passport",
			selfInflicted: true
		},
		{
			value: "lateArrival",
			label: t('reasons.lateArrival.label'),
			icon: "clock",
			selfInflicted: true
		},
		{
			value: "overbooking",
			label: t('reasons.overbooking.label'),
			icon: "users",
		},
		{
			value: "healthIssues",
			label: t('reasons.healthIssues.label'),
			icon: "heartbeat",
			selfInflicted: true // @todo: check
		},
		{
			value: "intoxication",
			label: t('reasons.intoxication.label'),
			icon: "beer",
			selfInflicted: true
		},
		{
			value: "securityConcerns",
			label: t('reasons.securityConcerns.label'),
			icon: "shield-alt",
			selfInflicted: true
		},
		{
			value: "behaviouralIssues",
			label: t('reasons.behaviouralIssues.label'),
			icon: "smoking",
			selfInflicted: true
		},
		{
			value: "technicalIssues",
			label: t('reasons.technicalIssues.label'),
			icon: "wrench",
		},
		{
			value: "restrictedItems",
			label: t('reasons.restrictedItems.label'),
			icon: "gun",
			selfInflicted: true
		},
		{
			value: "restrictedDestinations",
			label: t('reasons.restrictedDestinations.label'),
			icon: "map-marker-alt",
			selfInflicted: true // @todo: check
		},
		{
			value: "other",
			label: t('other'),
			icon: "question",
		},
	];
	const cancelledDelayedReasons = [
		{
			value: "dontRemember",
			label: t('resons.dontRemember.label'),
			icon: "question",
		},
		{
			value: "technicalIssues",
			label: t('reasons.technicalIssues.label'), icon: "cogs"
		},
		{ value: "weatherConditions", label: "Wetterbedingungen", icon: "cloud-sun" },
		{
			value: "lateArrivalOfAircraft",
			label: t('reasons.lateArrivalOfAircraft.label'),
			icon: "plane-arrival",
		},
		{ value: "crewIssues", label: t('resons.crewIssues.label'), icon: "users" },
		{ value: "airportCongestion", label: t('resons.airportCongestion.label'), icon: "road" },
		{ value: "securityIssues", label: t('resons.securityIssues.label'), icon: "shield-alt" },
		{
			value: "airTrafficControl",
			label: t('reasons.airTrafficControl.label'),
			icon: "plane-circle-exclamation",
		},
		{
			value: "unexpectedIssues",
			label: t('reasons.unexpectedIssues.label'),
			icon: "exclamation-triangle",
		},
		{
			value: "other",
			label: t('other'),
			icon: "question",
		},
	];
	return {
		delayedDetails,
		cancelledDetails,
		disruptions,
		noBoardingReasons,
		cancelledDelayedReasons,
	}
}

export const sortByScheduled = (a: Flight, b: Flight) =>
	new Date(a.departure.scheduled).getTime() -
	new Date(b.departure.scheduled).getTime();

export const removeDuplicateFlights = (flights: Flight[]) => {
	const uniqueFlights = new Set();
	return flights.filter((flight) => {
		const operatedBy =
			flight.flight.codeshared?.airline_iata?.toUpperCase() ||
			flight.airline.iata?.toUpperCase();
		const id = `${operatedBy}-${get24HTime(
			flight.departure.scheduled
		)}-${get24HTime(flight.arrival.scheduled)}-${getISODate(
			flight.departure.scheduled
		)}`;
		if (uniqueFlights.has(id)) return false;
		uniqueFlights.add(id);
		return true;
	});
};

const queries = ref([] as string[]);
export const fetchFlights = async ({ departure, arrival, date }: {
	departure: string,
	arrival: string,
	date: string,
}) => {
	const { aviationstack } = useRuntimeConfig().public.flight;
	try {
		if (
			!date ||
			!departure ||
			!arrival
		) {
		}

		const fetched = useAppState().flights.find(
			(e) =>
				e.flight_date === date &&
				e.departure.iata === departure &&
				e.arrival.iata === arrival
		);
		if (fetched) {
			console.log("fetched from cache", useAppState().flights);
			return
		}
		const query = `${departure}-${arrival}-${getISODate(date)}`;
		if (queries.value.includes(query)) {
			return
		}
		queries.value.push(query);
		// Create a URL instance with the desired URL string
		const proxy =
			process.env.NODE_ENV === "development" ? "https://cors-anywhere.herokuapp.com/" : "";
		const url = new URL(proxy + "http://api.aviationstack.com/v1/flights");
		url.searchParams.append("access_key", aviationstack);
		url.searchParams.append("dep_iata", departure);
		url.searchParams.append("arr_iata", arrival);
		// url.searchParams.append('flight_date', date);

		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Access-Control-Allow-Origin", "*");
		headers.append("X-Requested-With", "XMLHttpRequest");

		const requestOptions = {
			method: "GET",
			headers: headers,
		};

		console.log("fetching...", url.href);
		
		// fetch("api/aviationstack-delayed.json")
		// fetch("api/aviationstack-lax-jfk.json")

		const { data }: { data: Flight[] } = await (await fetch(url.href, requestOptions)).json()

		const uniqueFlights = data
			? removeDuplicateFlights(
				[...useAppState().flights, ...data].sort(sortByScheduled)
			)
			: [];

		const flights = uniqueFlights?.map((flight) => {
			const airports = {
				departure: useAirports(flight.departure.iata),
				arrival: useAirports(flight.arrival.iata),
			};
			return {
				...flight,
				...(airports.departure &&
					airports.arrival && {
					distance: getAirportDistance(
						airports.departure,
						airports.arrival
					),
				}),
			};
		});
		useAppState().flights = flights;
	} catch (error) {
		throw error
	}
}

export const getCities = async (iataCodes: (string | undefined)[], locale?: string) => {
  return (await Promise.all(iataCodes.map(e => useAirports(e)))).map(e => getCityTranslation(e, locale));
};