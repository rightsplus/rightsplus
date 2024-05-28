import { useI18n } from "#i18n"
import type { CaseStatus, RowClaim } from "~/types"

const getStatus = ({ i18n, data }: { i18n: ReturnType<typeof useI18n>, data: RowClaim }) => {
	const { t } = i18n
	return {
		dataReceived: {
			preTitle: t('status.dataReceived.preTitle'),
			title: t('Wir sind dran!'),
			body: `
				<p>${t('letter.salutation.informal', data)}</p>
				<p>vielen Dank für die Beauftragung.</p>
				<p>Wir prüfen jetzt einen möglichen Entschädigungsanspruch aufgrund deiner Angaben und melden uns nach Abschluss der Prüfung bei dir.</p>
				<p>Nachfolgend haben wir die übermittelten Daten noch einmal zusammengefasst. Bitte prüfe, ob die Daten korrekt sind und teile uns zeitnah per E-Mail mit, wenn etwas nicht stimmt. Es ist wichtig, dass die Angaben wahrheitsgemäß, vollständig und ordnungsgemäß sind. Wenn alle Daten korrekt sind, brauchst du nichts weiter zu unternehmen.</p>
				<p>Übermittelte Daten:</p>
				<p>${data}</p>
				<p>Mit den folgenden Daten kannst du immer den Stand der Bearbeitung einsehen:</p>
				<p>Fallnummer<br />**#2890123**</p>
				<p>Buchungsnummer<br />**BD1238**</p>
				<p>${t('letter.regards.informal')}</p>
			`
		},
		paymentProcessed: {
			preTitle: "🎉",
			title: t('status.paymentProcessed.title'),
			body: [
				t('letter.salutation.informal', data),
				"Wir freuen uns, dir mitteilen zu können, dass wir deine Entschädigung erfolgreich durchgesetzt haben.",
				"Dein Geld ist bereits auf dem Weg zu dir. Du solltest es in den nächsten Tagen auf deinem Konto finden.",
				"Wir bedanken uns für dein Vertrauen. Wir würden uns freuen, wenn du uns weiterempfiehlst und wir in Zukunft wieder Ansprüche für dich oder Bekannte von dir durchsetzen können.",
				t('letter.regards.informal'),
			]
		}
	}
}


export const useStatusEmail = () => {
	const i18n = useI18n()
	return (status: CaseStatus, data) => getStatus({ i18n, data })[status]
}