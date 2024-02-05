import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import nodemailer from 'nodemailer'
import { generatePDF as generate } from "@/pdf/pdfGenerator";
import { useCompiler } from '#vue-email'

type SendMailProps = {
	from: string;
	to: string;
	subject: string;
	text: string;
	name: string;
	template: string;
	pdf: Buffer
}

const sendMail = async (props: SendMailProps) => {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		secure: true, // upgrade later with STARTTLS
		port: 465,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	})

	try {
		// console.log('props', props)
		// console.log('transporter', transporter)
		transporter.sendMail({
			from: process.env.SMTP_USER,
			to: props.to,
			subject: props.subject,
			html: props.template,
			attachments: [
				{
					filename: 'assignment.pdf',
					content: props.pdf,
				},
			],
		})
	} catch (error) {
		console.log('error', error)
	}
}

const generatePDF = async ({ data, pdfRoute }: {
	data: Record<string, string | number>
	pdfRoute: string
}) => {
	const url = new URL(`http://localhost:3000/pdf/${pdfRoute}`)
	Object.entries(data).forEach(([key, value]) => {
		url.searchParams.append(key, value.toString());
	});

	return await generate(url.toJSON())
}

export default defineEventHandler(async (event) => {
	const user = await serverSupabaseUser(event)
	const client = serverSupabaseClient(event)
	const isAdmin = user?.email && (await client.from('users').select('role').eq('email', user.email).single()).data?.role === 'admin'

	if (!isAdmin) throw createError({ statusCode: 401, message: "Unauthorized" })
	const body = JSON.parse(await readBody(event))

	console.log("the body", typeof body)

	try {
		console.log({ data: body.to, pdfRoute: body.pdfRoute })
		const pdf = await generatePDF({ data: body.to, pdfRoute: body.pdfRoute })
		console.log(pdf)
		const { html: template } = await useCompiler('AssignmentLetter.vue', {
			props: {
				url: 'some-url.com',
			}
		})
		console.log('template', template)

		sendMail({
			...body,
			pdf,
			template
		})
		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'Payout successful' })
		}
	} catch (error) {
		return error
	}
})
