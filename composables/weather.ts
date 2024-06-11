import type { Airport, Flight, FlightPhase } from "~/types";
import weatherCodes from "~~/assets/weather-codes.json";

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


const getByHour = (weather: Partial<WeatherResponse> | null, time: string, pick = ['temperature_2m', 'weathercode', 'windspeed_100m']): Partial<WeatherResponse<number, string>> => {
	if (!weather) return {}
	return Object.fromEntries(
		Object.entries(weather)
			.filter(([key]) => pick ? pick.includes(key) : true)
			.map(([key, value]) => [key, value[new Date(time).getHours()]])
	)
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
		// console.log(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${d}&end_date=${d}&hourly=${params.join(',')}`)
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



export const useWeather = (flight: Ref<Flight>) => {
	const { query: queryAirports } = useAirports()
	const weather = ref<{
		departure: Partial<WeatherResponse<number, string>>;
		arrival: Partial<WeatherResponse<number, string>>
	}>({
		departure: {},
		arrival: {}
	})
	const fetch = async (e: Flight) => {
		const { departure, arrival } = e
		if (!departure?.iata || !arrival?.iata) return console.log('no iata')
		const { [departure.iata]: dep, [arrival.iata]: arr } = await queryAirports([departure.iata, arrival.iata])
		weather.value = {
			departure: {},
			arrival: {},
		}
		// console.log('fetching', departure.iata, arrival.iata, dep, arr)
		// getWeather(dep, departure.scheduledTime).then(console.log)
		const [weatherDeparture, weatherArrival] = await Promise.all([getWeather(dep, departure.scheduledTime), getWeather(arr, arrival.scheduledTime)])
		weather.value = {
			departure: getByHour(weatherDeparture, departure.scheduledTime),
			arrival: getByHour(weatherArrival, arrival.scheduledTime),
		}
	}
	watch(flight, fetch, { immediate: true, deep: true })
	return { weather }
}
