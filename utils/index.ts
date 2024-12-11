import type { Airline, Airport, ClaimsForm, Leg, RowAirline } from "@/types";

import { UseSearchReturnType } from "@nuxtjs/algolia/dist/runtime/composables/useAlgoliaSearch";
import { airlines, airports, claim } from "~~/store";
import type { State } from "~~/store";
import Compressor from "compressorjs";
import { uuid as vueUuid } from "vue-uuid";
import IBAN from "iban";

export const uuid = () => vueUuid.v4()

export const getAirlineLogo = (iata?: string, size = 100) => {
	if (!iata) return;
	let code = iata;
	// switch (iata) {
	// 	case 'GEC': code = 'LH'
	// 	case 'D0': code = 'LH'
	// }
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

export const reduceAirports = (airport: ClaimsForm['airport']['trip'], fetch?: string[]) => {
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


export const generateLegs = (airport: ClaimsForm['airport']['trip']) => {
	const airports = reduceAirports(airport);
	const legs = {} as Record<string, Leg>;
	Object.values(airports).forEach((airport, i, arr) => {
		if (i === arr.length - 1) return;
		legs[`${airport.iata}-${arr[i + 1].iata}`] = ({
			date: "",
			departure: {
				airport,
			},
			arrival: {
				airport: arr[i + 1],
			},
			flight: undefined
		})
	})
	return legs;
}

export const nextLeg = (claim: ClaimsForm) => {
	const legs = Object.keys(generateLegs?.(claim.airport.trip))
	const currentLeg = legs.findIndex(e => e === claim.leg)
	const nextLeg = legs[currentLeg + 1]
	if (nextLeg) {
		const [dep, arr] = nextLeg.split('-')
		const departure = [...(claim.airport.trip.layover || []), claim.airport.arrival]?.find(e => e.iata === dep)
		const arrival = [...(claim.airport.trip.layover || []), claim.airport.arrival]?.find(e => e.iata === arr)

		return {
			departure, arrival
		}
	}
	return { departure: undefined, arrival: undefined }

}

const commission = 0.25;
const vatRate = 0; // 0.19
export const compensationByDistance = ({ distance, delay, withinEU, passengers }: { distance?: number; delay?: number; withinEU?: boolean; passengers?: number; claim?: ClaimsForm }) => {
	let total = 250
	if ((distance || 0) > 1500) total = 400
	const beyondEU = !claim || [claim?.airport?.departure, claim?.airport?.arrival].some(e => !e?.ec261)
	if ((distance || 0) > 3500 && ((beyondEU && !withinEU) || withinEU === false)) total = 600
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

export const calculateCO2e = (distanceKm: number): number => {
	// Constants
	const fuelConsumptionPerKmPerPassenger = 0.03; // liters per km per passenger
	const CO2EmissionFactor = 2.54; // kg CO2 per liter of jet fuel
	const radiativeForcingIndex = 2.7;

	// Calculate CO2 emissions per km per passenger
	const CO2PerKmPerPassenger = fuelConsumptionPerKmPerPassenger * CO2EmissionFactor;

	// Incorporate Radiative Forcing Index (RFI)
	const CO2ePerKmPerPassenger = CO2PerKmPerPassenger * radiativeForcingIndex;

	// Calculate total CO2e for the given distance
	const totalCO2e = CO2ePerKmPerPassenger * distanceKm;

	return totalCO2e;
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
	let counter = 0
	while (nextElement && nextElement.disabled && counter <= inputElements.length) {
		nextElement = inputElements[currentIndex + 2] as HTMLInputElement;
		counter++
	}

	// Focus on the next input element
	if (nextElement) {
		nextElement.focus();
		// console.log(nextElement)
		// return 
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
export const getLocaleDateFormatMask = (locale: string) => {
	const date = new Date(2020, 10, 10); // Use a fixed date to ensure consistency
	const options = { year: 'numeric', month: 'numeric', day: 'numeric' } as const;
	const format = date.toLocaleDateString(locale, options);

	const yearPart = date.toLocaleDateString(locale, { year: 'numeric' }).replace(/\d/g, 'Y');
	const monthPart = date.toLocaleDateString(locale, { month: 'numeric' }).replace(/\d/g, 'M');
	const dayPart = date.toLocaleDateString(locale, { day: 'numeric' }).replace(/\d/g, 'D');

	return format
		.replace(/\d{4}/, yearPart)
		.replace(/\d{1,2}/, monthPart)
		.replace(/\d{1,2}/, dayPart);
}
export const parseLocaleDateString = (dateString: string, locale: string) => {
	const dateParts = new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	}).formatToParts(new Date(2020, 10, 10));

	const partTypes = dateParts.map(part => part.type).filter(type => type !== 'literal');
	const regex = new RegExp(dateParts.map(part => (part.type === 'literal' ? `\\${part.value}?` : '(\\d+)?')).join(''));
	const match = dateString.match(regex);
	console.log('+++')
	console.log(regex, dateString, match)
	console.log('+++')
	const dateObject: Partial<{
		year: number;
		month: number;
		day: number;
	}> = {}
	partTypes.forEach((type, index) => {
		if (!match || !match[index + 1]) return
		console.log(type, Number(match[index + 1]))
		dateObject[type as keyof typeof dateObject] = Number(match[index + 1]);
	});
	console.log(dateString, match, dateObject)
	return new Date(dateObject.year, dateObject.month, dateObject.day);
}

export const getLocalizedTime = (time: string | Date = new Date(), locale = 'de') => {
	return new Date(time).toLocaleTimeString(locale, {
		hour: "2-digit",
		minute: "2-digit",
	});
};

export function getLocalizedDate(date: string | Date = new Date(), locale = 'de', format: 'long' | 'short' = 'long',) {
	const size = {
		long: {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		},
		short: {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		},
	} as const
	return new Date(date).toLocaleDateString(
		locale,
		size[format]
	)
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
	return hits as Airport[]
}
export const queryAirlines = async (query?: string) => {
	const hits = await fetch("/api/airlines.json")
	airlines.value = await hits.json() as Record<string, RowAirline>
	return query ? airlines.value[query] : airlines.value
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

// Array(999).fill(0).map((e, i) => {
// 	return '#' + (Math.round(new Date().getTime() / (24 * 60 * 60 * 1000))).toString(36).toUpperCase().padStart(3, '0') + (i + 999).toString(36).toUpperCase().padStart(3, '0')
// })
export const formatClaimId = (id: number | string, prependHash = true) => {
	if (!id) return ""
	const base = 36 // 10
	const length = 7
	const paddedId = (id).toString(base).toUpperCase().padStart(length, '0')
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
export const reachedConnectionFlight = (claim: ClaimsForm) => {
	if (!claim.flight) return false;
	const connectionFlight = claim.connection.flight
	if (!connectionFlight || connectionFlight.flight.iata?.toUpperCase() === claim.flight.flight.iata)
		return false;
	const { details } = claim.disruption;
	const { actualTime, estimatedTime } = claim.flight.arrival
	// 30 min
	const layoverBuffer = 1800000

	return (
		!!details &&
		["<3"].includes(details) &&
		(new Date(actualTime || estimatedTime).getTime() + layoverBuffer) < new Date(connectionFlight.departure.scheduledTime).getTime()
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



const enOrdinalRules = (locale: string) => new Intl.PluralRules(locale, { type: 'ordinal' });

const suffixes = (locale: string) => {
	const map = {
		en: new Map([
			['one', 'st'],
			['two', 'nd'],
			['few', 'rd'],
			['other', 'th'],
		])
	}[locale.split(/[-_]/g)[0]];
	if (!map) return new Map([
		['one', '.'],
		['two', '.'],
		['few', '.'],
		['other', '.'],

	])
	return map;
}
export const formatOrdinals = (n: number, locale = 'de') => {
	const rule = enOrdinalRules(locale).select(n);
	const suffix = suffixes(locale).get(rule);
	return `${n}${suffix}`;
};



export const closest = (number: number, array: number[]) => array?.reduce((prev, curr) => (Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev));


export const formatFileSize = (sizeInBytes: number, decimalPoint = 2) => {
	const KB = 1024;
	const MB = KB * 1024;
	const GB = MB * 1024;

	if (sizeInBytes < KB) {
		return sizeInBytes + ' B';
	} else if (sizeInBytes < MB) {
		return (sizeInBytes / KB).toFixed(decimalPoint) + ' KB';
	} else if (sizeInBytes < GB) {
		return (sizeInBytes / MB).toFixed(decimalPoint) + ' MB';
	} else {
		return (sizeInBytes / GB).toFixed(decimalPoint) + ' GB';
	}
}

export const getExtendedClaimQuery = () => "*, booking ( flight ( *, airline ( * ) ), disruption, number )"



const maskString = (str: string, numeric = "#", alpha = "@") => {
	return str.replace(/[a-zA-Z0-9]/g, (match, offset) =>
		/[0-9]/.test(match) ? numeric : alpha
	);
};
export const getIbanMask = (str: string, country = "DE") => {

	const countryInString =
		str?.slice(0, 2) in IBAN.countries && str.slice(0, 2).toUpperCase();
	const countryCode = countryInString || country;
	const { example } = IBAN.countries[countryCode];
	return {
		mask: maskString(IBAN.printFormat(example)),
		humanMask: maskString(IBAN.printFormat(example), "0", "A").replace(
			/^.{2}/g,
			countryCode
		),
		example: IBAN.printFormat(example),
		length: example.length,
		countryInString,
	};
};


import i18nConfig from '@/config/i18n'

export const getRouteNameFromPath = (path: string, pages = i18nConfig.pages) => {
	// Remove leading slash and split to get locale and route parts
	const cleanPath = path.replace(/^\//, '')
	const pathParts = cleanPath.split('/')

	// Handle both /de/impressum and impressum formats
	const routePath = pathParts.length > 1 ? `/${pathParts[1]}` : `/${pathParts[0]}`

	// if (routePath)

	// Find matching route name by checking all locales for each page
	const [match] = Object.entries(pages).find(([_, translations]) =>
		Object.entries(translations).some(([locale, path]) => path === routePath || locale === routePath.replace(/^\//, ''))
	) || []

	return match || ''
}
export const getRoutePathFromName = (name: keyof typeof i18nConfig.pages, locale: (typeof i18nConfig.locales)[number]['code'], pages = i18nConfig.pages) => {
	return pages[name][locale]
}


import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}










// Helper function to recursively append nested properties
export const appendNested = (formData: FormData, obj: any, parentKey = "") => {
	for (const [key, value] of Object.entries(obj)) {
		const formKey = parentKey ? `${parentKey}[${key}]` : key;

		if (value instanceof Blob) {
			// Append blobs directly
			formData.append(formKey, value);
		} else if (Array.isArray(value)) {
			// Append array elements
			value.forEach((val, index) => appendNested(formData, val, `${formKey}[${index}]`));
		} else if (value !== null && typeof value === "object") {
			// Recursively flatten nested objects
			appendNested(formData, value, formKey);
		} else {
			// Append primitive values
			formData.append(formKey, value as string);
		}
	}
};



export function base64ToFile(base64String: string, fileName: string) {
	// Split the Base64 string into data and the MIME type
	const [header, data] = base64String.split(',');
	const [, mimeType] = header.match(/:(.*?);/) || []; // Extract MIME type from the header

	// Decode the Base64 data
	const binaryData = atob(data);

	// Create an array to hold the binary data
	const byteArray = new Uint8Array(binaryData.length);

	// Convert the binary data into a byte array
	for (let i = 0; i < binaryData.length; i++) {
		byteArray[i] = binaryData.charCodeAt(i);
	}

	// Create a Blob from the byte array and MIME type
	const file = new Blob([byteArray], { type: mimeType });

	// Create a File object (optional)
	const finalFile = new File([file], fileName, { type: mimeType });

	// Return the file object
	return finalFile;
}