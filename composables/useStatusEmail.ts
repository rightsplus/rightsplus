// import { useI18n } from "#i18n"
import { type Database, type CaseStatus, type ClaimsForm, type ClaimState, type RowClaimExtended } from "~/types"
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


	const sendStatusEmail = async ({ status, claim, attachments, to }: { status: CaseStatus, claim: RowClaimExtended, attachments?: Record<string, Blob>, to?: string }) => {
		const id = uuid()
		try {
			const markdown = await getParsedMarkdown(status, claim)
			const recipientEmail = to || claim.client.email
			const sendMail = async (props: { content?: string, attachments?: Record<string, Blob> } = {}) => {
				await send({
					to: recipientEmail,
					subject: markdown.data.subject,
					template: "Status.vue",
					data: {
						...markdown.data,
						body: props.content || markdown.content
					},
					attachments: props.attachments || attachments
				})
				await supabase.rpc('append_to_protocol', {
					claim_id: claim.id,
					new_data: { timestamp: new Date().toISOString(), type: 'email', value: status }
				})
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
			console.error(err)
			return {
				id,
				status
			}
		}
	}

	const emails = {
		dataReceived: [
			{
				label: '"Daten erhalten"-Mail (erneut) versenden',
				handler: async (claim) => sendStatusEmail({ status: 'dataReceived', claim })
			}
		],
		rejected: [{
			label: "Wir nehmen den Fall nicht an",
			handler: (claim) => sendStatusEmail({ status: 'rejected', claim })
		}],
		awaitInitialAirlineResponse: [
			{
				label: "Wir nehmen den Fall an",
				handler: (claim, attachments) => {
					const pdf = attachments?.["assignment-agreement.pdf"]
					return sendStatusEmail({
						status: 'accepted', claim, attachments: pdf ? {
							"assignment-agreement.pdf": pdf
						} : undefined
					})
				},
			},
			{
				label: "Wir hanben hier einen Fall für euch!",
				handler: async (claim, attachments) => {
					try {
						const pdf = attachments?.["assignment-agreement.pdf"]
						const { email } = claim.booking.flight.airline
						if (!email) return // @todo: handle when airline has no email
						return sendStatusEmail({
							status: 'awaitInitialAirlineResponse', claim, attachments: pdf ? {
								"assignment-agreement.pdf": pdf
							} : undefined, to: email
						})
					} catch (err) {
						console.error(err)
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