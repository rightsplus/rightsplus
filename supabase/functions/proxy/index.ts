import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url, options } = await req.json()
    const newUrl = new URL(url)
    // const newUrl = url includes('flightsHistory') ? new URL('https://aviation-edge.com/v2/public/' + url) : new URL(url)
    if (newUrl.hostname === 'aviation-edge.com') {
      newUrl.searchParams.append('key', Deno.env.get("AVIATION_EDGE_KEY"));
    }
    console.log(newUrl.href)
    const response = await fetch(newUrl.href, options)
    const json = await (response).json()

    return new Response(JSON.stringify(json), {
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
