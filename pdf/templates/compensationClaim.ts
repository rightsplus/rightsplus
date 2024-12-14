import { getField, spanColumns } from "~/plugins/pdfmake/pdf/template";
import { markdownToPdfMake, validateSVG } from "~/plugins/pdfmake/pdf/utils";
import type { RowClaimExtended } from "~/types";

export default ({ claim, i18n }: { claim: RowClaimExtended, i18n: ReturnType<typeof useI18n> }) => {
	const { t, locale } = i18n
	const { firstName, lastName, address } = claim.client
	const name = [firstName, lastName].join(" ")
	const { street, postalCode, city } = address

	const dateOfSignature = claim.client.signature?.svg ? {
		content: [{
			text: getLocalizedDate(new Date(), locale.value),
			relativePosition: {
				y: 8
			}
		}]
	} : {}

	const rect = {
		w: spanColumns(4.5),
		h: 40
	}
	const signature = claim.client.signature?.svg ? {
		svg: validateSVG(claim.client.signature?.svg),
		fit: [rect.w, rect.h],
		width: 'auto',
		relativePosition: {
			x: -10,
			y: -5
		}
	} : {
		text: '×',
		fontSize: 20,
		relativePosition: {
			y: 2
		}
	}

	const flightNumber = claim.booking?.flight.iata
	const flightDate = claim.booking.flight.scheduledDeparture
	const departure = claim.booking.flight.airportDeparture
	const arrival = claim.booking.flight.airportArrival

	return [
		markdownToPdfMake(t('assignmentLetter.main', {
			addressBlock: ['<br />', '<br />', `**${name}**`, `**${street}**`, `**${[postalCode, city].join(" ")}**`, '<br />', '<br />'].join("\n"),
			flight: ['<br />', [`**${flightNumber}**`, t("on"), `**${new Date(flightDate as string).toLocaleDateString()}**`].join(' ')].join('\n'),
			airports: ['<br />', [t("from"), `**${departure}**`, t("to"), `**${arrival}**`].join(' '), '<br />', '<br />'].join('\n'),
			rightsPlus: `**RightsPlus GbR**`
		})),
		'\n',
		t('assignmentLetter.compensation'),
		'\n',
		t('assignmentLetter.claimant'),
		'\n',
		t("assignmentLetter.declaration", {
			rightsPlus: "RightsPlus GbR",
			partner: "Joachim Bawa",
		}),
		{
			columns: [
				// Left rectangle with "Ort, Datum"
				{
					stack: [
						getField({
							...rect, ...dateOfSignature,
							fieldOptions: {
								margin: [0, 0, 0, 5],
							},
						}),
						{
							text: 'Ort, Datum',
						},
					],
					width: '*', // Column takes 40% of the total width
				},
				// Right rectangle with "Unterschrift"
				{
					stack: [
						getField({
							...rect,
							fieldOptions: {
								margin: [0, 0, 0, 5],
							},
							content: [signature]
						}),
						{
							text: 'Unterschrift',
						},
					],
					width: '*', // Column takes 50% of the total width
				},
			],
			columnGap: 10, // Gap between the two rectangles
			margin: [0, 20], // Margin from the top
		},
	]
}