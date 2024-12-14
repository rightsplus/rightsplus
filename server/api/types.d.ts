import type { Attachment } from "nodemailer/lib/mailer";

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
	// attachments?: { filename: string; content: Blob }[]
	attachments?: Record<string, Blob>
}

export type SendMailProps = Omit<SendPDFMailProps, 'attachments'> & {
	html?: string;
	attachments?: Record<string, Blob>
	// attachmentArray?: Attachment[];
}

declare module 'nodemailer' {
	namespace Mail {

		interface AttachmentLike {
			content?: AttachmentLike['content'] & Blob
		}
	}
}