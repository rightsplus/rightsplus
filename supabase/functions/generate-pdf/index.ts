import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'supabase'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const doppioApiToken = Deno.env.get('DOPPIO_API_TOKEN');
  if (!doppioApiToken) {
    throw new Error('DOPPIO_API_TOKEN is not set in environment variables');
  }
  
  try {
  const authHeader = req.headers.get('Authorization')!
  // const supabase = createClient(
  //   Deno.env.get('SUPABASE_URL') ?? '',
  //   Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  //   { global: { headers: { Authorization: authHeader } } }
  // )

  const encodedHTML = (new TextEncoder().encode(`<h1>Test in H1</h1>`, 'utf8')).toString('base64')
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${doppioApiToken}`,
      'Content-Type': 'application/json'
    },
    encoding: null,
    body: JSON.stringify({
      page: {
        goto: {
          url: 'https://rightsplus.up.railway.app/deine-rechte',
          options: {
            waitUntil: [
              "networkidle0"
            ]
          }
        },
        // setExtraHTTPHeaders: {
        //   'Authorization': '<YOUR OWN TOKEN>',
        //   'x-something-very-custom': 'a secret token'
        // }
      }
    })
  };
  const res = await fetch('https://api.doppio.sh/v1/render/pdf/async', options);
  const data = await res.json();

  return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: data.status || 200
      }
    )
  } catch (error) {
    return new Response(error.message, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})