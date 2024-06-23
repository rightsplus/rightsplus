import { useI18n } from "#i18n"
import { type RowAirline, type Airport, type ClaimsForm, type Flight, type VariFlight, type FlightPhase, type AirlineInfo } from "@/types";
import { airports } from "~/store";
import { airlines } from "~/store";


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

	// getWeather(departureAirport, departureDate).then((weather) => {
	// 	circumstance.departure = isUnsafeToTakeoffOrLand(weather, departureDate.getHours())
	// })
	// getWeather(arrivalAirport, arrivalDate).then((weather) => {
	// 	circumstance.arrival = isUnsafeToTakeoffOrLand(weather, arrivalDate.getHours())
	// })


	return circumstance
}

export const getDistance = (claim: ClaimsForm | null) => {
	if (!claim?.airport.trip.departure || !claim?.airport.trip.arrival) return 0

	const { departure, arrival } = claim.airport.trip
	return getAirportDistance(departure, arrival)
}

// export const getEU = async (flight: Flight | null) => {
// 	if (!flight?.airline?.iata) return {
// 		departure: false,
// 		arrival: false,
// 		airline: false,
// 	}
// 	const { departureAirport, arrivalAirport } = await getAirports(flight)

// 	const airlineObject = await useAirlines(flight.airline.iata)

// 	const departure = euMember(departureAirport?.country_code || "")
// 	const arrival = euMember(arrivalAirport?.country_code || "")
// 	const airline = airlineObject?.isEuMember
// 	return {
// 		departure,
// 		arrival,
// 		airline,
// 	}
// }


export const useFlightStatus = (flight: Flight, options?: { detailed: boolean}) => {
	// console.log(flight)
	// const barred = isBarred(flight)
	// const delay = getDelay(flight?.arrival)
	// // const eu = getEU(flight)
	// const eu = false
	// // return {
	// // 	barred: {
	// // 		value: barred,
	// // 		label: barred ? "Verjährt" : "Nicht verjährt",
	// // 	},
	// // 	cancelled: {
	// // 		value: flight?.status === "cancelled",
	// // 		label: flight?.status === "cancelled" ? "Annulliert" : "Nicht annulliert",
	// // 	},
	// // 	delayed: {
	// // 		value: delay,
	// // 		label: delay ? `Verspätet (${delay} min)` : "Nicht verspätet",
	// // 	},
	// // 	europeanUnion: {
	// // 		value: eu,
	// // 		label: Object.values(eu).some(Boolean) ? eu : "Nicht EU",
	// // 	},
	// // 	extraordinaryCirumstance: {
	// // 		value: !!Object.values(circumstance).length,
	// // 		label: circumstance,
	// // 	}
	// // }
	const { t } = useI18n();
	return computed(() => {
		const s = flight?.arrival?.delay > 0 ? "delayed" : flight?.status;
		const base = "text-sm font-medium leading-none whitespace-nowrap px-2 py-1 -mx-1 rounded-full border "
		// console.log(s)
		return {
			cancelled: {
				class: base + "bg-red-100 border-red-200 text-red-600",
				text: t("cancelled"),
			},
			delayed: {
				class: base + "bg-yellow-100 border-yellow-200 text-yellow-700",
				text: options?.detailed ? t("delayed.by", {
					value: getDuration(flight?.arrival?.delay || 0),
				 }) : t("delayed"),
			},
			diverted: {
				class: base + "bg-yellow-100 border-yellow-200 text-yellow-700",
				text: t("diverted"),
			},
			landed: {
				class: base + "bg-green-100 border-green-200 text-green-600",
				text: t("onTime"),
			},
			scheduled: {
				class: base + "bg-green-100 border-green-200 text-green-600",
				text: t("scheduled"),
			},
			active: {
				class: base + "bg-green-100 border-green-200 text-green-600",
				text: t("active"),
			},
			unknown: {
				class: base + "bg-gray-100 border-gray-200 text-gray-600",
				text: t("unknown"),
			},
		}[s || 'unknown'];

	});
}


export const useAirlines = () => {
	const client = useSupabaseClient()
	async function query(iata: string): Promise<RowAirline>
	async function query(iata: string[]): Promise<Record<string, RowAirline>>
	async function query(iata: string | string[]): Promise<RowAirline | Record<string, RowAirline>> {
		const iatas = Array.isArray(iata) ? iata : [iata]
		await Promise.all(iatas.map(async (iata) => {
			if (airlines.value[iata]) return
			await client.from('airline').select('*').eq('iata', iata).returns<RowAirline[]>().then(({ data }) => {
				// 		console.log(data)
				const [airline] = data || []
				if (airline) airlines.value[iata] = {
					...airline,
				}

			})
		}))
		return Array.isArray(iata) ? airlines.value : airlines.value[iata]
	}
	return {
		airlines,
		query
	}
}

export const airlinesByFlights = (flights: Flight[]) => Object.values(
	flights.reduce(
		(acc, curr) => ({ ...acc, [curr.airline.iata]: curr }),
		{} as Record<string, Flight>
	)
)

export const useAirports = () => {
	async function query(iata: string): Promise<Airport>
	async function query(iata: string[]): Promise<Record<string, Airport>>
	async function query(iata: string | string[]) {
		const algolia = useAlgoliaSearch("AIRPORTS")
		const iatas = Array.isArray(iata) ? iata : [iata]
		await Promise.all(iatas.map(async (iata) => {
			if (airports.value[iata]) return
			await queryAirports(algolia, iata)
		}))
		return Array.isArray(iata) ? airports.value : airports.value[iata]
	}
	return {
		airports,
		query
	}
}


export const useDisruption = () => {
	const { t, locale } = useI18n()

	try {
		const format = new Intl.NumberFormat(locale.value);
		const delayedDetails = [
			{ value: "<3" as ClaimsForm['disruption']['details'], preLabel: t("fewerThan").trim(), label: t("hours", 3) },
			{ value: "3-4" as ClaimsForm['disruption']['details'], label: t("hours", { n: format.formatRange(3, 4) }, 3) }, // bei +3500 km: Vergütung 50%
			{ value: ">4" as ClaimsForm['disruption']['details'], preLabel: t("moreThan").trim(), label: t("hours", 4) },
		];
		const cancelledDetails = [
			{ value: "<8" as ClaimsForm['disruption']['details'], preLabel: t("fewerThan").trim(), label: t("days", 7) },
			{ value: "8-14" as ClaimsForm['disruption']['details'], label: t("days", { n: format.formatRange(8, 14) }, 8) },
			{ value: ">14" as ClaimsForm['disruption']['details'], preLabel: t("moreThan").trim(), label: t("days", 14) },
		];
		const disruptions = [
			{
				value: "delayed" as ClaimsForm['disruption']['type'],
				label: t("disruptions.delayed.label"),
				sublabel: t("disruptions.delayed.sublabel"),
				icon: "clock",
			},
			{
				value: "cancelled" as ClaimsForm['disruption']['type'],
				label: t("disruptions.cancelled.label"),
				sublabel: t("disruptions.cancelled.sublabel"),
				icon: "arrow-right-arrow-left",
			},
			{
				value: "noBoarding" as ClaimsForm['disruption']['type'],
				label: t("disruptions.noBoarding.label"),
				sublabel: t("disruptions.noBoarding.sublabel"),
				icon: "ban",
			},
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

export const transformVariFlight = (flightObject: VariFlight) => {
	const { FlightNo, FlightCompany, FlightDepcode, FlightArrcode, FlightDeptimePlanDate, FlightArrtimePlanDate, FlightDeptimeReadyDate, FlightArrtimeReadyDate, FlightDeptimeDate, FlightArrtimeDate, FlightIngateTime, FlightOutgateTime, CheckinTable, BoardGate, BaggageID, BoardState, FlightState, FlightHTerminal, FlightTerminal, org_timezone, dst_timezone, ShareFlightNo, StopFlag, ShareFlag, LegFlag, FlightDep, FlightArr, deptel, arrtel, airlinetel, FlightDepAirport, FlightArrAirport, OntimeRate, generic, FlightYear, FlightDuration, distance, VeryZhunReadyDeptimeDate, VeryZhunReadyArrtimeDate, DepAirportLat, DepAirportLon, DepTerminalLat, DepTerminalLon, ArrAirportLat, ArrAirportLon, ArrTerminalLat, ArrTerminalLon, StopAirportCode, StopCity } = flightObject;

	const flight: Flight = {
		type: 'departure',
		status: FlightState === 'arrival' ? 'landed' : FlightState === 'cancel' ? 'cancelled' : 'unknown',
		departure: {
			iata: FlightDepcode,
			delay: 0, // You might want to calculate this based on time data
			scheduledTime: FlightDeptimePlanDate,
			estimatedTime: FlightDeptimeReadyDate,
			actualTime: FlightDeptimeDate,
			estimatedRunway: FlightDeptimeReadyDate,
			actualRunway: FlightDeptimeDate,
		},
		arrival: {
			iata: FlightArrcode,
			delay: 0, // You might want to calculate this based on time data
			scheduledTime: FlightArrtimePlanDate,
			estimatedTime: FlightArrtimeReadyDate,
			actualTime: FlightArrtimeDate,
			estimatedRunway: FlightArrtimeReadyDate,
			actualRunway: FlightArrtimeDate,
		},
		airline: {
			name: FlightCompany,
			iata: '', // You might want to fetch this from somewhere
		},
		flight: {
			number: FlightNo,
			iata: FlightNo, // You might want to fetch this from somewhere
		},
		distance: parseInt(distance),
		codeshared: {
			airline: {
				name: '',
				iata: '', // You might want to fetch this from somewhere
			},
			flight: {
				number: ShareFlightNo,
				iata: '', // You might want to fetch this from somewhere
			},
		},
	};

	return flight;
}




const queries = ref([] as string[]);
let savedFlights = []
if (typeof localStorage !== 'undefined') {
	savedFlights = JSON.parse(localStorage.getItem('flights') || '[]')
} else {
	savedFlights = []
}
const flights = ref<Flight[]>(savedFlights)
export const useFlights = () => {
	const { fetchProxy, fetchFlights: fetchFlightsSupabase } = useSupabaseFunctions()
	// const { airports } = { airports: ref({})}
	const { airports } = useAirports()
	const { airlines, query: queryAirlines } = useAirlines()
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

			const query = [departure, arrival, getISODate(date)].filter(Boolean).join('-');
			if (queries.value.includes(query) && flights.value.length) {
				console.log("has been queried", queries.value, query, flights.value);
				return
			}

			queries.value.push(query);


			console.log('fetchFlightsSupabase')
			const data = await fetchFlightsSupabase<Flight[]>({
				departure,
				arrival,
				date,
			})
			console.log(data)


			const distance = getAirportDistance(
				airports.value[arrival],
				airports.value[departure]
			)

			flights.value = data
				.map(flight => {
					if (departure !== flight.departure.iata || arrival !== flight.arrival.iata) return flight
					return {
						...flight,
						distance
					}
				})


			// console.log(flights.value.reduce((acc, curr) => {
			// 	if (curr.status === 'cancelled') acc.cancelled.push(curr)
			// 	else if (curr.arrival.delay > 180) acc.delayed.push(curr)
			// 	return acc
			// }, { cancelled: [] as Flight[], delayed: [] as Flight[] }))

		} catch (error) {
			if (attempts > 0) {
				console.log('fetch failed', error)
				console.log('remaining attempts:', attempts)
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
	return { flights, fetchFlights, getFilteredFlights }
}

export const getCities = async (iataCodes: (string | undefined)[], locale?: string) => {
	const { query } = useAirports()
	return (await Promise.all(iataCodes.map(async e => await query(e || '')))).map(e => getCityTranslation(e, locale));
};

export const useCities = <T extends { arrival?: string; departure?: string;[x: string]: string | undefined }>(iataCodes: T, options?: {
	iata?: boolean
}): Ref<T> => {
	const { locale } = useI18n()
	const cities = ref();
	const { query } = useAirports()
	// console.log(arrival)
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
export const useAirline = <T extends AirlineInfo>(airlineInfo?: T): { pending: Ref<boolean>, airline: Ref<AirlineInfo> } => {
	const airline = ref<AirlineInfo>({} as AirlineInfo);
	const pending = ref(true)
	const { airlines, query } = useAirlines()
	const assign = () => {
		if (!airlineInfo) return
		if (!airline.value) airline.value = airlineInfo
		pending.value = true
		if (airlines.value[airlineInfo.iata]) {
			airline.value = airlines.value[airlineInfo.iata]
			pending.value = false
			return
		}
		query(airlineInfo.iata)
			.then((e) => {
				// console.log('query airline response in flights.ts:612', e)
				if (e && airlines.value) airline.value = e
				pending.value = true
			})
			.catch((error) => console.log(error))
			.finally(() => {
				pending.value = false
			})
	}
	watch(() => airlineInfo, assign, { immediate: true, deep: true })
	return { airline, pending }
}


export const useFlightLeg = (claim: ClaimsForm) => {
	const { airports, query } = useAirports()
	const legs = computed(() => generateLegs?.(claim.airport.trip));

	const assignLeg = async () => {

		const iatasLeg = Object.keys(legs.value);
		if (iatasLeg.length <= 1) claim.leg = iatasLeg[0];
		const [departure, arrival] = claim.leg?.split("-") || [];
		await query([departure, arrival])

		Object.assign(claim.airport, { departure: airports.value[departure], arrival: airports.value[arrival] });
	};

	return { legs, assignLeg, airport: claim.airport }
}