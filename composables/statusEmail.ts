// import { useI18n } from "#i18n"
import type { CaseStatus, ClaimsForm, ClaimState, RowClaimExtended } from "~/types"
import type { Methods } from "~/composables/machine"
import useCreatePdf from "~/plugins/pdfmake/useCreatePdf"
import assignmentAgreement from "~/plugins/pdfmake/pdf/documents/assignmentAgreement"
import remarkStringify from "remark-stringify"
import { unified } from "unified"
import matter from 'gray-matter'

const getStatus = ({ i18n, data }: { i18n: ReturnType<typeof useI18n>, data: RowClaimExtended }): Partial<Record<CaseStatus, {}>> => {
	const { t } = i18n
	return {
		dataReceived: {
			subject: t('status.dataReceived.subject'),
			category: t('status.dataReceived.preTitle'),
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
		rejected: {
			body: `${t('letter.salutation.informal', { name: data.client.firstName })}\n
nach eingehender Prüfung des Sachverhaltes aufgrund der von Dir gemachten Angaben, müssen wir Dir leider mitteilen, dass wir ein weiteres Vorgehen unsererseits gegen die Fluggesellschaft als nicht für erfolgversprechend erachten. Aus diesem Grund müssen den Fall leider ablehnen.\n
Wir bedanken uns für die Beauftragung und das entgegengebrachte Vertrauen. Wir würden uns freuen, in Zukunft Ansprüche für Dich oder Bekannte von Dir durchsetzen zu können.\n
\n
Für Rückfragen stehen wir Dir gerne zur Verfügung.
Dein RIGHTS PLUS Team
`
		},
		completed: {
			category: "🎉",
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

function parseAndBindMarkdown(template: string, doc: Record<string, any>): { data: Record<string, string>, content: string } {
	// Replace placeholders in the rest of the content
	const resolvedVariables = template
		.replace(/{{\s*\$doc\.([\w.]+)\s*}}/g, (_, path) => {
			const value = path.split('.').reduce((acc, key) => acc && acc[key], doc);
			return value !== undefined ? String(value) : '';
		})

	// Extract front matter
	const [fullMatch, innerMatch] = resolvedVariables.match(/^---\\n([\s\S]*?)\\n---(\\n)*/) || [];
	const frontMatter: Record<string, string> = {};

	if (innerMatch) {
		const frontMatterLines = innerMatch.split('\\n');
		for (const line of frontMatterLines) {
			const [key, ...valueParts] = line.split(':');
			frontMatter[key.trim()] = valueParts.join(':').trim();
		}
	}

	const content = resolvedVariables
		.replace(fullMatch || '', '')
		.replaceAll('\\n', '<br />')

	return {
		data: frontMatter,
		content,
	};
}

const transformCamelToKebab = (str: string) => {
	return str.replace(/([A-Z])/g, '-$1').toLowerCase();
};

export const useStatusEmail = <Context extends RowClaimExtended, States extends CaseStatus>() => {
	const i18n = useI18n()
	const { send } = useSendMail();

	const { generatePDF } = useCreatePdf()
	const { queryLocaleContent } = useI18nContent('emails')

	const getParsedMarkdown = async (status: CaseStatus, claim: RowClaimExtended) => {
		const markdown = await queryLocaleContent(`/${claim.lang || 'de'}/${transformCamelToKebab(status)}`).first()
		return parseAndBindMarkdown(markdown?.rawbody || '', { ...claim, id: formatClaimId(claim.id) })
	}


	const sendStatusEmail = async (status: CaseStatus, claim: RowClaimExtended, attachment?: Blob) => {
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
				attachment
			})
		} catch (err) {
			console.error(err)
		}

	}

	const emails = {
		dataReceived: [
			{
				label: '"Daten erhalten"-Mail (erneut) versenden',
				handler: (claim) => sendStatusEmail('dataReceived', claim)
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
					sendStatusEmail('accepted', claim, pdf)
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
			handler: async () => {}
		}]
	} satisfies Partial<Methods<Context, CaseStatus>>
	return {
		emails
	}
}