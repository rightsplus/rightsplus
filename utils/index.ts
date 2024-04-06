import type { Airline, Airport, ClaimsForm, FlightPhase, Route } from "@/types";
import weatherCodes from "~~/assets/weather-codes.json";
import { UseSearchReturnType } from "@nuxtjs/algolia/dist/runtime/composables/useAlgoliaSearch";
import { airlines, airports, claim } from "~~/store";
import type { State } from "~~/store";
import Compressor from "compressorjs";
import { uuid as vueUuid } from "vue-uuid";

export const uuid = () => vueUuid.v4()

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
	const { airports } = useAirports()
	const weather = await getWeather(airports.value[flight.iata], flight.scheduled)
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

export const nextDeparture = (claim: ClaimsForm) => {
	const routes = Object.keys(generateRoutes?.(claim.airport.trip))
	const currentRoute = routes.findIndex(e => e === claim.route)
	const nextRoute = routes[currentRoute + 1]
	if (nextRoute) return claim.airport.trip.layover?.find(e => e.iata === nextRoute.split('-')[0])
	return claim.airport.arrival

}

const commission = 0.25;
const vatRate = 0; // 0.19
export const reimbursementByDistance = (distance: number, delay = 180, withinEU = false, passengers = 1) => {
	let total = 250
	if ((distance || 0) > 1500) total = 400
	const beyondEU = !withinEU && [claim?.airport?.departure, claim?.airport?.arrival].some(e => !e?.ec261)
	if ((distance || 0) > 3500 && beyondEU) total = 600
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

export const focusNext = ({ select, activeElement, scope }: { select?: boolean, activeElement?: HTMLInputElement, scope?: HTMLElement }) => {
	const active = activeElement || document.activeElement as HTMLElement;
	if (!active) return;

	const container = scope || active.closest('form') || document;

	// Get all the input elements in the document
	const inputElements = container.querySelectorAll("input, select, textarea, button, [tabindex]");

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
		if (select && typeof nextElement.select === 'function') {
			nextElement.select();
		} else {
			active.blur()
		}
	} else {
		active.blur()
	}
}

export const focusFirst = ({ select, empty, scope, type }: { select?: boolean; empty?: boolean; scope?: HTMLElement; type?: string[]; }) => {
	setTimeout(() => {
		const container = scope || document;

		// Get all the input elements in the document
		const inputElements = container.querySelectorAll((type || ["input", "select", "textarea", "button", "[tabindex]"]).join(', '));

		const currentIndex = 0
		const active = inputElements[currentIndex] as HTMLInputElement


		// Find the next input element
		let nextElement = inputElements[currentIndex] as HTMLInputElement;
		let count = 0
		while (count <= inputElements.length && nextElement && inputElements[currentIndex + 1] && (nextElement.disabled || empty && nextElement.value)) {
			nextElement = inputElements[currentIndex + 1] as HTMLInputElement;
			count++
		}
		// Focus on the next input element
		if (nextElement) {
			nextElement.focus();
			if (select && typeof nextElement.select === 'function') {
				nextElement.select();
			} else {
				active?.blur()
			}
		} else {
			active?.blur()
		}
	})
}

export const getISODate = (value?: Date | string) => {
	try {
		value = value ? new Date(value) : new Date()
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
	hits.forEach((hit: Airport) => {
		const a = { ...hit };
		delete a._highlightResult, a.objectID;
		airports.value[hit.iata] = a;
	});
	return hits
}
export const queryAirlines = async (query?: string) => {
	const hits = await fetch("/api/airlines.json")
	const data = await hits.json()
	airlines.value = data as Record<string, Airline>
	return query ? data[query] : data
	// console.log(data.filter(e => e.status === 'active' && e.iata_code).reduce((acc, cur) => {
	// 	const airline = {
	// 		id: cur.id,
	// 		iata: cur.iata_code,
	// 		name: cur.airline_name,
	// 		country: cur.country_iso2,
	// 		isEuMember: euMember(cur.country_iso2),
	// 		callsign: cur.callsign,
	// 		hubCode: cur.hub_code,
	// 		dateFounded: cur.date_founded,
	// 		iataPrefixAccounting: cur.iata_prefix_accounting,
	// 		fleetSize: cur.fleet_size,
	// 		type: cur.type?.split(', ') || [],
	// 	};
	// 	acc[cur.iata_code] = airline
	// 	return acc;
	// }, {} as Record<string, Airline>))
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

export const formatClaimId = (id: number | string, prependHash = true) => {
	if (!id) return ""
	const base = 10 // 10
	const length = 7
	const paddedId = id.toString(base).toUpperCase().padStart(length, '0')
	if (prependHash) return '#' + paddedId
	return paddedId
	// const decoded = parseInt(encoded.slice(1), base)
}

export function cropSignatureCanvasSVG(svgString: string, toBase64 = false, p = 5,) {
	const tempContainer = document.createElement('div');
	tempContainer.innerHTML = svgString;
	const svgElement = tempContainer.firstChild! as SVGGraphicsElement;
	document.body.appendChild(svgElement);
	const { x, y, width, height } = svgElement.getBBox();
	svgElement.setAttribute('viewBox', [x - p, y - p, width + p * 2, height + p * 2].join(' '));
	const modifiedSvgString = new XMLSerializer().serializeToString(svgElement);
	document.body.removeChild(svgElement);
	if (toBase64) {
		return 'data:image/svg+xml;base64,' + btoa(modifiedSvgString);
	}
	return modifiedSvgString;
}

/**
 * Crop signature canvas to only contain the signature and no whitespace.
 *
 * @since 1.0.0
 */
export const cropSignatureCanvas = (canvas: HTMLCanvasElement) => {

	// First duplicate the canvas to not alter the original
	const croppedCanvas = document.createElement('canvas'),
		croppedCtx = croppedCanvas.getContext('2d');

	if (!croppedCtx) return
	croppedCanvas.width = canvas.width;
	croppedCanvas.height = canvas.height;
	croppedCtx.drawImage(canvas, 0, 0);

	// Next do the actual cropping
	let w = croppedCanvas.width,
		h = croppedCanvas.height,
		x: number,
		y: number,
		index: number;

	const pix = { x: [] as number[], y: [] as number[] },
		imageData = croppedCtx.getImageData(0, 0, croppedCanvas.width, croppedCanvas.height);

	if (!imageData) return

	for (y = 0; y < h; y++) {
		for (x = 0; x < w; x++) {
			index = (y * w + x) * 4;
			if (imageData.data[index + 3] > 0) {
				pix.x.push(x);
				pix.y.push(y);

			}
		}
	}
	pix.x.sort(function (a, b) { return a - b });
	pix.y.sort(function (a, b) { return a - b });
	var n = pix.x.length - 1;

	w = pix.x[n] - pix.x[0];
	h = pix.y[n] - pix.y[0];
	var cut = croppedCtx.getImageData(pix.x[0], pix.y[0], w, h);

	croppedCanvas.width = w;
	croppedCanvas.height = h;
	croppedCtx.putImageData(cut, 0, 0);

	return croppedCanvas;
}


export const ucfirst = (value: string) => {
	return value?.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
};


export const isReplacementFlightWithinBounds = (claim: ClaimsForm) => {
	if (!claim.flight) return false;
	const replacementFlight = claim.replacement.flight
	if (!replacementFlight || replacementFlight.flight.iata?.toUpperCase() === claim.flight.flight.iata)
		return false;
	// 0-7 Tage: max 1h vor planm. Abflug gestartet + max 2h nach planm. Ankunft gelandet
	// 8-14 Tage: max 2h vor planm. Abflug gestartet + max 4h nach planm. Ankunft gelandet
	const { details } = claim.disruption;
	const { departure, arrival } = claim.flight;
	const arrivalBuffer = "<8" === details ? 3600000 : 7200000;
	const departureBuffer = "<8" === details ? 7200000 : 14400000;


	return (
		!!details &&
		["<8", "8-14"].includes(details) &&
		new Date(replacementFlight.departure.actualTime || replacementFlight.departure.scheduledTime).getTime() -
		new Date(departure.scheduledTime).getTime() <=
		arrivalBuffer &&
		new Date(arrival.scheduledTime).getTime() -
		new Date(replacementFlight.arrival.actualTime || replacementFlight.arrival.scheduledTime).getTime() <=
		departureBuffer
	);
};


export const convertAssignmentAgreementData = (claim: ClaimsForm) => {
	const [passenger] = claim.client.passengers;
	return {
		name: [passenger.firstName, passenger.lastName].join(" "),
		firstName: passenger.firstName,
		address: passenger.address.street,
		postalCode: passenger.address.postalCode,
		city: passenger.address.city,
		flightNumber: claim.flight?.flight.iata,
		flightDate: getISODate(claim.flight?.[claim.flight?.type].scheduledTime),
		departure: claim.flight?.departure.iata,
		arrival: claim.flight?.arrival.iata,
		date: new Date().toISOString(),
	};

}

export const generatePDFTemplateLink = (template: string, data?: Record<string, string | undefined>) => {
	console.log(process?.env)
	const base = process.env.NODE_ENV === 'production' ? 'https://rightsplus.up.railway.app' : 'http://localhost:3000'
	const url = new URL(`${base}/pdf/${template}`)
	Object.entries(data || {}).forEach(([key, value]) => {
		if (value) url.searchParams.append(key, value.toString());
	});
	return url
}


export const validateEmail = (email: string) => {
	const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
	return emailRegex.test(email);
}
