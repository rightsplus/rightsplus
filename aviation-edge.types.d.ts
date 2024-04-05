export interface Flight {
  type: "arrival" | "departure";
  status: "landed" | "scheduled" | "cancelled" | "active" | "unknown";
  departure: {
    iataCode: string;
    icaoCode: string;
    gate?: string;
    terminal?: string;
    delay: number;
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
    delay?: number;
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

export interface Airline {
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