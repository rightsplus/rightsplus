import nodemailer, { type SentMessageInfo } from 'nodemailer'
import { useCompiler } from '#vue-email'
import type { SendMailProps } from "./types";
import { ImapFlow } from 'imapflow'
import mailcomposer from 'mailcomposer'


const smtpHost = process.env.SMTP_HOST
const smtpPass = process.env.SMTP_PASS
const from = process.env.SMTP_USER
const imapHost = process.env.IMAP_HOST
const sentFolder = process.env.SENT_FOLDER


const saveEmailToSentFolder = async (raw: SentMessageInfo) => {
	if (!from) {
		throw new Error('SMTP user is not defined')
	}

	if (!imapHost) {
		throw new Error('IMAP host is not defined')
	}

	// Connect to IMAP and append
	const client = new ImapFlow({
		host: imapHost,
		port: 993,
		secure: true,
		auth: {
			user: from,
			pass: smtpPass,
		}
	})


	await client.connect()

	// List all mailboxes
	// let mailboxes = await client.list();
	// for (let box of mailboxes) {
	// 	console.log('Mailbox:', box.path);
	// }
	// Append raw email to "Sent" folder
	await client.append(sentFolder || 'Sent', raw, ['\\Seen'])
	await client.logout()
}

type SendMailFormData = Omit<SendMailProps, 'attachments'> & {
	attachments: Record<string, Buffer<ArrayBufferLike>>
}

const sendMail = async (props: SendMailFormData) => {
	if (!imapHost) {
		throw new Error('IMAP host is not defined')
	}

	if (!smtpHost) {
		throw new Error('SMTP host is not defined')
	}

	if (!from) {
		throw new Error('SMTP user is not defined')
	}

	if (!smtpPass) {
		throw new Error('SMTP password is not defined')
	}

	const transporter = nodemailer.createTransport({
		host: smtpHost,
		secure: true, // upgrade later with STARTTLS
		port: 465,
		auth: {
			user: from,
			pass: smtpPass,
		},
	})

	try {
		const mail = {
			from: `"Joachim von RightsPlus" <${process.env.SMTP_USER}>`,
			to: props.to,
			subject: props.subject,
			html: props.html || props.text,
			attachments: Object.entries(props.attachments || {}).map(([filename, content]) => ({
				filename, content
			}))
		}

		// 1. Generate raw message
		const compiledMail = mailcomposer(mail)
		const raw = await new Promise<Buffer>((resolve, reject) => {
			compiledMail.build((err: any, message: any) => {
				if (err) return reject(err)
				resolve(message)
			})
		})



		// 2. Send via SMTP
		await (transporter.sendMail(mail) as Promise<SentMessageInfo>)

		// 3. Append to "Sent"
		await saveEmailToSentFolder(raw)

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

const reconstructNestedObjectFromMultipart = (formData: Awaited<ReturnType<typeof readMultipartFormData>>): any => {
	const obj: Record<string, any> = {};

	if (!formData) return obj
	for (const field of formData) {
		// Files are stored as Buffers, texts as strings
		let value: string | Buffer

		try {
			value = field.name?.startsWith('attachments') ? field.data : field.data.toString();
		} catch (e) {
			value = field.data
		}
		if (field.name) setNestedValue(obj, field.name, value);
	}

	console.log(obj)

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
			html
		})

		console.log('response', response)

		return {
			statusCode: 200,
			body: response
		}
	} catch (error) {
		return error
	}
})