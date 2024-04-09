import { useI18n } from "#i18n"

type Statuses = "dataReceived"
	| "compensationClaimChecked"
	| "orderRejected"
	| "reminderForAssignmentDeclaration"
	| "assignmentDeclarationReceived"
	| "airlineContacted"
	| "lawFirmEngaged"
	| "compensationClaimSecured"
	| "lawsuitFiled"
	| "compensationClaimSecuredLawsuit"
	| "paymentProcessed"
	| "legalDisputeLost"
	| "other"

const getStatus = ({ i18n, data }: { i18n: ReturnType<typeof useI18n> }) => {
	const { t } = i18n
	return {
		dataReceived: {
			preTitle: t('status.dataReceived.preTitle'),
			title: t('status.paymentProcessed.title'),
			body: `
				<p>${t('letter.salutation.informal', data)}</p>
				<p>Wir freuen uns, dir mitteilen zu können, dass wir deine Entschädigung erfolgreich durchgesetzt haben.</p>
				<p>Danke für dein Vertrauen in RightsPlus.</p>
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
	return (status: Statuses, data) => getStatus({ i18n, data })[status]
}