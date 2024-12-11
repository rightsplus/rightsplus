// import { useI18n } from "#i18n"
import type { CaseStatus, ClaimsForm, ClaimState, RowClaimExtended } from "~/types"
import type { Methods } from "~/composables/machine"
import useCreatePdf from "~/plugins/pdfmake/useCreatePdf"
import assignmentAgreement from "~/plugins/pdfmake/pdf/documents/assignmentAgreement"

const getStatus = ({ i18n, data }: { i18n: ReturnType<typeof useI18n>, data: RowClaimExtended }): Partial<Record<CaseStatus, {}>> => {
	const { t } = i18n
	return {
		dataReceived: {
			subject: t('status.dataReceived.subject'),
			preTitle: t('status.dataReceived.preTitle'),
			title: t('Wir sind dran!'),
			body: `${t('letter.salutation.informal', { name: data.client.firstName })}\n
vielen Dank für die Beauftragung.\n
Wir prüfen jetzt einen möglichen Entschädigungsanspruch aufgrund deiner Angaben und melden uns nach Abschluss der Prüfung bei dir.\n
Nachfolgend haben wir die übermittelten Daten noch einmal zusammengefasst. Bitte prüfe, ob die Daten korrekt sind und teile uns zeitnah per E-Mail mit, wenn etwas nicht stimmt. Es ist wichtig, dass die Angaben wahrheitsgemäß, vollständig und ordnungsgemäß sind. Wenn alle Daten korrekt sind, brauchst du nichts weiter zu unternehmen.\n
Übermittelte Daten:\n
${Object.keys(data).join(', ')}\n
Mit den folgenden Daten kannst du immer den Stand der Bearbeitung einsehen:\n
Fallnummer\n
**${formatClaimId(data.id)}**\n
Buchungsnummer\n
**${data.booking.number}**\n
${t('letter.regards.informal')}`
		},
		completed: {
			preTitle: "🎉",
			title: t('status.paymentProcessed.title'),
			body: [
				t('letter.salutation.informal', data),
				"Wir freuen uns, dir mitteilen zu können, dass wir deine Entschädigung erfolgreich durchgesetzt haben.",
				"Dein Geld ist bereits auf dem Weg zu dir. Du solltest es in den nächsten Tagen auf deinem Konto finden.",
				"Wir bedanken uns für dein Vertrauen. Wir würden uns freuen, wenn du uns weiterempfiehlst und wir in Zukunft wieder Ansprüche für dich oder Bekannte von dir durchsetzen können.",
				t('letter.regards.informal'),
			]
		},
		awaitInitialAirlineResponse: {
		}
	}
}



export const useStatusEmail = <Context extends RowClaimExtended, States extends CaseStatus>() => {
	const i18n = useI18n()
	const { send } = useSendMail();

	const { generatePDF } = useCreatePdf()


	const emails: Partial<Methods<Context, CaseStatus>> = {
		dataReceived: [
			{
				label: 'Send Data Received Email',
				handler: async (claim: RowClaimExtended) => {
					const data = getStatus({ i18n, data: claim }).dataReceived
					try {
						const pdf = await generatePDF(assignmentAgreement(claim.client, {
							id: claim.id,
							flight: claim.booking.flight.data
						}, i18n))

						send({
							to: claim.client.email,
							subject: 'Daten erhalten',
							template: "Status.vue",
							data,
							attachment: pdf
						})
					} catch (err) {
						console.error(err)
					}
				}
			}
		],
		awaitInitialAirlineResponse: [{
			label: "Wait for Airline",
			handler: () => {
				return new Promise(() => {})
			}
		}]
	} as const
	return {
		emails
	}
}