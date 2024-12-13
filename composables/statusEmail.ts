// import { useI18n } from "#i18n"
import type { CaseStatus, ClaimsForm, ClaimState, RowClaimExtended } from "~/types"
import type { Methods } from "~/composables/machine"
import useCreatePdf from "~/plugins/pdfmake/useCreatePdf"
import assignmentAgreement from "~/plugins/pdfmake/pdf/documents/assignmentAgreement"


export const useStatusEmail = <Context extends RowClaimExtended>() => {
	const i18n = useI18n()
	const { send } = useSendMail();

	const { generatePDF } = useCreatePdf()
	const { queryLocaleContent } = useI18nContent('emails')

	const getParsedMarkdown = async (status: CaseStatus, claim: RowClaimExtended) => {
		const markdown = await queryLocaleContent(`/${claim.lang || 'de'}/${transformCamelToKebab(status)}`).first()
		return parseAndBindMarkdown(markdown?.rawbody || '', { ...claim, id: formatClaimId(claim.id) })
	}


	const sendStatusEmail = async (status: CaseStatus, claim: RowClaimExtended, attachments?: Record<string, Blob>) => {
		try {

			const { content, data } = await getParsedMarkdown(status, claim)

			send({
				to: claim.client.email,
				subject: data.subject,
				template: "Status.vue",
				data: {
					...data,
					body: content
				},
				attachments
			})
		} catch (err) {
			console.error(err)
		}

	}

	const emails = {
		dataReceived: [
			{
				label: '"Daten erhalten"-Mail (erneut) versenden',
				handler: async (claim) => {
					sendStatusEmail('dataReceived', claim)
				}
			}
		],
		rejected: [{
			label: "Wir nehmen den Fall nicht an",
			handler: (claim) => sendStatusEmail('rejected', claim)
		}],
		awaitInitialAirlineResponse: [
			{
				label: "Wir nehmen den Fall an",
				handler: async (claim) => {
					const pdf = await generatePDF(assignmentAgreement(claim.client, {
						id: claim.id,
						flight: claim.booking.flight.data
					}, i18n))
					sendStatusEmail('accepted', claim, { 'assignmentAgreement.pdf': pdf })
				}
			},
			{
				label: "Wir hanben hier einen Fall für euch!",
				handler: async (claim) => {
					try {
						const { content, data } = await getParsedMarkdown('awaitInitialAirlineResponse', claim)
						const { email } = claim.booking.flight.airline
						if (!email) return
						send({
							to: email,
							subject: data.subject,
							template: "Status.vue",
							data: {
								...data,
								body: content
							},
						})
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