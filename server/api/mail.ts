import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import nodemailer from 'nodemailer'
import template from '../agreement'

const sendMail = (from: string, to: string, subject: string, text: string, name: string) => {
  const transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
  })
  transporter.sendMail({
    from,
    to,
    subject,
    html: template.replaceAll('{{client_name}}', name)
  })
}

export default defineEventHandler(async (event) => {
	const user = await serverSupabaseUser(event)
	const client = serverSupabaseClient(event)
	const isAdmin = (await client.from('users').select('role').eq('email', user?.email).single()).data?.role === 'admin'
	
	if (!isAdmin) throw createError({ statusCode: 401, message: "Unauthorized" })
	const body = await readBody(event)
	console.log(body)
	
	try {
		if (!body.from || !body.to || !body.subject || !body.text) throw createError({ statusCode: 400, message: "Bad Request" })
		sendMail(body.from, body.to, body.subject, body.text, body.name)
		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'Payout successful' })
		}
  } catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Payout failed' })
		}
  }
})
