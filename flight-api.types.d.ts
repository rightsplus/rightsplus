import type { FlightStatus, FlightStatusApi } from "./types";

export interface VariFlight {
  FlightNo: string;
  FlightCompany: string;
  FlightDepcode: string;
  FlightArrcode: string;
  FlightDeptimePlanDate: string;
  FlightArrtimePlanDate: string;
  FlightDeptimeReadyDate: string;
  FlightArrtimeReadyDate: string;
  FlightDeptimeDate: string;
  FlightArrtimeDate: string;
  FlightIngateTime: string;
  FlightOutgateTime: string;
  CheckinTable: string;
  BoardGate: string;
  BaggageID: string;
  BoardState: string;
  FlightState: string;
  FlightHTerminal: string;
  FlightTerminal: string;
  org_timezone: string;
  dst_timezone: string;
  ShareFlightNo: string;
  StopFlag: string;
  ShareFlag: string;
  LegFlag: string;
  FlightDep: string;
  FlightArr: string;
  deptel: string;
  arrtel: string;
  airlinetel: string;
  FlightDepAirport: string;
  FlightArrAirport: string;
  OntimeRate: string;
  generic: string;
  FlightYear: number;
  FlightDuration: string;
  distance: string;
  VeryZhunReadyDeptimeDate: string;
  VeryZhunReadyArrtimeDate: string;
  DepAirportLat: string;
  DepAirportLon: string;
  DepTerminalLat: string;
  DepTerminalLon: string;
  ArrAirportLat: string;
  ArrAirportLon: string;
  ArrTerminalLat: string;
  ArrTerminalLon: string;
  StopAirportCode: string;
  StopCity: string;
}


export interface FlightAviationEdge {
  type: "arrival" | "departure";
  status: FlightStatusApi;
  departure: {
    iataCode: string;
    icaoCode: string;
    gate?: string;
    terminal?: string;
    delay: string;
    scheduledTime: string;
    estimatedTime: string;
    actualTime: string;
    estimatedRunway: string;
    actualRunway: string;
  };
  arrival: {
    iataCode: string;
    icaoCode: string;
    baggage?: string;
    delay?: string;
    scheduledTime: string;
    estimatedTime: string;
    actualTime: string;
    estimatedRunway: string;
    actualRunway: string;
  };
  airline: {
    name: string;
    iataCode: string;
    icaoCode: string;
  };
  flight: {
    number: string;
    iataNumber: string;
    icaoNumber: string;
  };
  codeshared?: {
    airline: {
      name: string;
      iataCode: string;
      icaoCode: string;
    };
    flight: {
      number: string;
      iataNumber: string;
      icaoNumber: string;
    };
  };
}

export interface AirlineAviationEdge {
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

export interface FlightAviationStack {
  flight_date: string;
  flight_status: FlightStatusApi;
  departure: {
      airport: string;
      timezone: string;
      iata: string;
      icao: string;
      terminal: string | null;
      gate: string | null;
      delay: number | null;
      scheduled: string;
      estimated: string;
      actual: string | null;
      estimated_runway: string | null;
      actual_runway: string | null;
  };
  arrival: {
      airport: string;
      timezone: string;
      iata: string;
      icao: string;
      terminal: string | null;
      gate: string | null;
      baggage: string | null;
      delay: number | null;
      scheduled: string;
      estimated: string;
      actual: string | null;
      estimated_runway: string | null;
      actual_runway: string | null;
  };
  airline: {
      name: string;
      iata: string;
      icao: string;
  };
  flight: {
      number: string;
      iata: string;
      icao: string;
      codeshared: {
        airline_name: string;
        airline_iata: string;
        airline_icao: string;
        flight_number: string;
        flight_iata: string;
        flight_icao: string;
      }

  };
  aircraft: any;
  live: any;
}
