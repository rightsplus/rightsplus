import type { SendPDFMailProps, GeneratePDFProps } from "~/server/api/types";
import type { ClaimsForm } from "~/types";


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

async function streamToPdfLink(pdfStream: ReadableStream<Uint8Array> | null): Promise<{ blob: Blob, url: string }> {
	if (!pdfStream) {
		throw new Error('no stream')
	}

	const reader = pdfStream.getReader();
	const chunks: Uint8Array[] = [];

	while (true) {
		const { value, done } = await reader.read();
		if (done) break;
		chunks.push(value);
	}

	const blob = new Blob(chunks, { type: 'application/pdf' });
	const url = URL.createObjectURL(blob);

	return { blob, url }
}

export const useGeneratePDF = () => {
	const generate = async (props: GeneratePDFProps) => {
		const response = await fetch("/api/pdf", {
			method: "POST",
			headers: useRequestHeaders(["cookie"]),
			body: JSON.stringify(props),
		});

		return streamToPdfLink(response.body);
	};
	return { generate };
}



const getCompensation = (claim: ClaimsForm) => {
	const distance = getDistance(claim)
	let compensation = 250
	if (distance > 1500) compensation = 400
	const beyondEU = [claim.airport.departure, claim.airport.arrival].some(e => !e.ec261)
	if (distance > 3500 && beyondEU) compensation = 600
	return { compensation, distance }
}
export const useReimbursment = () => {
	const claim = useClaim()
	const compensation = ref(0);
	const distance = ref(0);
	watch(claim.airport, () => {
		const { compensation: c, distance: d } = getCompensation(claim)
		compensation.value = c
		distance.value = d
	}, { immediate: true, deep: true})
	return { compensation, distance }
}