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

const getStatus = ({ i18n, data }) => {
	const { t, n } = i18n
	console.log(data.reimbursment)
	return {
		paymentProcessed: {
			preTitle: "🎉",
			title: t('status.paymentProcessed.title'),
			paragraphs: [
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