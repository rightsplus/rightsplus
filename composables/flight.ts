import { euMember } from "is-european";
import { useI18n } from "#i18n"
import type { Airport, ClaimsForm, Flight, FlightAviationEdge, FlightPhase } from "@/types";
import { airports } from "~/store";


const circumstance = reactive({
	departure: false as boolean | string,
	arrival: false as boolean | string,
})
const getAirports = async (flight: Flight) => {
	const departureAirport = airports.value?.[flight?.departure?.iata || ""]
	const arrivalAirport = airports.value?.[flight?.arrival?.iata || ""]

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
	const flightDate = typeof flight === 'string' ? flight : flight.arrival?.scheduledTime
	const date = flightDate && new Date(flightDate)

	if (!date || typeof date === 'string') {
		console.warn("Missing scheduled date", typeof date)
		return false
	}
	return new Date().getFullYear() - date.getFullYear() > 3 ? new Date(new Date().getFullYear() - 3, 0) : false
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
	return delay >= limit ? delay : 0
}

export const isExtraordinaryCircumstance = async (flight: Flight | null) => {
	if (!flight) return circumstance

	const { departureAirport, arrivalAirport } = await getAirports(flight)

	const departureDate = flight.departure?.scheduledTime && new Date(flight.departure.scheduledTime)
	const arrivalDate = flight.arrival?.scheduledTime && new Date(flight.arrival.scheduledTime)

	if (!departureDate || !arrivalDate) {
		console.warn("Missing departure or arrival date")
		return circumstance
	}

	console.log(departureDate.getHours())

	getWeather(departureAirport, departureDate).then((weather) => {
		circumstance.departure = isUnsafeToTakeoffOrLand(weather, departureDate.getHours())
	})
	getWeather(arrivalAirport, arrivalDate).then((weather) => {
		circumstance.arrival = isUnsafeToTakeoffOrLand(weather, arrivalDate.getHours())
	})


	return circumstance
}

export const getDistance = (claim: ClaimsForm | null) => {
	if (!claim?.airport.trip.departure || !claim?.airport.trip.arrival) return 0

	const { departure, arrival } = claim.airport.trip
	return getAirportDistance(departure, arrival)
}

export const getEU = async (flight: Flight | null) => {
	if (!flight?.airline?.iata) return {
		departure: false,
		arrival: false,
		airline: false,
	}
	const { departureAirport, arrivalAirport } = await getAirports(flight)

	const airlineObject = await useAirlines(flight.airline.iata)

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
	const barred = isBarred(flight)
	const delay = getDelay(flight?.arrival)
	// const eu = getEU(flight)
	const eu = false
	return {
		barred: {
			value: barred,
			label: barred ? "Verjährt" : "Nicht verjährt",
		},
		cancelled: {
			value: flight?.status === "cancelled",
			label: flight?.status === "cancelled" ? "Annulliert" : "Nicht annulliert",
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

export const useDisruption = (claim: ClaimsForm) => {
	const { t, locale } = useI18n()
	const { airports } = useAirports()

	try {
		const format = new Intl.NumberFormat(locale.value);
		const delayedDetails = [
			{ value: "<3", preLabel: t("fewerThan").trim(), label: t("hours", 3) },
			{ value: "3-4", label: t("hours", { n: format.formatRange(3, 4) }, 3) }, // bei +3500 km: Vergütung 50%
			{ value: ">4", preLabel: t("moreThan").trim(), label: t("hours", 4) },
		];
		const cancelledDetails = [
			{ value: "<8", preLabel: t("fewerThan").trim(), label: t("days", 7) },
			{ value: "8-14", label: t("days", { n: format.formatRange(8, 14) }, 8) },
			{ value: ">14", preLabel: t("moreThan").trim(), label: t("days", 14) },
		];
		const disruptions = [
			{
				value: "delayed",
				label: t("disruptions.delayed.label"),
				sublabel: t("disruptions.delayed.sublabel", { city: airports.value[claim.flight?.arrival?.iata || '']?.city || t('itsDestination') }),
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
			// { value: "other", label: t('other'), icon: "question" },
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
				icon: "triangle-exclamation",
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
	} catch (error) {
		console.error(error)

		return {
			delayedDetails: [],
			cancelledDetails: [],
			disruptions: [],
			noBoardingReasons: [],
			cancelledDelayedReasons: [],
		}
	}
}

export const sortByScheduled = (a: Flight, b: Flight) =>
	new Date(a.departure.scheduledTime).getTime() -
	new Date(b.departure.scheduledTime).getTime() + (a.codeshared ? 1 : 0) -
	(b.codeshared ? 1 : 0);

export const removeDuplicateFlights = (flights: Flight[]) => {
	const uniqueFlights = new Set();
	return flights.filter((flight) => {
		const operatedBy =
			flight.codeshared?.airline.iata?.toUpperCase() ||
			flight.airline.iata?.toUpperCase();
		const id = `${operatedBy}-${get24HTime(
			flight.departure.scheduledTime
		)}-${get24HTime(flight.arrival.scheduledTime)}-${getISODate(
			flight.departure.scheduledTime
		)}`;
		if (uniqueFlights.has(id)) return false;
		uniqueFlights.add(id);
		return true;
	});
};



const transformAviationEdgeFlight = (aviationEdgeFlight: FlightAviationEdge): Flight => {
	const airline: Flight['airline'] = {
		name: ucfirst(aviationEdgeFlight.airline.name),
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
				name: ucfirst(aviationEdgeFlight.codeshared.airline.name),
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

const queries = ref([] as string[]);
export const useFlights = () => {
	const flights = ref<Flight[]>([])
	const { fetchProxy } = useSupabaseFunctions()
	const { airports } = useAirports()
	const ATTEMPTS = 3

	const fetchFlights = async (props: {
		date: string,
		departure?: string,
		arrival?: string,
		locale?: string,
	}, attempts = ATTEMPTS) => {
		const { departure, arrival, date, locale } = props
		try {
			if (
				!date ||
				!departure ||
				!arrival
			) {
				console.log("Missing date, departure or arrival");
				return
			}

			const query = `${departure}-${arrival}-${getISODate(date)}`;
			if (queries.value.includes(query)) {
				console.log("has been queried", queries.value, query);
				return
			}

			queries.value.push(query);
			// Create a URL instance with the desired URL string
			const url = new URL("https://aviation-edge.com/v2/public/flightsHistory");
			url.searchParams.append("code", departure);
			url.searchParams.append("type", 'departure');
			url.searchParams.append('date_from', date);
			// console.log('fetching started', date)
			// url.searchParams.append('date_to', date);

			// const url = new URL("https://app.airhelp.com/api/flights/selector");
			// url.searchParams.append('local_departure_date', new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-'));
			// url.searchParams.append("departure_airport_code", departure);
			// url.searchParams.append("arrival_airport_code", arrival);

			const key = useRuntimeConfig().public.flight.aviationEdge;
			url.searchParams.append("key", key);
			const res = await fetch(url.href)
			const data: FlightAviationEdge[] = await (res)?.json()
			const timeStamp = Date.now()
			console.log("fetchhh");
			// const data = await fetchProxy<FlightAviationEdge[]>(url.href)
			console.log(`Fetched from API in ${Date.now() - timeStamp}ms`, data);





			const distance = getAirportDistance(
				airports.value[arrival],
				airports.value[departure]
			)

			flights.value = data
				.map((flight) => transformAviationEdgeFlight(flight))
				.map(flight => {
					if (departure !== flight.departure.iata || arrival !== flight.arrival.iata) return flight
					return {
						...flight,
						distance
					}
				})


			console.log(flights.value.reduce((acc, curr) => {
				if (curr.status === 'cancelled') acc.cancelled.push(curr)
				else if (curr.arrival.delay > 180) acc.delayed.push(curr)
				return acc
			}, { cancelled: [] as Flight[], delayed: [] as Flight[] }))

		} catch (error) {

			if (attempts > 0) {
				console.log('fetch failed', error, attempts)
				fetchFlights(props, attempts - 1)
			} else {
				throw error
			}
		}
	}

	const getFilteredFlights = ({ departure, arrival, date, number, custom }: {
		departure?: string,
		arrival?: string,
		date?: string,
		number?: string,
		custom?: (flight: Flight) => boolean
	}) => {
		const filterFlights = (flight: Flight) => {
			return (
				(!departure || flight.departure.iata === departure) &&
				(!arrival || flight.arrival.iata === arrival) &&
				(!number || flight.flight.iata === number) &&
				(!date ||
					getISODate(flight[flight.type].scheduledTime) ===
					getISODate(date))
				&& (!custom || custom && custom(flight))
			);
		};

		return flights.value.filter(filterFlights)
	}
	return { fetchFlights, getFilteredFlights }
}

export const getCities = async (iataCodes: (string | undefined)[], locale?: string) => {
	const { query } = useAirports()
	return (await Promise.all(iataCodes.map(async e => await query(e || '')))).map(e => getCityTranslation(e, locale));
};
interface IataCodes {
	[x: string]: string | undefined

}
export const useCities = <T extends IataCodes>(iataCodes: T, options?: {
	iata?: boolean
}): Ref<T | undefined> => {
	const { locale } = useI18n()
	const cities = ref<T>();
	const { query } = useAirports()
	const assign = () => {
		cities.value = iataCodes
		query(Object.values(iataCodes).map(e => e || ''))
			.then((airports) => {
				Object.entries(iataCodes).forEach(([phase, iata]) => {
					let city = iata && airports[iata] && getCityTranslation(airports[iata], locale.value);
					if (options?.iata) city = city?.concat(' ', `(${iata})`)
					if (city && cities.value) {
						cities.value[phase] = city
					}
				})
			})
			.catch((error) => console.error(error))
	}
	watch(iataCodes, assign, { immediate: true, deep: true })
	return cities
}


export const useFlightRoute = (claim: ClaimsForm) => {
	const { airports, query } = useAirports()
	const routes = computed(() => generateRoutes?.(claim.airport.trip));

	const assignRoute = async () => {
		const [departure, arrival] = claim.route?.split("-") || [];
		await query([departure, arrival])
		Object.assign(claim.airport, { departure: airports.value[departure], arrival: airports.value[arrival] });
	};

	return { routes, assignRoute }
}