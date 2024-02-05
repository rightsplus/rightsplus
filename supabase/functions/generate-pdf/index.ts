import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'supabase';
import { SMTPClient } from "denomailer";

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
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { to, name } = await req.json();

  try {
    // Extracting the authorization header
    const authHeader = req.headers.get('Authorization')!;
    
    // Using the Supabase client (if necessary for your use case)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Retrieving the DOPPIO_API_TOKEN from environment variables
    const doppioApiToken = Deno.env.get('DOPPIO_API_TOKEN');
    if (!doppioApiToken) {
      throw new Error('DOPPIO_API_TOKEN is not set in environment variables');
    }

    // Your HTML content
    const HTML = `<!DOCTYPE html>
      <html>
        <body>
          <h1 style="color: black; font-size: 20px">Hi ${name}</h1>
          <p>This is a paragraph</p>
        </body>
      </html>`;

    // Base64 encode the HTML content
    const encodedHTML = btoa(unescape(encodeURIComponent(HTML)));

    // Your PDF rendering logic
    const res = await fetch('https://api.doppio.sh/v1/render/pdf/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${doppioApiToken}`,
      },
      body: JSON.stringify({
        page: {
          pdf: {
            printBackground: true
          },
          setContent: {
            html: encodedHTML,
          },
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Doppio API request failed with status: ${res.status}`);
    }

    const pdfData = await res.arrayBuffer();
    const base64Pdf = btoa(new Uint8Array(pdfData).reduce((data, byte) => data + String.fromCharCode(byte), ''));

    await smtp.send({
      from: Deno.env.get("GMAIL_USER"),
      to,
      subject: `Hello ${name}`,
      content: `Hello ${name} from Supabase Edge Functions`,
      attachments: [
        {
          contentType: 'application/pdf',
          encoding: 'base64',
          fileName: 'output.pdf',
          data: base64Pdf,
        }
      ]
    });

    await smtp.close();

    const data = {
      message: `Hello ${name} from Supabase Edge Functions`,
    };

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // Handle errors
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
