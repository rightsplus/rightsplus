import { corsHeaders } from '../_shared/cors.ts'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { env, pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0'

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Preparation for Deno runtime
env.useBrowserCache = false
env.allowLocalModels = false

// Construct pipeline outside of serve for faster warm starts
const pipe = await pipeline(
  'sentiment-analysis', 'nlptown/bert-base-multilingual-uncased-sentiment',
)

// Deno Handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')!

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  const { input } = await req.json()

  // Generate the embedding from the user input
  const output = await pipe(input)

  // Store the embedding
  const { data, error } = await supabase
    .from('sentiments')
    .insert({ text: input, sentiment: output })

  // Return the embedding
  return new Response(
    { new_row: data },
    { headers: { 'Content-Type': 'application/json' } },
  )
})
