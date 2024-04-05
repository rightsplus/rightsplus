/* Claims Form State */
export type Address<T = string> = {
  street: T;
  postalCode: T;
  city: T;
  country?: T;
};
export interface PassengerDetails<T = string> {
  firstName: T;
  lastName: T;
  address: Address<T>
  email: T;
  iban: T;
  phone?: T;
  boardingPass?: Files;
  isMinor?: boolean;
}
export interface ClaimsForm {
  id?: number;
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
  date: string | null;
  disruption: {
    type: 'cancelled' | 'delayed' | 'noBoarding' | null;
    details: '<3' | '3-4' | '>4' | '<8' | '7-14' | '>14' | null;
    reason: string | null;
    other: string | null;
    selfInflicted?: boolean;
  };
  replacement: {
    offered: boolean;
    departure: Airport;
    date: string | null;
    number: string | null;
    flight: Flight | null;
  }
  connection: {
    offered: boolean;
    departure: Airport;
    date: string | null;
    number: string | null;
    flight: Flight | null;
  }
  client: {
    agreedToTerms: boolean;
    bookingNumber: string;
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
type AirlineInfo {
  name: string;
  iata: string;
}
type FlightInfo {
  number: string;
  iata: string;
}
type CodeSharedInfo {
  airline: AirlineInfo;
  flight: FlightInfo
}

export type FlightPhase<T = 'departure' | 'arrival'> = {
  iata: string;
  delay: number;
  scheduledTime: string;
  estimatedTime: string;
  actualTime: string;
  estimatedRunway: string;
  actualRunway: string;
}
export interface Flight {
  type: "arrival" | "departure";
  status: "landed" | "scheduled" | "cancelled" | "active" | "unknown";
  departure: FlightPhase;
  arrival: FlightPhase;
  airline: AirlineInfo;
  flight: FlightInfo;
  distance?: number;
  codeshared?: CodeSharedInfo;
}

export interface Route extends Record<'departure' | 'arrival', {
  airport: Airport;
}> {
  flight?: Flight;
  date: string;
}
export { Flight as FlightAviationEdge } from "./aviation-edge.types"
export { Airline as AirlineAviationEdge } from "./aviation-edge.types"
/* Airline */
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