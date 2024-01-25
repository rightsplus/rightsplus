import { Airline, AirlineAviationEdge, Airport, ClaimsForm, Flight, FlightPhase, Route } from "types";
import weatherCodes from "~~/assets/weather-codes.json";
import { countries } from "@/config/countries";
import { DropdownItem } from "~~/components/molecules/Dropdown.vue";
import { UseSearchReturnType } from "@nuxtjs/algolia/dist/runtime/composables/useAlgoliaSearch";
import { AlgoliaIndices } from "@nuxtjs/algolia/dist/module";
import { State, airlines, airports } from "~~/store";
import { euMember } from "is-european";
import Compressor from "compressorjs";

export const getAirlineLogo = (iata?: string, size = 100) => {
	if (!iata) return;
	let code = iata
	switch (iata) {
		case 'GEC': code = 'LH'
		case 'D0': code = 'LH'
	}
	return `https://content.r9cdn.net/rimg/provider-logos/airlines/v/${code}.png?crop=false&width=${size}&height=${size}`;
	// return `https://serkowebtest.blob.core.windows.net/airline-logos/${code}_1x.png`
}
export const getAirportDistance = (departureAirport?: Airport, arrivalAirport?: Airport) => {
	if (!departureAirport || !arrivalAirport) return 0;
	const { latitude: lat1, longitude: lon1 } = departureAirport;
	const { latitude: lat2, longitude: lon2 } = arrivalAirport;
	const R = 6371; // radius of the earth in km
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c;
	return Math.round(d);
}

export interface WeatherResponse<N = number[], S = string[]> {
	time: S;
	temperature_2m: N;
	relativehumidity_2m: N;
	dewpoint_2m: N;
	apparent_temperature: N;
	pressure_msl: N;
	precipitation: N;
	windgusts_10m: N;
	weathercode: N;
	vapor_pressure_deficit: N;
	snowfall: N;
	cloudcover: N;
	surface_pressure: N;
	windspeed_100m: N;
}
export const getHumanReadableWeather = async (flight: FlightPhase) => {
	await new Promise(resolve => setTimeout(resolve, 1000))
	const airports = useAirports()
	const weather = await getWeather(airports[flight.iata], flight.scheduled)
	const getByHour = (weather: Partial<WeatherResponse> | null, time: string, pick = ['temperature_2m', 'weathercode', 'windspeed_100m']): Partial<WeatherResponse<number, string>> => {
		if (!weather) return {}
		return Object.fromEntries(
			Object.entries(weather)
				.filter(([key]) => pick ? pick.includes(key) : true)
				.map(([key, value]) => [key, value[new Date(time).getHours()]])
		)
	}
	return getByHour(weather, flight.scheduled)
}

export const getWeather = async (airport: Airport, date: Date | string): Promise<WeatherResponse | null> => {
	const { latitude, longitude } = airport || {};
	if (!latitude || !longitude) return null;
	const d = new Date(date).toISOString().slice(0, 10);
	const params = [
		"temperature_2m",
		"windgusts_10m",
		"precipitation",
		"snowfall",
		"cloudcover",
		"weathercode",
		"surface_pressure",
		"windspeed_100m",
		"pressure_msl",
		"vapor_pressure_deficit",
		"apparent_temperature"
	];
	try {
		const data = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${d}&end_date=${d}&hourly=${params.join(',')}`).then((res) => res.json()).then(({ hourly, error, reason }) => {
			if (error) throw new Error(reason)
			return hourly
		});
		return data
	} catch (e) {
		console.log(e)
		return null
	}
}
export const isUnsafeToTakeoffOrLand = (response: WeatherResponse | null, hour: number): string | boolean => {
	if (!response) return false;
	const {
		time,
		temperature_2m,
		windgusts_10m,
		precipitation,
		snowfall,
		cloudcover,
		weathercode,
		surface_pressure,
		windspeed_100m,
		pressure_msl,
		vapor_pressure_deficit,
	} = response;

	const reasons: { message: string, weight: number, excess: number }[] = [];

	if (temperature_2m?.[hour] > 49) {
		const excess = (temperature_2m?.[hour] - 49) / 49;
		reasons.push({ message: `Temperature too high: ${temperature_2m?.[hour]}°C (limit: 49°C)`, weight: 10, excess });
	}

	if (windgusts_10m?.[hour] > 30) {
		const excess = (windgusts_10m?.[hour] - 30) / 30;
		reasons.push({ message: `Wind gusts too strong: ${windgusts_10m?.[hour]}m/s (limit: 30m/s)`, weight: 8, excess });
	}

	if (windspeed_100m?.[hour] > 50) {
		const excess = (windspeed_100m?.[hour] - 50) / 50;
		reasons.push({ message: `Wind speed too high: ${windspeed_100m?.[hour]}m/s (limit: 50m/s)`, weight: 8, excess });
	}

	if (precipitation?.[hour] > 10) {
		const excess = (precipitation?.[hour] - 10) / 10;
		reasons.push({ message: `Precipitation too heavy: ${precipitation?.[hour]}mm (limit: 10mm)`, weight: 6, excess });
	}

	if (snowfall?.[hour] > 0) {
		reasons.push({ message: `Snowfall present: ${snowfall?.[hour]}cm`, weight: 4, excess: 1 });
	}

	if (cloudcover?.[hour] > 90) {
		const excess = (cloudcover?.[hour] - 90) / 90;
		reasons.push({ message: `Cloud cover too high: ${cloudcover?.[hour]}% (limit: 90%)`, weight: 3, excess });
	}

	if (weathercode?.[hour] === 3) {
		reasons.push({ message: `Thunderstorm present`, weight: 10, excess: 1 });
	}

	if (surface_pressure?.[hour] < 970) {
		const excess = (970 - surface_pressure?.[hour]) / 970;
		reasons.push({ message: `Surface pressure too low: ${surface_pressure?.[hour]}hPa (limit: 970hPa)`, weight: 5, excess });
	}
	if (pressure_msl?.[hour] < 970) {
		const excess = (970 - pressure_msl?.[hour]) / 970;
		reasons.push({ message: `Mean sea level pressure too low: ${pressure_msl?.[hour]}hPa (limit: 970hPa)`, weight: 5, excess });
	}

	if (vapor_pressure_deficit?.[hour] < 0.4) {
		const excess = (0.4 - vapor_pressure_deficit?.[hour]) / 0.4;
		reasons.push({ message: `Vapor pressure deficit too low: ${vapor_pressure_deficit?.[hour]}kPa (limit: 0.4kPa)`, weight: 3, excess });
	}

	const totalWeight = reasons.reduce((sum, reason) => sum + reason.weight, 0);

	if (totalWeight >= 30 || reasons.some(e => e.excess > 0.1)) {
		const date = new Date(time?.[hour]).toLocaleTimeString('de', { hour: '2-digit', minute: '2-digit' });
		const code = weatherCodes.unsafe.includes(weathercode?.[hour]) ? weatherCodes.messages[weathercode?.[hour]] : null;

		return `Unsafe at ${date}. ${code ?? ""}. Reasons: ${reasons.map(e => e.message).join(", ")}.`;
	}
	return false;
};


export const reduceAirports = (airport: State['airport'], fetch?: string[]) => {
	const all = ([
		airport?.departure,
		...(airport?.layover || []),
		airport?.arrival,
	]).filter(e => e && 'iata' in e) as Airport[];

	return all.reduce((acc: Record<string, Airport>, cur) => {
		if (cur) acc[cur.iata] = cur;
		return acc;
	}, {});
}


export const generateRoutes = (airport: ClaimsForm['airport']['trip']) => {
	const airports = reduceAirports(airport);
	const routes = {} as Record<string, Route>;
	Object.values(airports).forEach((airport, i, arr) => {
		if (i === arr.length - 1) return;
		routes[`${airport.iata}-${arr[i + 1].iata}`] = ({
			flight_date: "",
			departure: {
				airport,
			},
			arrival: {
				airport: arr[i + 1],
			},
			flight: undefined
		})
	})
	return routes;
}

const commission = 0.22;
const vatRate = 0.19;
export const reimbursementByDistance = (distance: number, delay = 180, passengers = 1) => {
	let total = 250
	if ((distance || 0) > 1500) total = 400
	if ((distance || 0) > 3500) total = 600
	if ((distance || 0) > 3500 && delay > 180 && delay < 240) total = 300
	total = total * (passengers || 1)
	const weGet = total * commission
	const vat = total * commission * vatRate
	const youGet = total * (1 - commission) - vat
	return {
		total,
		weGet,
		vat,
		youGet,
		vatRate,
		commission
	}
}

export const keyIncrement = (e: KeyboardEvent, value: number, length: number) => {
	let v = value
	if (e?.key === "ArrowDown") {
		v = v + 1;
		if (v > length - 1)
			v = 0;
	} (getCurrentInstance()?.refs.input as HTMLInputElement)?.focus()
	if (e?.key === "ArrowUp") {
		v = v - 1;
		if (v < 0)
			v = length - 1;
	}
	return v
}

export const focusNext = (select = false, active = document.activeElement as HTMLInputElement) => {

	if (!active) return;

	// Get all the input elements in the document
	const inputElements = document.querySelectorAll("input, select, textarea, button, [tabindex]");

	// Find the index of the currently focused input element
	const currentIndex = Array.from(inputElements).findIndex(
		(el) => el === active
	);

	// Find the next input element
	let nextElement = inputElements[currentIndex + 1] as HTMLInputElement;
	while (nextElement && nextElement.disabled) {
		nextElement = inputElements[currentIndex + 2] as HTMLInputElement;
	}

	// Focus on the next input element
	if (nextElement) {
		nextElement.focus();
		if (select && typeof nextElement.select === 'function') nextElement.select();
	} else {
		active.blur()
	}
}

export const getISODate = (value: Date | string) => {
	try {
		value = new Date(value)
		const offset = value.getTimezoneOffset()
		const date = new Date(value.getTime() - (offset * 60 * 1000))
		return date.toISOString().split('T')[0]
	} catch (e) {
		return ""
	}
}
export const get24HTime = (value: Date | string) => {
	try {
		value = new Date(value)
		return String(value.getHours()).padStart(2, '0') + String(value.getMinutes()).padStart(2, '0')
	} catch (e) {
		return ""
	}
}

export const getDuration = (minutes: number) => {
	const min = `${minutes % 60} min`;
	const h = `${Math.floor(minutes / 60)} h`;
	return minutes >= 60 ? `${h} ${min}` : min;
}

export const queryAirports = async (algolia: UseSearchReturnType<Airport>, query?: string) => {
	const { hits } = await algolia.search({ query })
	hits.forEach((hit) => {
		const a = { ...hit };
		delete a._highlightResult, a.objectID;
		airports.value[hit.iata] = a;
	});
	return hits
}
export const queryAirlines = async (query?: string) => {
	if (!query) return;
	const hits = await fetch("api/airlines-aviation-edge.json")
		.then((data) => data.json())
		.then((data: AirlineAviationEdge[]) => data.reduce((acc, cur) => {
			const airline = {
				// ...cur,
				name: cur.nameAirline,
				nameCountry: cur.nameCountry,
				country: cur.codeIso2Country,
				iata: cur.codeIataAirline,
				isEuMember: euMember(cur.codeIso2Country),
			};
			acc[cur.codeIataAirline] = airline
			airlines.value[cur.codeIataAirline] = airline
			return acc;
		}, {} as Record<string, Airline>));
	return hits
}

export const getCityTranslation = (airport: Airport, locale = 'de', highlight = false) => {
	if (!airport) return;
	if (highlight) {
		return airport._highlightResult?.city_translations?.[locale]?.value || airport._highlightResult?.city.value
	}
	return airport.city_translations?.[locale] || airport.city
}


export const compressImage = async (file: File, options?: Compressor.Options) => {
	return new Promise((resolve: Compressor.Options['success'], reject: Compressor.Options['error']) => new Compressor(file, {
		mimeType: 'image/webp',
		...options,
		success: resolve,
		error: reject,
	}))
}

export const handleFormKitIconClick = (e: MouseEvent) => {
	const input = (e.target as Element).closest('.formkit-inner')?.querySelector('input')
	input?.click()
}