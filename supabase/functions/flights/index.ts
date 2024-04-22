import { corsHeaders } from '../_shared/cors.ts'
import { transformAviationEdgeFlight, prepareFlight } from '../_shared/fetchFlights.ts'
import { createClient } from 'supabase'


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { date, departure, arrival, type, iata } = await req.json()
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    let match = {}
    if (iata) {
      match = {
        dateDeparture: date,
        iata
      }
    } else if (type === 'departure' && departure) {
      match = {
        dateDeparture: date,
        airportDeparture: departure
      }
    } else if (type === 'arrival' && arrival) {
      match = {
        dateArrival: date,
        airportArrival: arrival
      }
    } else if (departure && arrival) {
      match = {
        dateDeparture: date,
        airportDeparture: departure,
        airportArrival: arrival
      }
    } else {
      throw 'supply iata OR type and dep/arr OR dep and arr'
    }
    console.log('match...', match)

    const { data, error } = await supabase
      .from('flight')
      .select('data')
      .match(match)

    console.log('data', data)
    console.log('error', error)

    const mappedFlights = data.map(e => e.data)
    console.timeEnd('supabase fetch')
    if (data?.length) {
      return new Response(JSON.stringify(mappedFlights), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    console.time('aviation egde fetch')
    const api = new Date(date) < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) ? 'flightsHistory' : 'timetable'


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
    console.log('response', response)
    const json = await (response).json()
    console.log('json', json)
    const flights = json.map((flight) => transformAviationEdgeFlight(flight))

    const airlines = Object.entries(flights.reduce((acc, curr) => ({ ...acc, [curr.airline.iata]: curr.airline.name }), {})).map(([iata, name]) => ({ iata, name }))
    supabase
      .from("airline")
      .upsert(airlines, { onConflict: 'iata' })
      .then(() => {
        supabase
          .from("flight")
          .upsert(flights.map(prepareFlight))
          .then(console.log)
          .catch(console.log)
      })
      .catch(console.log)



    const filteredFlights = departure && arrival ? flights.filter(e => e.departure.iata === departure && e.arrival.iata === arrival) : flights

    console.log('filteredFlights', filteredFlights)

    console.timeEnd('aviation egde fetch')
    return new Response(JSON.stringify(filteredFlights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(error.message, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.status
    })
  }
})
