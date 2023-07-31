import { App } from 'vue'
import { euMember } from "is-european";
import { useI18n } from "#i18n"
import { Flight, FlightPhase } from "~~/types";


const circumstance = reactive({
	departure: false as boolean | string,
	arrival: false as boolean | string,
})
const getAirports = (flight: Flight) => {
	const airports = useAirports([flight?.departure?.iata, flight?.arrival?.iata])
	const departureAirport = airports?.[flight?.departure?.iata || ""]
	const arrivalAirport = airports?.[flight?.arrival?.iata || ""]

	if (!departureAirport || !arrivalAirport) {
		// @todo: here I could actually make sure i load the appropriate airports, if they have not been loaded yet
		console.warn("Missing airport")
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
	const {delay} = flightPhase

	if (!limit) return delay
	return delay > limit ? delay : 0
}

export const isExtraordinaryCircumstance = (flight: Flight | null) => {
	if (!flight) return circumstance

	const { departureAirport, arrivalAirport } = getAirports(flight)

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

const getDistance = (flight: Flight | null) => {
	if (!flight) return 0
	const { departureAirport, arrivalAirport } = getAirports(flight)

	return getAirportDistance(departureAirport, arrivalAirport)
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
	const nuxtApp = useNuxtApp();
	isExtraordinaryCircumstance(flight)

	const barred = isBarred(flight)
	const delay = getDelay(flight?.arrival, 180)
	const distance = getDistance(flight)
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
		distance: {
			value: distance,
			label: distance ? nuxtApp.$i18n.n(distance, 'km') : "Keine Distanz",
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