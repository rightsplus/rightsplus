// import { useI18n } from "#i18n"
import { type Database, type CaseStatus, type ClaimsForm, type ClaimState, type RowClaimExtended } from "~/types"
import type { Methods } from "~/composables/machine"
import useCreatePdf from "~/plugins/pdfmake/useCreatePdf"
import assignmentAgreement from "~/plugins/pdfmake/pdf/documents/assignmentAgreement"


export const useStatusEmail = <Context extends RowClaimExtended>() => {
	const i18n = useI18n()
	const { send } = useSendMail();
	const supabase = useSupabaseClient<Database>()

	const { generatePDF } = useCreatePdf()
	const { queryLocaleContent } = useI18nContent('emails')

	const getParsedMarkdown = async (status: CaseStatus, claim: RowClaimExtended) => {
		const markdown = await queryLocaleContent(`/${claim.lang || 'de'}/${transformCamelToKebab(status)}`).first()
		return parseAndBindMarkdown(markdown?.rawbody || '', { ...claim, id: formatClaimId(claim.id) })
	}


	const sendStatusEmail = async ({ status, claim, attachments, to }: { status: CaseStatus, claim: RowClaimExtended, attachments?: Record<string, Blob>, to?: string }) => {
		try {

			const { content, data } = await getParsedMarkdown(status, claim)

			await send({
				to: to || claim.client.email,
				subject: data.subject,
				template: "Status.vue",
				data: {
					...data,
					body: content
				},
				attachments
			})
			const res = await supabase.rpc('append_to_protocol', {
				claim_id: claim.id,
				new_data: { timestamp: new Date().toISOString(), type: 'email', value: status }
			})
			console.log(res)
		} catch (err) {
			console.error(err)
		}

	}

	const emails = {
		dataReceived: [
			{
				label: '"Daten erhalten"-Mail (erneut) versenden',
				handler: async (claim) => {
					sendStatusEmail({ status: 'dataReceived', claim })
				}
			}
		],
		rejected: [{
			label: "Wir nehmen den Fall nicht an",
			handler: (claim) => sendStatusEmail({ status: 'rejected', claim })
		}],
		awaitInitialAirlineResponse: [
			{
				label: "Wir nehmen den Fall an",
				handler: async (claim) => {
					const pdf = await generatePDF(assignmentAgreement(claim.client, {
						id: claim.id,
						flight: claim.booking.flight.data
					}, i18n))
					sendStatusEmail({ status: 'accepted', claim, attachments: { 'assignmentAgreement.pdf': pdf } })
				}
			},
			{
				label: "Wir hanben hier einen Fall für euch!",
				handler: async (claim) => {
					try {
						const { email } = claim.booking.flight.airline
						if (!email) return // @todo: handle when airline has no email
						const pdf = await generatePDF(assignmentAgreement(claim.client, {
							id: claim.id,
							flight: claim.booking.flight.data
						}, i18n))
						sendStatusEmail({ status: 'awaitInitialAirlineResponse', claim, attachments: { 'assignmentAgreement.pdf': pdf }, to: email })
					} catch (err) {
						console.error(err)
					}
				}
			},
		],
		airlineRejected: [{
			label: "",
			handler: async () => { }
		}]
	} satisfies Partial<Methods<Context, CaseStatus>>
	return {
		emails
	}
}