export interface ReimbursementForm {
  airport: {
    departure: Airport | null,
    arrival: Airport | null,
    layover: Airport[] | false | null,
  },
  date: {
    departure: string,
  },
  selectedFlight: Flight | null,
  reason: string | null,
  actualArrivalTime: string | null,
},
export interface Airport {
  full: string;
  iata: string;
  name: string;
  city: string;
  state?: string;
  icao?: string;
  country?: string;
  elevation?: number;
  lat?: number;
  lon?: number;
  tz?: string;
}

interface FlightAirport {
  airport: string;
  timezone: string;
  iata: string;
  icao: string;
  terminal: string | number;
  gate: string;
  delay: number;
  scheduled: string;
  estimated: string;
  actual: string;
  estimated_runway: string;
  actual_runway: string;
}
export interface Flight {
  flight_date: string;
  flight_status: string;
  departure: FlightAirport;
  arrival: FlightAirport;
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
    codeshared: string | null;
  };
  aircraft: {
    registration: string;
    iata: string;
    icao: string;
    icao24: string;
  };
  live: {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
  };
}
