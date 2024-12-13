import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import nodemailer from 'nodemailer'
import { useCompiler } from '#vue-email'
import type { SendMailProps, SendPDFMailProps } from "./types";

const sendMail = async (props: SendMailProps) => {

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
			attachments: props.attachment && props.pdfBuffer ? [
				{
					filename: `${'file'}.pdf`,
					content: props.pdfBuffer,
				},
			] : [],
		})
		return { message: 'Email sent successfully' }
	} catch (error) {
		console.log('error', error)
		return { message: "Something went wrong" + error }
	}
}

// const generatePDF = async ({ data, pdf }: SendPDFMailProps) => {
// 	if (!pdf) return

// 	const url = generatePDFTemplateLink(pdf.template, data)
// 	console.log(url.href)

// 	return await generate(url.href)
// }

const reconstructNestedObjectFromMultipart = (formData: MultiPartData[]): any => {
	const obj: Record<string, any> = {};

	for (const field of formData) {
		// Files are stored as Buffers, texts as strings
		let value: string | Buffer

		try {
			value = field.name === 'attachment' ? field.data : field.data.toString();
		} catch (e) {
			value = field.data
		}
		setNestedValue(obj, field.name, value);
	}

	return obj;
};
// Helper function to set a value in a nested object based on a key path
const setNestedValue = (obj: any, key: string, value: any): void => {
	const keys = key.split(/[\[\]]+/).filter(Boolean); // Split keys and remove empty parts
	let current = obj;

	for (let i = 0; i < keys.length; i++) {
		const part = keys[i];

		// If it's the last part, set the value
		if (i === keys.length - 1) {
			current[part] = value;
		} else {
			// Otherwise, move deeper into the object
			if (!(part in current)) {
				current[part] = isNaN(Number(keys[i + 1])) ? {} : []; // Determine if next key is array index
			}
			current = current[part];
		}
	}
};
export default defineEventHandler(async (event) => {
	try {
		// Read the incoming multipart/form-data
		const formData = await readMultipartFormData(event);

		if (!formData) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid FormData",
			});
		}

		// Process the FormData
		const body = reconstructNestedObjectFromMultipart(formData)
		const html = body.template ? (await useCompiler(body.template, { props: body.data })).html : undefined

		const response = await sendMail({
			...body,
			pdfBuffer: body.attachment,
			html
		})

		return {
			statusCode: 200,
			body: response
		}
	} catch (error) {
		return error
	}
})
