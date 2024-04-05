import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import nodemailer from 'nodemailer'
import { generatePDF as generate } from "@/pdf/pdfGenerator";
import { useCompiler } from '#vue-email'
import type { SendMailProps, SendPDFMailProps } from "./types";

const sendMail = async (props: SendMailProps) => {
	console.log(props)
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		secure: true, // upgrade later with STARTTLS
		port: 465,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	})

	try {
		transporter.sendMail({
			from: `"Joachim von RightsPlus" ${process.env.SMTP_USER}`,
			to: props.to,
			subject: props.subject,
			html: props.html || props.text,
			attachments: props.pdf && props.pdfBuffer ? [
				{
					filename: `${props.pdf.fileName || props.pdf.template}.pdf`,
					content: props.pdfBuffer,
				},
			] : [],
		})
	} catch (error) {
		console.log('error', error)
	}
}

const generatePDF = async ({ data, pdf }: SendPDFMailProps) => {
	if (!pdf) return

	const url = generatePDFTemplateLink(pdf.template, data)
	console.log(url.href)

	return await generate(url.href)
}

export default defineEventHandler(async (event) => {
	// const client = serverSupabaseClient(event)
	// const isAdmin = user?.email && (await client.from('users').select('role').eq('email', user.email).single()).data?.role === 'admin'


	try {
		const user = await serverSupabaseUser(event)
		if (!user?.email) throw createError({ statusCode: 401, message: "Unauthorized" })
		const body = JSON.parse(await readBody(event)) as SendPDFMailProps

		const pdfBuffer = await generatePDF(body)
		const html = body.template ? (await useCompiler(body.template, { props: body.data })).html : undefined

		await sendMail({
			...body,
			pdfBuffer,
			html
		})

		return {
			statusCode: 200,
			body: { message: 'Email sent successfully' }
		}
	} catch (error) {
		return error
	}
})
