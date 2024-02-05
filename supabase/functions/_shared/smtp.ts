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

export default smtp.send