import type { Content } from "pdfmake/interfaces";
import { getField, spanColumns } from "~/plugins/pdfmake/pdf/template";
import { markdownToPdfMake, validateSVG } from "~/plugins/pdfmake/pdf/utils";
import type { RowClaimExtended } from "~/types";

export default ({ claim, i18n, content, preview }: { claim: RowClaimExtended, i18n: ReturnType<typeof useI18n>, content: Content[], preview?: boolean }) => {
	const { t, locale } = i18n

	const rect = {
		w: spanColumns(4.5),
		h: 40
	}
	const setSignature = !preview && claim.client.signature?.svg
	const signature = setSignature ? {
		svg: validateSVG(setSignature),
		fit: [rect.w, rect.h],
		width: 'auto',
		relativePosition: {
			x: -10,
			y: -5
		}
	} : {
		text: '',
		fontSize: 16,
		relativePosition: {
			y: 2
		}
	}
	console.log(preview, claim.client.signature?.svg, signature)
	const dateOfSignature = setSignature ? {
		content: [{
			text: getLocalizedDate(new Date(), locale.value),
			relativePosition: {
				y: 8
			}
		}]
	} : {}



	return [
		...content,
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
							text: t('date')
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
							text: t('signature'),
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