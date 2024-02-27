import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url, options } = await req.json()
    const newUrl = new URL(url)
    if (newUrl.hostname === 'api.flightstats.com') {
      // @todo: add the option to save response to the database
      // when request with same parameters is made, fetch from db
      newUrl.searchParams.append('appId', Deno.env.get("CIRIUM_APP_ID"));
      newUrl.searchParams.append('appKey', Deno.env.get("CIRIUM_APP_KEY"));
    }
    console.log(newUrl.href)
    const response = await fetch(newUrl.href, options)
    const json = await (response).json()
    console.log(json)

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
