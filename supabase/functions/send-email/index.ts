import { corsHeaders } from '../_shared/cors.ts'
import { SMTPClient } from "denomailer"

const smtp = new SMTPClient({
  connection: {
    hostname: "smtp.gmail.com",
    port: 465,
    tls: true,
    auth: {
      username: Deno.env.get("GMAIL_USER"),
      password: Deno.env.get("GMAIL_PASSWORD"),
    },
  },
})
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { to, name } = await req.json()
  try {
    await smtp.send({
      from: Deno.env.get("GMAIL_USER"),
      to,
      subject: `Hello ${name}`,
      content: `Hello ${name} from Supabase Edge Functions`,
    })
  } catch (error) {
    return new Response(error.message, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }

  await smtp.close()

  return new Response(
    JSON.stringify({
      done: true,
      message: `Email sent to ${to}`,
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    }
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
