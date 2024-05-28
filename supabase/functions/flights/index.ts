
import type { Flight, FlightAviationEdge, RowAirline } from '~/types.js'
import { corsHeaders } from '../_shared/cors.ts'
import { transformAviationEdgeFlight, transformAviationStackFlight, prepareFlight } from '../_shared/fetchFlights.ts'
import { createClient } from 'supabase'

const updateAirlines = (flights: Flight[], req: { headers: { get: (arg0: string) => any } } | undefined) => {
  const authHeader = req.headers.get('Authorization')!

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )
  const airlines = Object.entries(flights.reduce((acc, curr) => ({ ...acc, [curr.airline.iata]: curr.airline.name }), {})).map(([iata, name]) => ({ iata, name }))
  supabase
    .from("airline")
    .insert(airlines, { onConflict: 'iata' })
    .then(({ data: airlines }) => {
      supabase
        .from("flight")
        .insert(flights.map((flight) => prepareFlight(flight)))
        .then(console.log)
        .catch(console.log)
    })
    .catch(console.log)
}
// const fetchSupabase = async ({ date, departure, arrival, type, iata }) => {
//   let match = {}
//   if (iata) {
//     match = {
//       dateDeparture: date,
//       iata
//     }
//   } else if (type === 'departure' && departure) {
//     match = {
//       dateDeparture: date,
//       airportDeparture: departure
//     }
//   } else if (type === 'arrival' && arrival) {
//     match = {
//       dateArrival: date,
//       airportArrival: arrival
//     }
//   } else if (departure && arrival) {
//     match = {
//       dateDeparture: date,
//       airportDeparture: departure,
//       airportArrival: arrival
//     }
//   } else {
//     console.log('supply iata OR type and dep/arr OR dep and arr')
//     throw 'supply iata OR type and dep/arr OR dep and arr'
//   }
//   console.log('match...', match)

//   const { data, error } = await supabase
//     .from('flight')
//     .select('data')
//     .match(match)

//   console.log('data', data)
//   console.log('error', error)

//   return data.map((e: { data: any }) => e.data)
// }

const fetchAviationStack = async ({ date, departure, arrival, type, iata }) => {
  const url = new URL(`http://api.aviationstack.com/v1/flights/`);
  url.searchParams.append('access_key', Deno.env.get("AVIATION_STACK_KEY"));

  // if (date) url.searchParams.append("flight_date", date);
  if (departure) url.searchParams.append("dep_iata", departure);
  if (arrival) url.searchParams.append("arr_iata", arrival);
  if (iata) url.searchParams.append("flight_iata", iata);

  console.log('fetching from aviation stack', url)

  const response = await fetch(url.href)
  console.log(response)
  if (response.error) {
    console.log(response)
    throw new Error(response.error)
  }
  const json = await (response.json())

  console.log(json)
  return []

  if (json.error) throw json.error

  const flights = json.map((flight: FlightAviationEdge) => transformAviationStackFlight(flight))

  updateAirlines(flights)

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
  const json = await(response).json()

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
    data = await fetchAviationStack({ date, departure, arrival, type, iata })
    if (data.length) return returnData(data)
    data = await fetchAviationEdge({ date, departure, arrival, type, iata }, req)
    return returnData(data)
  } catch (error: Error) {
    return new Response(error.message, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error?.status
    })
  }
})
