import { Airport } from "types";

export const getAirportDistance = (departureAirport: Airport, arrivalAirport: Airport) => {
	if (!departureAirport || !arrivalAirport) return 0;
	const {lat: lat1, lon: lon1} = departureAirport;
	const {lat: lat2, lon: lon2} = arrivalAirport;
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


const getAirportsRaw = async () => {
	const countries = await import("i18n-iso-countries");
	fetch(
		"https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/mwgg/Airports/master/airports.json"
	)
		.then((response) => response.json())
		.then((data: Record<string, Airport>) => {
			const raw = Object.values(data).reduce(
				(acc: Airport[], { name, iata, city, country, lat, lon }: Airport) => {
					return iata
						? [
							...acc,
							{
								full: `${name} (${iata})`,
								name,
								iata,
								city,
								lat,
								lon,
								country,
								countryName: {
									'de': countries.getName(country, 'de'),
									'en': countries.getName(country, 'en'),
								}
							},
						]
						: acc;
				},
				[]
			);
			console.log(raw);
		});
};