import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'supabase'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const authHeader = req.headers.get('Authorization')!
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  const { email } = await req.json()
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)

  if (error) {
    return new Response(error.message, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }

  return new Response(
    JSON.stringify(!!data.length),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: data.status
    }
  )
})
