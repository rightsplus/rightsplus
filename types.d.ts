export interface ClaimsForm {
  airport: {
    departure: Airport,
    arrival: Airport,
    layover: (Airport | {})[],
  },
  route: string | null,
  flight: Flight | null,
  flight_date: string,
  reason: string | null,
  disruption: string | null,
  reasonDetails: {
    noBoarding?: string,
    delayed?: string,
    cancelled?: string
    other?: string
  },
  step: number,
  client: {
    email: string,
    firstName: string,
    lastName: string,
    iban: string,
    agreedToTerms: boolean,
  }
}
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
export interface FlightInfo {
  number: string;
  iata_number: string;
  icao_number: string;
}
export interface FlightAirline {
  name: string;
  iata_code: string;
  icao_code: string;
}
export interface FlightPhase {
  iata_code: string;
  icao_code: string;
  scheduled_time: string;
  estimated_time?: string;
  actual_time?: string;
  estimated_runway?: string;
  actual_runway?: string;
  gate?: string;
  terminal?: string;
}
export interface Flight {
  type: string;
  status: string;
  departure: FlightPhase;
  arrival: FlightPhase;
  airline: FlightAirline;
  flight: FlightInfo;
  codeshared?: {
    airline: FlightAirline;
    flight: FlightInfo;
  };
}

export interface Airline {
  name: string
  nameCountry: string
  country: string
  iata: string
  isEuMember: boolean
}

export interface Route extends Record<'departure' | 'arrival', {
  airport: Airport;
}> {
  flight?: Flight;
  flight_date: string;
}

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
export interface UsersTable {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  iban: string;
  agreedToTerms: boolean;
}
export interface CasesTable {
  id: string;
  user_id: string;
  data: ClaimsForm;
}
export interface Database {
  public: {
    Tables: {
      users: {
        Row: UsersTable // The data expected to be returned from a "select" statement.
        Insert: {} // The data expected passed to an "insert" statement.
        Update: {} // The data expected passed to an "update" statement.
      }
      cases: {
        Row: CasesTable // The data expected to be returned from a "select" statement.
        Insert: {} // The data expected passed to an "insert" statement.
        Update: {} // The data expected passed to an "update" statement.
      }
    }
  }
}


import '@nuxtjs/algolia'
declare module '@nuxtjs/algolia' {
  interface AlgoliaIndices {
    AIRPORTS: Airport
  }
}