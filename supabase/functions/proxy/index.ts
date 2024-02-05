import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const { url, options } = await req.json()
    const response = await fetch(url, options)
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
