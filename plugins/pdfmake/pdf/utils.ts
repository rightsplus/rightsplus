import { rectImage, roundImage, spanColumns, styles } from "./template"
import type { TDocumentDefinitions } from "pdfmake/interfaces"
import { theme } from '#tailwind-config'
const { colors } = theme

export const measurements = {
	"mm": 2.835,
	"margin": 56.70,
	"margin_x2": 35.04,
	"margin_x3": 21.66,
	"margin_x4": 13.39,
	"margin_x5": 8.27,
	"margin_x6": 5.11,
	"columnWidth": 29.16,
	"columnGap": 12,
	"firstColumn": 357.96,
	"secondColumn": 111.49
}

const { mm } = measurements

export function getAddress({ state, recipient, to, from, omit, only }: GetAddressProps, i18n: ReturnType<typeof useI18n>) {
	const partnerDetails = state?.partner
	if (partnerDetails && state?.client || !to) {
		to = recipient === 'partner' ? partnerDetails : state?.client
	}
	if (partnerDetails && state?.client || !from) {
		from = recipient === 'partner' ? state?.client : partnerDetails
	}

	if (!omit?.length) omit = []
	if (only === 'address') {
		omit.push('company', 'name')
	} else if (only === 'name') {
		omit.push('streetAddress', 'zip', 'city', 'country')
	}
	// if (sameCountry && only !== 'name') omit.push('country')

	return {
		from: addressBlock(from, omit, i18n),
		to: addressBlock(to, omit, i18n),
	}
}
export interface PartnerDetails {
	logo?: string
	logoFooter?: string,
	address?: {
		company?: string,
		name: string,
		streetAddress: string,
		zip: string,
		city: string,
		country?: string,
	}
	contact?: {
		phone?: string,
		email?: string,
		url?: string,
	},
	taxInformation?: {
		tradeRegisterDepartment?: string,
		taxNumber?: string,
		vatNumber?: string,
	},
	bankInformation?: {
		bankName?: string,
		iban?: string,
		bic?: string,
	}
}

export function addressBlock(details: PartnerDetails, omit: string[] = [], i18n: ReturnType<typeof useI18n>) {
	const d = { ...details.address }
	omit.forEach(e => delete d[e as keyof typeof d])
	return d
		? [
			d.company?.trim(),
			d.name?.trim(),
			d.streetAddress,
			[d.zip, d.city].filter(Boolean).join(' '),
			d.country,
		].filter(Boolean)
		: []
}
export function contactBlock(details: PartnerDetails) {
	return details.contact
		? [
			details.contact.phone,
			details.contact.email,
			details.contact.url,
		].filter(Boolean)
		: []
}
export function taxBlock(details: PartnerDetails, i18n: ReturnType<typeof useI18n>) {
	return details.taxInformation
		? [
			details.taxInformation.tradeRegisterDepartment,
			`${i18n.t('taxNumber')}: ${details.taxInformation.taxNumber
			}`,
			`${i18n.t('vatNumber')}: ${details.taxInformation.vatNumber
			}`,
		]
		: []
}
export function bankBlock(details: PartnerDetails) {
	return Object.values(details.bankInformation?.iban || {}).length
		? [
			details.bankInformation?.bankName,
			`IBAN: ${details.bankInformation?.iban
				?.replace(/\s+/g, '')
				.replace(/(.{4})/g, '$1 ')
				.trim()}`,
			`BIC: ${details.bankInformation?.bic}`,
		]
		: []
}
export interface QuoteSettings {
	title: string,
	totalDiscount?: boolean,
	singleDiscount?: boolean,
	openConfiguration?: boolean,
	hiddenSurcharge?: boolean,
	mergeShipping?: boolean,
	customPositions?: boolean,
	vatType?: 'default' | '1a' | '1b' | 'vatFree' | 'custom',
	vat?: number,
	currency?: string,
	paymentConditions?: string,
	shippingPrice?: number,
	letter?: {
		main?: boolean,
		installationRecommendation?: boolean,
		support?: boolean,
		terms?: boolean,
		message?: boolean,
		clerk?: boolean,
	},
	details?: {
		from?: PartnerDetails,
		to?: PartnerDetails,
	}
}

export function getSvgDimensionsRatio(svgString: string): number {
	const regex = /<svg[^>]*width\s*=\s*['"]?(\d+(\.\d+)?)px['"]?[^>]*height\s*=\s*['"]?(\d+(\.\d+)?)px['"]?[^>]*>/;
	const match = svgString.match(regex);

	if (match && match.length === 5) {
		const width = parseFloat(match[1]);
		const height = parseFloat(match[3]);

		if (!isNaN(width) && !isNaN(height)) {
			return width / height;
		}
	}
	return 1
}

// 	throw new Error('Invalid SVG or unable to extract dimensions.');
// }
export function getFooterHeight(blocks?: { stack?: any[]; width?: number; columns?: { stack: any[] }[] }[]) {
	if (!blocks?.length) return 3 * 8

	const stackSizes = blocks.map(e => {
		if ('stack' in e) {
			return e.stack?.length || 0
		} else if ('columns' in e) {
			return e.columns?.filter(Boolean)?.find(f => ('stack' in f) && f.stack)?.stack.length || 0
		} else {
			return 0
		}
	})
	return Math.max(...stackSizes) * 6 + 10
}
export function getFooterBlocks(i18n: ReturnType<typeof useI18n>, settings?: QuoteSettings) {
	if (!settings?.details) return []

	const keys = ['address', 'contact', 'taxInformation', 'bankInformation'].map(key => Object.values(settings.details.from[key] || {}).some(Boolean) && key).filter(Boolean)
	const span = 12 / keys.length

	interface Column {
		width: number | string,
		svg?: string,
		fit?: [number, number],
		stack?: (string | { text: string, bold: boolean })[],
		margin?: number[],
	}

	const logoSVG = settings.details.from?.logoFooter || settings.details.from?.logo
	const logoWidth = logoSVG ? Math.min(2, getSvgDimensionsRatio(logoSVG)) : 0
	const logo: Column | null = logoSVG
		? {
			width: spanColumns(logoWidth),
			svg: logoSVG,
			fit: [spanColumns(logoWidth), measurements.margin_x2 - 5],
			margin: [0, 2, 0, 0]
		}
		: null

	const address = {
		width: spanColumns(span - logoWidth),
		stack: getAddress({ from: settings.details.from, to: settings.details.to }, i18n).from as (string | { text: string, bold: boolean })[],
	}

	if (settings.details.from?.address?.name) {
		address.stack[0] = {
			text: settings.details.from.address.name,
			bold: true,
		}
	}

	const footerBlocks = {
		address: {
			columns: [logo, address] as const
		},
		contact: {
			stack: contactBlock(settings.details.from),
		},
		taxInformation: {
			stack: taxBlock(settings.details.from, i18n),
		},
		bankInformation: {
			stack: bankBlock(settings.details.from),
		},
	}

	return keys.map((key) => ({
		...footerBlocks[key],
		width: spanColumns(span)
	}))
}


export function getFooter({ settings, blocks, i18n }: {
	settings?: QuoteSettings,
	blocks?: any[],
	i18n: ReturnType<typeof useI18n>
}): TDocumentDefinitions['footer'] {
	const footerBlocks = getFooterBlocks(i18n, settings)
	const contentHeight = getFooterHeight(blocks || footerBlocks)
	const paddingY = measurements.margin_x3
	const footerHeight = measurements.margin_x2 * 2 + contentHeight

	return {
		absolutePosition: { x: 0, y: contentHeight * -1 },
		stack: [
			{
				canvas: [
					{
						type: "rect",
						x: 0,
						y: 0,
						w: 210 * mm,
						h: footerHeight,
						color: colors.gray[100],
					},
				],
				absolutePosition: { x: 0, y: paddingY },
			},
			{
				columns: blocks || footerBlocks,
				columnGap: measurements.columnGap,
				fontSize: 7,
				margin: [measurements.margin, measurements.margin + paddingY],
			},
		],
	};
}

type TableType = {
	baseList: { name: string, label: string[], value: string }[],
	generalList: Record<string, { text: string, asterisk?: boolean }>,
	specificSheet: boolean,
	width: number,
	headerStyle?: (keyof typeof styles) | false,
	aside?: boolean,
	belowTable?: boolean,
	layout?: 'alternatingSuperCompact' | 'alternatingCompact',
	columnsWidths?: [number | string, number | string],
	margin?: number[]
}

export async function technicalDetailsTable({ baseList, generalList, specificSheet, width, headerStyle, belowTable, aside, columnsWidths, layout, margin }: TableType, i18n: ReturnType<typeof useI18n>) {


	const list = specificSheet ? baseList : baseList.map((item) => {
		const element = generalList[item.name]
		const text = typeof element === 'string' ? element : element?.text
		const value = [text || item.value, element?.asterisk ? '*' : ''].filter(Boolean).join(' ')
		return {
			label: item.label,
			value,
		}
	}) as {
		label: string[],
		value: string
	}[]

	const table = list.map((item) => {
		return [
			{
				text: item.label,
				bold: true,
			},
			{
				text: item.value,
			},
		]
	})

	return {
		margin,
		columnGap: measurements.columnGap,
		columns: [
			{
				width: spanColumns(width),
				stack: [
					{
						text: i18n.t('technicalData'),
						style: headerStyle || 'smallHeader',
						margin: [0, 0, 0, measurements.margin_x5],
					},
					{
						layout: layout || 'alternatingSuperCompact',
						width: spanColumns(width),
						table: {
							dontBreakRows: true,
							widths: columnsWidths || ['auto', '*'],
							body: table,
						},
					},
					belowTable,
				],
			},
			aside
		],
	}
}


export const validateSVG = (svg: string) => {
	const doc = new DOMParser().parseFromString(svg, 'text/html')
	return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1)
		? svg
		: null
}


export async function smallHeader(header: string, currentPage: number) {
	// const logo = {
	// 		svg: validateSVG(await (await fetch('/img/logos/example.svg')).text()),
	// 		fit: [80, 20],
	// 		margin: [0, 0, 0, measurements.margin_x6],
	// 	}

	return currentPage !== 1 ? {
		stack: [
			// logo,
			{
				text: '',
				style: 'model',
				fontSize: 12,
			},
		],
		relativePosition: { x: measurements.margin, y: measurements.margin },
	} : {}
}

async function headerImage(sources: string[], margin: number, gap: number) {
	const columnWidth = ((210 * mm) - (margin * 2) - ((sources.length - 1) * gap)) / sources.length
	const images = []
	for (const src of sources) {
		images.push({
			width: '*',
			stack: [await rectImage(src, columnWidth, 80 * mm, 0)],
		})
	}
	return images
}

export async function dataSheetHead(title: string, heroImages: string[]) {
	const logo = {
		svg: '',
		fit: [150, 40],
		margin: [0, 0, 0, measurements.margin_x5],
		alignment: 'center'
	}
	return {
		stack: [
			{
				width: spanColumns(8),
				columns: [
					...(await headerImage(heroImages, measurements.margin, measurements.margin_x4)),
				],
				columnGap: measurements.margin_x4,
			},
			{
				stack: [
					'',
					{
						text: title,
						style: 'model',
						alignment: 'center'
					},
				],
				margin: [
					0,
					measurements.margin_x3,
				],
			},
		],
	}
}


export const formatIcon = (icon: string) => {
	const iconWithStroke = icon
		.replace(/class="cls-1"/g, `fill="none" stroke="${colors.gray['500']}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"`)
		.replace(/class="cls-2"/g, `fill="${colors.gray['500']}" stroke="${colors.gray['500']}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"`)
		.replace(/class="cls-3"/g, `fill="${colors.gray['500']}" stroke-width="0" `)
		.replace(/class="negative"/g, `fill="none" stroke="white" stroke-width="1" `)
	return iconWithStroke
}

export const getIcon = (icon: string, iconSize: number) => {
	return {
		width: spanColumns(1.25),
		svg: formatIcon(icon),
		fit: [spanColumns(iconSize), spanColumns(iconSize)],
		alignment: 'center',
		margin: [4, 0, -4, 0],
	}
}


export const imageText = (image: { svg?: string }, text: string) => {
	const imgSize = 0.6
	return [
		{
			stack: [
				image,
			],
			width: spanColumns(imgSize),
		},
		{
			text,
			margin: [
				spanColumns(imgSize) / 4,
				spanColumns(imgSize) / 4,
				0,
				0,
			],
		},
	]
}


export const sidebarHeader = (text: string) => {
	return {
		text,
		style: 'subHeader',
		margin: [0, 0, 0, measurements.margin_x5],
	}
}

const imgSize = 0.55
export const getMaterials = async (i18n: ReturnType<typeof useI18n>, margin?: number[], marginAfter?: number[]) => {
	const { t } = i18n
	const materialsList = [
		sidebarHeader(t('material')),
		{
			stack: [{
				columns: imageText(
					await roundImage('img/multiplex-birch.jpg', spanColumns(imgSize)), t('materials.multiplex-birch.label')),
				margin: margin || [0, 0, 0, measurements.margin_x6],
			}],
			margin: marginAfter || [0, 0, 0, measurements.margin_x4],
		}]
	return materialsList
}

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import type { Content } from 'pdfmake/interfaces';

/**
 * Converts Markdown to pdfmake-styled text.
 * @param markdown - The Markdown input string.
 * @returns An array of pdfmake-styled objects.
 */
export function markdownToPdfMake(markdown: string): Content[] {
	const processor = unified().use(remarkParse);
	const tree = processor.parse(markdown);

	const pdfmakeContent: Content[] = [];

	/**
	 * Recursively processes nodes to build pdfmake content.
	 * @param node - The AST node to process.
	 * @param parentStyle - The style inherited from the parent node.
	 */
	const processNode = (node: any, parentStyle: Partial<Content> = {}): void => {
		switch (node.type) {
			case 'text':
				pdfmakeContent.push({ text: node.value, ...parentStyle });
				break;
			case 'strong':
				node.children.forEach((child: any) =>
					processNode(child, { bold: true, ...parentStyle })
				);
				break;
			// case 'emphasis':
			//   node.children.forEach((child: any) =>
			//     processNode(child, { italics: true, ...parentStyle })
			//   );
			//   break;
			case 'heading':
				const headingStyles: Record<number, Partial<Content>> = {
					1: { fontSize: 24, bold: true },
					2: { fontSize: 20, bold: true },
					3: { fontSize: 18, bold: true },
				};
				const style = headingStyles[node.depth] || {};
				node.children.forEach((child: any) => processNode(child, style));
				break;
			case 'paragraph':
				const paragraphContent: Content[] = [];
				node.children.forEach((child: any) => {
					const currentLength = pdfmakeContent.length;
					processNode(child);
					paragraphContent.push(...pdfmakeContent.splice(currentLength));
				});
				pdfmakeContent.push({ text: paragraphContent });
				break;
			case 'list':
				const listItems = node.children.map((child: any) => {
					const itemContent: Content[] = [];
					child.children.forEach((itemChild: any) => processNode(itemChild));
					return itemContent.map((c) => (c as { text: string }).text || '');
				});
				const listType = node.ordered ? 'ol' : 'ul';
				pdfmakeContent.push({ [listType]: listItems });
				break;
			default:
				if (node.children) {
					node.children.forEach((child: any) => processNode(child, parentStyle));
				}
		}
	};

	tree.children.forEach((node: any) => processNode(node));

	return pdfmakeContent;
}


export function hsl2hex(hsl: string) {
	if (hsl.includes('#')) return hsl
	const hslArr = hsl
		.match(/\d+/g)
		?.map(num => parseInt(num));
	if (!hslArr) return hsl
	const [h, s] = hslArr
	let [, , l] = hslArr
	l /= 100;
	const a = s * Math.min(l, 1 - l) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, '0'); // convert to Hex and prefix "0" if needed
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}