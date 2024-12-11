import assignmentAgreement from './pdf/documents/assignmentAgreement'
import type { PDFPage } from 'pdf-lib'
import { measurements, getFooterHeight } from './pdf/utils'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { layoutAlternating, layoutLines, layoutRoundedCorderFrame, marks, styles } from './pdf/template'
import { theme } from '#tailwind-config'
const { colors } = theme

interface Documents {
	[key: string]: ArrayBuffer | Buffer | Uint8Array
}

interface CreatePdfProps extends TDocumentDefinitions {
	showMarks?: boolean,
	background?: any,
	header?: any,
}

export default () => {
	const i18n = useI18n()
	const ready = ref(false)
	const loading = ref(false)
	const pdfMake = ref()
	const claim = useClaim();

	onMounted(() => {
		import('pdfmake/build/pdfmake').then(async (e) => {
			pdfMake.value = e.default
			pdfMake.value.vfs = (await import('./pdf/vfsFonts')).default
			pdfMake.value.fonts = {
				Avenir: {
					normal: 'Avenir-Roman.ttf',
					bold: 'Avenir-Black.ttf',
				},
				Inter: {
					normal: 'Inter-Regular.ttf',
					bold: 'Inter-Bold.ttf',
				},
			}
			pdfMake.value.tableLayouts = {
				lines: layoutLines(9),
				linesCompact: layoutLines(7),
				linesSuperCompact: layoutLines(5),
				alternating: layoutAlternating([9, 9]),
				alternatingCompact: layoutAlternating([6, 7]),
				alternatingSuperCompact: layoutAlternating([6, 4]),
				alternatingUltraCompact: layoutAlternating([6, 3]),
				roundedCornerFrame: layoutRoundedCorderFrame(5),
			}
			ready.value = true
		})
	})

	async function createPdf(
		{ content,
			header,
			footer,
			pageMargins,
			background,
			info,
			showMarks,
			images,
			watermark }: CreatePdfProps
	) {
		const docDefinition: TDocumentDefinitions = {
			watermark,
			content,
			header,
			footer,
			info,
			images,
			background: [background, marks(showMarks)],
			pageSize: 'A4',
			pageMargins: pageMargins || [measurements.margin, measurements.margin, measurements.margin, measurements.margin + measurements.margin_x3 + getFooterHeight()],
			pageBreakBefore: (currentNode, followingNodesOnPage) => {
				return (
					currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
				)
			},
			defaultStyle: {
				font: 'Inter',
				fontSize: 10,
				lineHeight: 1.25,
				characterSpacing: -0.01,
				color: colors.neutral['800'],
			},
			styles
		}
		return pdfMake.value.createPdf(docDefinition)
	}

	const getPage = async (
		sheet: Promise<CreatePdfProps>,
	): Promise<Buffer> => {

		return new Promise(async (resolve) => {
			try {
				const pdf = await createPdf(await sheet)
				pdf.getBuffer(resolve)
			} catch (e) {
				console.log(e)
			}
		})
	}

	type SheetsProp = {
		assignmentAgreement?: (() => Promise<TDocumentDefinitions>) | false
		variant?: string | false
	}




	const collectFiles = async (documents: (keyof SheetsProp)[]) => {
		const files: Partial<Record<keyof SheetsProp, Buffer | Uint8Array | undefined>> = {};

		const awaitAndAssign = async (key: keyof SheetsProp, promise: Promise<Buffer | Uint8Array | undefined>) => {
			try {
				files[key] = await promise;
			} catch (error) {
				console.error(`Error fetching ${key}:`, error);
			}
		};

		const tasks = [];


		if (documents.includes('assignmentAgreement')) {
			tasks.push(awaitAndAssign('assignmentAgreement', getPage(assignmentAgreement(claim, i18n))));
		}

		// if (documents.includes('variant')) {
		// 	tasks.push(awaitAndAssign('variant', fetchToBuffer(getProductSheets(store.model, store.steps, store.rise, locale.value))));
		// }

		// Wait for all tasks to complete
		await Promise.all(tasks);

		return [files];
	};



	const getPDF = async (documents: (keyof SheetsProp)[], { download, filter }: { download?: string, filter?: (name: keyof SheetsProp, copiedPages: PDFPage[]) => void } = {}) => {
		const files = await collectFiles(documents)
		return Promise.all(files?.map(async file => {
			const pages = await mergePages(file, { order: documents, filter })
			const blob = await generateBlob(pages)
			if (download) invokeDownload(blob, download)
			return blob
		}))
	}

	const generatePDF = async (document: Promise<TDocumentDefinitions>, { download }: { download?: string } = {}) => {
		const page = await getPage(document)
		const pages = await mergePages({ page })
		const blob = await generateBlob(pages);
		if (download) invokeDownload(blob, download)
		return blob
	}


	const downloadSheet = (pages: (keyof SheetsProp)[] = ['summary', 'variant'], fileName = 'test') => {
		loading.value = true
		getPDF(pages, { download: fileName }).finally(() => loading.value = false)
	}
	return {
		downloadSheet,
		getPDF,
		generatePDF,
		ready,
		loading
	}
}



// utils
const fetchToBuffer = async (url: string) =>
	fetch(url).then((e) => e.arrayBuffer().then(convertToUint8Array))

const convertToUint8Array = (buffer: ArrayBuffer) => {
	const array = new Uint8Array(buffer)
	if (array.length > 4000) return array
}
const generateBlob = (pdf: string): Promise<Blob> => {
	const linkSource = `data:application/pdf;base64,${pdf}`
	return new Promise((resolve, reject) => {
		fetch(linkSource)
			.then((response) => response.blob().then(resolve))
			.catch((e) => reject(e))
	})
}


const invokeDownload = (blob: Blob, fileName: string) => {
	const link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	link.download = fileName
	link.click()
	URL.revokeObjectURL(link.href)
}

// internal
const mergePages = async <D extends Documents, K extends keyof D>(documents: D, options?: {
	order?: K[]
	filter?: (document: K, copiedPages: PDFPage[]) => void
}) => {
	const { PDFDocument } = await import('pdf-lib')
	const mergedPdf = await PDFDocument.create()
	const list = options?.order || Object.keys(documents) as K[]
	for (const key of list) {
		const content = documents[key]
		if (!(content instanceof Uint8Array) && !(content instanceof ArrayBuffer))
			continue
		try {
			const pdf = await PDFDocument.load(content)
			const copiedPagesMerge = await mergedPdf.copyPages(
				pdf,
				pdf.getPageIndices()
			)

			options?.filter?.(key, copiedPagesMerge)

			copiedPagesMerge.forEach((page) => mergedPdf.addPage(page))
		} catch (e) {
			console.error(e)
		}
	}
	return await mergedPdf.saveAsBase64()
}
