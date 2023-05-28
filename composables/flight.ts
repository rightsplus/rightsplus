import { App } from 'vue'
import { euMember } from "is-european";
import { useI18n } from "#i18n"
import { Flight, FlightPhase } from "~~/types";


const circumstance = reactive({
	departure: false as boolean | string,
	arrival: false as boolean | string,
})
const getAirports = (flight: Flight) => {
	const airports = useAirports([flight?.departure?.iata_code, flight?.arrival?.iata_code])
	const departureAirport = airports?.[flight?.departure?.iata_code || ""]
	const arrivalAirport = airports?.[flight?.arrival?.iata_code || ""]

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
	const flightDate = typeof flight === 'string' ? flight : flight.arrival?.scheduled_time
	const date = flightDate && new Date(flightDate)

	if (!date || typeof date === 'string') {
		console.warn("Missing scheduled date", typeof date)
		return false
	}
	return new Date().getFullYear() - date.getFullYear() > 3 ? new Date(date.getFullYear() + 1, 0) : false
}
export const getDelay = (flightPhase?: FlightPhase, limit?: number) => {
	if (!flightPhase) return 0
	const scheduledDate = flightPhase.scheduled_time && new Date(flightPhase.scheduled_time)
	const actualDate = flightPhase.actual_time && new Date(flightPhase.actual_time)

	if (!scheduledDate || !actualDate) {
		console.warn("Missing scheduled or actual date")
	}

	const difference = scheduledDate && actualDate && (actualDate.getTime() - scheduledDate.getTime()) / 1000 / 60 || 0

	if (!limit) return difference
	return difference > limit ? difference : 0
}

export const isExtraordinaryCircumstance = (flight: Flight | null) => {
	if (!flight) return circumstance

	const { departureAirport, arrivalAirport } = getAirports(flight)

	const departureDate = flight.departure?.scheduled_time && new Date(flight.departure.scheduled_time)
	const arrivalDate = flight.arrival?.scheduled_time && new Date(flight.arrival.scheduled_time)

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

const getEU = (flight: Flight | null) => {
	if (!flight) return {
		departure: false,
		arrival: false,
		airline: false,
	}
	const { departureAirport, arrivalAirport } = getAirports(flight)

	const airlineObject = useAirlines(flight.airline.iata_code)

	const departure = euMember(departureAirport?.country || "")
	const arrival = euMember(arrivalAirport?.country || "")
	const airline = euMember(airlineObject?.country || "")

	return {
		departure,
		arrival,
		airline,
	}
}


export const useFlightStatus = (flight: Flight | null) => {
	const nuxtApp = useNuxtApp();
	isExtraordinaryCircumstance(flight)

	return {
		barred: {
			value: isBarred(flight),
			label: isBarred(flight) ? "Verjährt" : "Nicht verjährt",
		},
		cancelled: {
			value: flight?.status === "cancelled",
			label: flight?.status === "cancelled" ? "Annulliert" : "Nicht annulliert",
		},
		delayed: {
			value: getDelay(flight?.arrival, 180),
			label: getDelay(flight?.arrival, 180) ? `Verspätet (${getDelay(flight?.arrival, 180)} min)` : "Nicht verspätet",
		},
		distance: {
			value: getDistance(flight),
			label: getDistance(flight) ? nuxtApp.$i18n.n(getDistance(flight), 'km') : "Keine Distanz",
		},
		europeanUnion: {
			value: getEU(flight),
			label: Object.values(getEU(flight)).some(e => e) ? getEU(flight) : "Nicht EU",
		},
		extraordinaryCirumstance: {
			value: !!Object.values(circumstance).length,
			label: circumstance,
		}
	}
}