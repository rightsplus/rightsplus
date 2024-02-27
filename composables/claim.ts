export type SendPDFMailProps = {
	to: string;
	subject: string;
	text?: string;
	template?: string;
	pdf?: {
		template: string;
		fileName: string;
	};
	data?: Record<string, string>;
}
export const useSendMail = () => {
	const send = async (props: SendPDFMailProps) => {
		const response = await fetch("/api/mail", {
			method: "POST",
			headers: useRequestHeaders(["cookie"]),
			body: JSON.stringify(props),
		});
		return response;
	};
	return { send };
}