import { useI18n } from "#i18n"
import type { CaseStatus, ClaimState, RowClaimExtended } from "~/types"
import type { Methods } from "~/composables/machine"

const getStatus = ({ i18n, data }: { i18n: ReturnType<typeof useI18n>, data: RowClaimExtended }): Record<CaseStatus, {}> => {
	const { t } = i18n
	return {
		dataReceived: {
			subject: t('status.dataReceived.subject'),
			preTitle: t('status.dataReceived.preTitle'),
			title: t('Wir sind dran!'),
			body: `
				<p>${t('letter.salutation.informal', data)}</p>
				<p>vielen Dank für die Beauftragung.</p>
				<p>Wir prüfen jetzt einen möglichen Entschädigungsanspruch aufgrund deiner Angaben und melden uns nach Abschluss der Prüfung bei dir.</p>
				<p>Nachfolgend haben wir die übermittelten Daten noch einmal zusammengefasst. Bitte prüfe, ob die Daten korrekt sind und teile uns zeitnah per E-Mail mit, wenn etwas nicht stimmt. Es ist wichtig, dass die Angaben wahrheitsgemäß, vollständig und ordnungsgemäß sind. Wenn alle Daten korrekt sind, brauchst du nichts weiter zu unternehmen.</p>
				<p>Übermittelte Daten:</p>
				<p>${Object.keys(data).join(', ')}</p>
				<p>Mit den folgenden Daten kannst du immer den Stand der Bearbeitung einsehen:</p>
				<p>Fallnummer<br />**${formatClaimId(data.id)}**</p>
				<p>Buchungsnummer<br />**${data.booking.number}**</p>
				<p>${t('letter.regards.informal')}</p>
			`
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



export const useStatusEmail = <Context, States extends string>() => {
	const i18n = useI18n()
	const { send } = useSendMail();

	const emails: Methods<Context, States> = {
		dataReceived: [
			{
				label: 'Send Data Received Email',
				handler: async (claim: RowClaimExtended) => {
					console.log('dataReceived', claim)
					const data = getStatus({ i18n, data: claim }).dataReceived
					console.log('data', data)
					send({
						to: claim.client.email,
						subject: data.subject,
						template: "Status.vue",
						data,
					})
				}
			}
		]
	} as const
	return {
		emails
	}
}