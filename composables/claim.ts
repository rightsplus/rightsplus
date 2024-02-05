
type SendMailProps = {
	to: string;
	subject?: string;
	text?: string;
	template?: string;
	pdfRoute?: string;
	data?: Record<string, string>;
}
export const useSendMail = () => {
	const send = async (props: SendMailProps) => {
		const response = await fetch("/api/mail", {
			method: "POST",
			headers: useRequestHeaders(["cookie"]),
			body: JSON.stringify(props),
		});
		return response;
	};
	return { send };
}