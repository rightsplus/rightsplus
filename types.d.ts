import type { PointGroup } from "signature_pad";

/* Claims Form State */
export type Address<T = string> = {
  street: T;
  postalCode: T;
  city: T;
  country?: T;
};


export type CaseStatus = "dataReceived"
	| "compensationClaimChecked"
	| "orderRejected"
	| "reminderForAssignmentDeclaration"
	| "assignmentDeclarationReceived"
	| "airlineContacted"
	| "lawFirmEngaged"
	| "compensationClaimSecured"
	| "lawsuitFiled"
	| "compensationClaimSecuredLawsuit"
	| "paymentProcessed"
	| "legalDisputeLost"
	| "other"

export interface PassengerDetails<T = string> {
  firstName: T;
  lastName: T;
  address: Address<T>
  email: T;
  iban: T;
  phone?: T;
  boardingPass?: Files;
  isMinor?: boolean;
  signature?: SignatureData
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
  leg: string | null;
  flight: Flight | null;
  connectingFlight: Flight | null;
  date: string | null;
  disruption: {
    type: 'cancelled' | 'delayed' | 'noBoarding' | null;
    details: '<3' | '3-4' | '>4' | '<8' | '7-14' | '>14' | null;
    reason: string | null;
    comment: string | null;
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
    arrival: Airport;
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
type AirlineInfo = {
  name: string;
  iata: string;
}
type FlightInfo = {
  number: string;
  iata: string;
}
type CodeSharedInfo = {
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

export interface Leg extends Record<'departure' | 'arrival', {
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
  hubCode: string | null;
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

interface Row {
  id: number;
  createdAt: string;
}
export interface UsersTable {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  iban: string;
  agreed_to_terms: boolean;
}
export interface RowAirline extends Row {
  iata: string;
  name: string;
  legalName: string | null;
  country: string;
  isEuMember: boolean;
  callsign: string;
  hubCode: string | null;
  dateFounded: string;
  iataPrefixAccounting: string;
  fleetSize: string;
  type: string[];
  address: string;
  postalCode: string;
  city: string;
  email: string;
}
export interface RowFlight extends Row  {
  iata: string;
  status: string;
  airlineIata: RowAirline['iata'];
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture: string;
  actualArrival: string;
  delayArrival: number;
  airportDeparture: string;
  airportArrival: string;
  data: Flight
}
export interface RowBooking extends Row  {
  number: string;
  flightId: RowFlight['id'];
  disruption: ClaimsForm['disruption'];
}
export interface RowClaim extends Row  {
  status: ClaimStatus;
  email: string;
  bookingId: BookingsRow['id'];
  client: ClaimsForm['client']['passengers'][number];
  unread: boolean;
}
export type RowClaimExtended = RowClaim & {
  booking: RowBooking & {
    flight: RowFlight & {
      airline: RowAirline
    }
  }
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
        Row: RowClaim
        Insert: RowClaim
        Update: RowClaim
      }
      flights: {
        Row: RowFlight
        Insert: RowFlight
        Update: RowFlight
      }
      airlines: {
        Row: RowAirline
        Insert: RowAirline
        Update: RowAirline
      }
    }
  }
}


export type SignatureData = {
  data: PointGroup[];
  svg: string;
}

import '@nuxtjs/algolia'
import { DefineComponent } from 'nuxt/dist/app/compat/capi';
import { Component } from 'nuxt/schema';
declare module '@nuxtjs/algolia' {
  interface AlgoliaIndices {
    AIRPORTS: Airport
  }
}


import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    classes?: {
      body?: string;
      header?: string;
      main?: string;
      footer?: string;
    };
    title?: string;
    lead?: string;
    category?: string;
  }
}



export { }
