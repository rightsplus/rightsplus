import type { Flight, FlightAviationEdge, RowAirline } from '~/types.js'
import type { FlightAviationStack } from '~/flight-api.types.js'
import { corsHeaders } from '../_shared/cors.ts'
import { transformAviationEdgeFlight, transformAviationStackFlight, prepareFlight, consolidateFlights } from '../_shared/fetchFlights.ts'
import { createClient } from 'supabase'

const saveFlightsToSupabase = async (
  flights: Flight[],
  req: { headers: { get: (arg0: string) => any } } | undefined
) => {
  try {
    const authHeader = req?.headers?.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const airlines = Array.from(
      new Map(flights.map(e => [e.airline.iata, {
        iata: e.airline.iata,
        name: e.airline.name,
        type: e.airline.type,
      }])).values()
    );

    console.log('airlines', airlines)

    const { error: airlineError } = await supabase
      .from('airline')
      .upsert(airlines, { onConflict: ['iata'] });

    if (airlineError) {
      console.error('Airline upsert failed:', airlineError);
      throw airlineError;
    }


    // Upsert flights
    const { data: flightData, error: flightError } = await supabase
      .from('flight')
      .upsert(flights.map(e => prepareFlight(e)), { onConflict: ['iata', 'dateDeparture'], ignoreDuplicates: true });

    if (flightError) throw new Error(`Flight upsert failed: ${flightError.message}`);

    console.log('Flights inserted successfully', flightData);
  } catch (error) {
    console.error(error);
  }
};


const fetchAviationStack = async ({ date, departure, arrival, type, iata }, req) => {
  try {
    const url = new URL(`http://api.aviationstack.com/v1/flights`);
    url.searchParams.append('access_key', Deno.env.get("AVIATION_STACK_KEY"));

    if (date) url.searchParams.append("flight_date", date);
    if (departure) url.searchParams.append("dep_iata", departure);
    if (arrival) url.searchParams.append("arr_iata", arrival);
    if (iata) url.searchParams.append("flight_iata", iata);


    console.log('fetching aviation stack', url.href)
    const response = await fetch(url.href)
    console.log(response)

    if (response.error) throw response.error

    const json = await (response.json())

    if (json.error) throw json.error
    console.log('json', json)

    const normalizedFlights = json.data.map((flight: FlightAviationStack) => transformAviationStackFlight(flight))
    const flights = await consolidateFlights(normalizedFlights, req)

    console.log('flights', flights)
    saveFlightsToSupabase(flights, req)


    const filteredFlights = departure && arrival ? flights.filter((e: Flight) => e.departure.iata === departure && e.arrival.iata === arrival) : flights

    return filteredFlights
  } catch (error) {
    console.error(error)
    return []
  }
}

const fetchAviationEdge = async ({ date, departure, arrival, type, iata }: { date: any; departure: any; arrival: any; type: any; iata: any }, req: any) => {

  const api = new Date(date) < new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) ? 'flightsHistory' : 'timetable'


  const url = new URL(`https://aviation-edge.com/v2/public/${api}`);
  url.searchParams.append('key', Deno.env.get("AVIATION_EDGE_KEY"));

  const t = type || 'departure'
  const code = t === 'arrival' ? arrival : departure
  if (api === 'flightsHistory') {
    url.searchParams.append("code", code);
    url.searchParams.append('date_from', date);
  } else {
    url.searchParams.append("iataCode", code);
  }
  url.searchParams.append("type", t);

  console.log("fetching from aviation edge ...", url.href)
  const response = await fetch(url.href)
  const json = await (response).json()

  if (json.error) throw json.error


  const normalizedFlights = json.map((flight: FlightAviationEdge) => transformAviationEdgeFlight(flight))
  const flights = await consolidateFlights(normalizedFlights, req, true)

  saveFlightsToSupabase(flights, req)

  const filteredFlights = departure && arrival ? flights.filter((e: { departure: { iata: any }; arrival: { iata: any } }) => e.departure.iata === departure && e.arrival.iata === arrival) : flights

  return filteredFlights
}

const returnData = (data: any) => {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200
  })
}

Deno.serve(async (req: { json: () => PromiseLike<{ date: any; departure: any; arrival: any; type: any; iata: any }> | { date: any; departure: any; arrival: any; type: any; iata: any } }) => {
  // if (req.method === 'OPTIONS') {
  //   return new Response('ok', { headers: corsHeaders })
  // }

  try {
    const { date, departure, arrival, type, iata } = await req.json()
    let data: Flight[]
    // data = await fetchSupabase({ date, departure, arrival, type, iata })
    // if (data.length) return returnData(data)
    data = await fetchAviationStack({ date, departure, arrival, type, iata }, req)
    if (data.length) {
      console.log("returning flights", data)
      return returnData(data)
    }
    console.log("aviation stack returned no flights")
    data = await fetchAviationEdge({ date, departure, arrival, type, iata }, req)
    console.log("returning flights", data)
    return returnData(data)
  } catch (error: Error) {
    return new Response(error.message, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error?.status
    })
  }
})
