
import type { Flight, FlightAviationEdge, RowAirline } from '~/types.js'
import { corsHeaders } from '../_shared/cors.ts'
import { transformAviationEdgeFlight, transformAviationStackFlight, prepareFlight } from '../_shared/fetchFlights.ts'
import { createClient } from 'supabase'
import type { FlightAviationStack } from '~/aviation-edge.types.js'

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

    // @todo: eventually we do not expect to gather more airlines and we can remove this
    // Aggregate unique airlines
    const airlines = Array.from(
      flights.reduce((map, flight) => {
        map.set(flight.airline.iata, flight.airline.name);
        return map;
      }, new Map<string, string>())
    ).map(([iata, name]) => ({ iata, name }));

    // Upsert airlines
    const { data: airlineData, error: airlineError } = await supabase
      .from('airline')
      .upsert(airlines, { onConflict: 'iata', ignoreDuplicates: true })
      .select('*');

    if (airlineError) throw new Error(`Airline upsert failed: ${airlineError.message}`);

    // Upsert flights
    const { data: flightData, error: flightError } = await supabase
      .from('flight')
      .upsert(flights.map(e => prepareFlight(e)), { onConflict: ['iata', 'dateDeparture'], ignoreDuplicates: true });

    if (flightError) throw new Error(`Flight upsert failed: ${flightError.message}`);

    console.log('Flights inserted successfully', flightData);
  } catch (error) {
    console.error('Error updating airlines and flights:', error);
  }
};


const fetchAviationStack = async ({ date, departure, arrival, type, iata }, req) => {
  const url = new URL(`http://api.aviationstack.com/v1/flights`);
  url.searchParams.append('access_key', Deno.env.get("AVIATION_STACK_KEY"));

  if (date) url.searchParams.append("flight_date", date);
  if (departure) url.searchParams.append("dep_iata", departure);
  if (arrival) url.searchParams.append("arr_iata", arrival);
  if (iata) url.searchParams.append("flight_iata", iata);

  console.log('fetching from aviation stack', url)

  const response = await fetch(url.href)
  console.log('fetch', response)
  if (response.error) {
    console.log('error fetching aviation stack', response)
    throw new Error(response.error)
  }
  const json = await (response.json())

  if (json.error) throw json.error

  console.log('raw', json.data)
  const flights = json.data.map((flight: FlightAviationStack) => transformAviationStackFlight(flight))
  console.log('flights', flights)

  saveFlightsToSupabase(flights, req)


  const filteredFlights = departure && arrival ? flights.filter((e: { departure: { iata: any }; arrival: { iata: any } }) => e.departure.iata === departure && e.arrival.iata === arrival) : flights

  console.log('filteredFlights', filteredFlights)
  return filteredFlights
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

  console.log('fetching from aviation edge', url)

  const response = await fetch(url.href)
  const json = await (response).json()

  if (json.error) throw json.error

  const flights = json.map((flight: FlightAviationEdge) => transformAviationEdgeFlight(flight))

  updateAirlines(flights, req)

  const filteredFlights = departure && arrival ? flights.filter((e: { departure: { iata: any }; arrival: { iata: any } }) => e.departure.iata === departure && e.arrival.iata === arrival) : flights

  console.log('filteredFlights', filteredFlights)
  return filteredFlights
}

const returnData = (data: any) => {
  console.log('returning data', data)
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
    let data
    // data = await fetchSupabase({ date, departure, arrival, type, iata })
    // if (data.length) return returnData(data)
    console.log("fetching from aviation stack")
    data = await fetchAviationStack({ date, departure, arrival, type, iata }, req)
    if (data.length) return returnData(data)
    console.log("fetching from aviation edge")
    data = await fetchAviationEdge({ date, departure, arrival, type, iata }, req)
    return returnData(data)
  } catch (error: Error) {
    return new Response(error.message, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error?.status
    })
  }
})
