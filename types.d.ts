/* Claims Form State */
export type Address = {
  street: string;
  postalCode: string;
  city: string;
  country?: string;
};
export interface PassengerDetails {
  firstName: string;
  lastName: string;
  address: Address
  email: string;
  iban: string;
  phone?: string;
  bookingNumber: string;
  boardingPass?: Files;
  isMinor?: boolean;
}
export interface ClaimsForm {
  uuid?: string;
  airport: {
    departure: Airport;
    arrival: Airport;
    trip: {
      departure?: Airport;
      arrival?: Airport;
      layover?: Airport[];
    }
  };
  route: string | null;
  flight: Flight | null;
  connectingFlight: Flight | null;
  flight_date: string;
  disruption: {
    type: string | null;
    details: string | null;
    reason: string | null;
    replacement: boolean | null;
    connectingFlight: boolean | null;
    replacementFlight: Flight | null;
    other: string | null;
  };
  client: {
    agreedToTerms: boolean;
    passengers: PassengerDetails[];
  }
}

/* Airport */

interface AlgoliaResult {
  value: string;
  matchLevel: string;
  matchedWords: string[];
}
export interface Airport {
  search_text: string;
  iata: string;
  latitude: number;
  longitude: number;
  name: string;
  city: string;
  city_translations: {
    [key: string]: string;
  };
  country: string;
  country_code: string;
  ec261: boolean;
  rank: number;
  time_zone: string;
  metropolitan_area: {
    code: string;
    name: string;
    country_code: string;
    country_name: string;
    rank: number;
  };
  objectID?: string;
  _highlightResult?: {
    iata: AlgoliaResult & {
      fullyHighlighted: boolean;
    };
    name: AlgoliaResult;
    city: AlgoliaResult;
    city_translations: {
      [key: string]: AlgoliaResult;
    };
  };
}

/* Flight */
interface FlightAirport {
  airport: string;
  timezone?: string;
  iata: string;
  icao?: string;
  terminal?: string | number;
  gate?: string;
  delay: number;
  scheduled: string;
  estimated: string;
  actual: string;
  estimated_runway: string;
  actual_runway: string;
}
export interface CodeSharedInfo {
  airline_name: string;
  airline_iata: string;
  airline_icao: string;
  flight_number: string;
  flight_iata: string;
  flight_icao: string;
}
export interface FlightInfo {
  codeshared?: CodeSharedInfo;
  iata: string;
  icao: string;
  icao24?: string;
  number?: string;
}
export interface FlightLive {
  updated: string;
  latitude: number;
  longitude: number;
  altitude: number;
  direction: number;
  speed_horizontal: number;
  speed_vertical: number;
  is_ground: boolean;
};
export interface AircraftInfo {
  number: string;
  iata: string;
  icao: string;
  codeshared: string | null;
}
export interface FlightAirline {
  name: string;
  iata: string;
  icao: string;
}
export interface FlightPhase {
  airport: string;
  timezone: string;
  iata: string;
  icao: string;
  terminal: string;
  gate: string;
  delay: number;
  scheduled: string;
  estimated: string;
  actual: string | null;
  estimated_runway: string | null;
  actual_runway: string | null;
}
export interface Flight {
  flight_date: string;
  flight_status: string;
  departure: FlightPhase;
  arrival: FlightPhase & {
    baggage: string;
  };
  airline: FlightAirline;
  flight: FlightInfo;
  aircraft: AircraftInfo;
  live: FlightLive
}


export interface Route extends Record<'departure' | 'arrival', {
  airport: Airport;
}> {
  flight?: Flight;
  flight_date: string;
}

/* Airline */
export interface AirlineAviationEdge { // legacy
  airlineId: string;
  nameAirline: string;
  codeIataAirline: string;
  iataPrefixAccounting: string;
  codeIcaoAirline: string;
  callsign: string;
  type: string;
  statusAirline: string;
  sizeAirline: string;
  ageFleet: string;
  founding: string;
  codeHub: string;
  nameCountry: string;
  codeIso2Country: string;
}
export interface AirlineAviationStack { // not yet used, but should be used when using api for airlines
  airline_name: string;
  iata_code: string;
  iata_prefix_accounting: string;
  icao_code: string;
  callsign: string;
  type: string;
  status: string;
  fleet_size: string;
  fleet_average_age: string;
  date_founded: string;
  hub_code: string;
  country_name: string;
  country_iso2: string;
}
export interface Airline {
    id: string;
    iata: string;
    name: string;
    country: string;
    isEuMember: boolean;
    callsign: string;
    hubCode: string;
    dateFounded: string;
    iataPrefixAccounting: string;
    fleetSize: string;
    type: string[];
}

/* Google Maps */

export interface Review {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
}


/* Database */
export interface UsersTable {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  iban: string;
  agreed_to_terms: boolean;
}
export interface ClaimsTable {
  id: string;
  flight_number: string;
  passenger_count: number;
}
export interface FlightsTable {
  id: string;
  number: string;
  status: string;
  flight_date: string;
  flight_number: string;
  airline: string;
  airline_iata: string;
  scheduled_time_departure: string;
  scheduled_time_arrival: string;
  actual_time_departure: string;
  actual_time_arrival: string;
  delay_arrival: string;
  airport_departure: string;
  airport_arrival: string;
}
export interface Database {
  public: {
    Tables: {
      users: {
        Row: UsersTable
        Insert: UsersTable
        Update: UsersTable
      }
      claims: {
        Row: ClaimsTable
        Insert: ClaimsTable
        Update: ClaimsTable
      }
      flights: {
        Row: FlightsTable
        Insert: FlightsTable
        Update: FlightsTable
      }
    }
  }
}


import '@nuxtjs/algolia'
import { DefineComponent } from 'nuxt/dist/app/compat/capi';
import { Component } from 'nuxt/schema';
declare module '@nuxtjs/algolia' {
  interface AlgoliaIndices {
    AIRPORTS: Airport
  }
}