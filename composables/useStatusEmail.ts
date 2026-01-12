import type { Database, CaseStatus, RowClaimExtended } from "~/types"
import type { Methods } from "~/composables/useMachine"
import useCreatePdf from "~/plugins/pdfmake/useCreatePdf"
import assignmentAgreement from "~/plugins/pdfmake/pdf/documents/assignmentAgreement"

export default <Context extends RowClaimExtended>() => {
	const { send } = useSendMail();
	const supabase = useSupabaseClient<Database>()

	const { generatePDF } = useCreatePdf()
	const { queryLocaleContent } = useI18nContent('emails')

	const getParsedMarkdown = async (status: CaseStatus, claim: RowClaimExtended) => {
		const markdown = await queryLocaleContent(`/${claim.lang || 'de'}/${transformCamelToKebab(status)}`).first()
		return parseAndBindMarkdown(markdown?.rawbody || '', { ...claim, id: formatClaimId(claim.id) })
	}


	const sendStatusEmail = async ({ status, claim, attachments, to, immediate = true }: { status: CaseStatus, claim: RowClaimExtended, attachments?: Record<string, Blob>, to?: string, immediate?: boolean }) => {
		try {
			console.log('sending status email', status, claim, attachments, to)
			const markdown = await getParsedMarkdown(status, claim)
			console.log('markdown', markdown)
			const recipientEmail = to || claim.client.email
			console.log('recipientEmail', recipientEmail)
			const sendMail = async (props: { content?: string, attachments?: Record<string, Blob> } = {}) => {
				console.log('sending email', recipientEmail, markdown.data.subject, props.content, props.attachments)
				try {
					const response = await send({
						to: recipientEmail,
						subject: markdown.data.subject,
						template: "Status.vue",
						data: {
							...markdown.data,
							body: props.content || markdown.content
						},
						attachments: props.attachments || attachments
					})
					console.log('response', response)
					if (!response.ok) {
						throw new Error(response.statusText)
					}
					console.log('email sent', recipientEmail, markdown.data.subject, props.content, props.attachments)
					await supabase.rpc('append_to_protocol', {
						claim_id: claim.id,
						new_data: { timestamp: new Date().toISOString(), type: 'email', value: status }
					})
					console.log('email appended to protocol', recipientEmail, markdown.data.subject, props.content, props.attachments)
					return response
				} catch (err) {
					throw err
				}
			}
			if (immediate) {
				await sendMail()
			}
			return {
				recipientEmail,
				id: uuid(),
				status,
				markdown,
				attachments,
				sendMail
			}
		} catch (err) {
			throw err
		}
	}

	const emails = {
		dataReceived: [
			{
				label: '"Daten erhalten"-Mail (erneut) versenden',
				handler: async ({ context: claim, immediate, attachments }) => {
					console.log('sending dataReceived email', claim, attachments)
					return sendStatusEmail({
						status: 'dataReceived', claim, immediate, attachments
					})
				}
			}
		],
		rejected: [{
			label: "Wir nehmen den Fall nicht an",
			handler: ({ context: claim, immediate }) => sendStatusEmail({ status: 'rejected', claim, immediate })
		}],
		awaitInitialAirlineResponse: [
			{
				label: "Wir nehmen den Fall an (Kunden-Email)",
				handler: ({ context: claim, immediate, attachments }) => {
					const pdf = attachments?.["assignment-agreement.pdf"]
					return sendStatusEmail({
						status: 'accepted', claim, immediate, attachments: pdf ? {
							"assignment-agreement.pdf": pdf
						} : undefined
					})
				},
			},
			{
				label: "Wir hanben hier einen Fall für euch! (Airline-Email)",
				handler: async ({ context: claim, immediate, attachments }) => {
					try {
						const pdf = attachments?.["assignment-agreement.pdf"]
						const { email } = claim.booking.flight.airline
						if (!email) return // @todo: handle when airline has no email
						return sendStatusEmail({
							status: 'awaitInitialAirlineResponse', claim, immediate, attachments: pdf ? {
								"assignment-agreement.pdf": pdf
							} : undefined, to: email
						})
					} catch (err) {
						throw err
					}
				}
			},
		],
		// airlineRejected: [{
		// 	label: "",
		// 	handler: async () => { }
		// }]
	} as Partial<Methods<Context, CaseStatus, ReturnType<typeof sendStatusEmail>>>
	return {
		sendStatusEmail,
		emails,
		getParsedMarkdown
	}
}