export type Data = {
	data?: Record<string, string | undefined>;
}
export type GeneratePDFProps = Data & {
	template: string;
	fileName?: string;
}
export type SendPDFMailProps = Data & {
	to: string;
	subject: string;
	text?: string;
	template?: string;
	pdf?: GeneratePDFProps
}

export type SendMailProps = SendPDFMailProps & {
	html?: string;
	pdfBuffer?: Buffer;
}