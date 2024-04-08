import type { SendPDFMailProps, GeneratePDFProps } from "~/server/api/types";
import type { ClaimsForm } from "~/types";
import { submitFlight } from "./supabase"

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
	}, { immediate: true, deep: true })
	return { compensation, distance }
}

export const usePrepareClaimSubmission = () => {
	const { submitFlight, submitClaim, handleUploadFile, handleUploadSignature } = useSupabaseFunctions()
	const claim = useClaim()
	const { send } = useSendMail();
	const processClaimPerPassenger = async (passenger: ClaimsForm['client']['passengers'][number], passengerIndex: number) => {
		try {
			if (!passenger.signature) {
				throw Error('No Signature')
			}

			const claimResponse = await submitClaim(claim, passengerIndex);

			if (!claimResponse?.id) {
				throw Error('No Claim ID')
			}

			const storageFolderClaim = [formatClaimId(claimResponse.id, false), passenger.lastName].join("/");

			await Promise.all([
				// Signature
				handleUploadSignature(
					passenger.signature.svg,
					[storageFolderClaim, "signature"].join("/")
				),
				// Boarding Pass
				// handleUploadFile(
				// 	passenger.boardingPass?.[0]?.file,
				// 	[storageFolderClaim, "boarding-pass"].join("/")
				// )
			])
			
			// const fileName = `${uuid.v4()}.svg`;
			// const email = send({
			// 	to: passenger.email,
			// 	subject: "Deine Anfrage wurde erfolgreich eingereicht",
			// 	template: "AssignmentLetter.vue",
			// 	// pdf: {
			// 	// 	template: "assignment-letter",
			// 	// 	fileName: [
			// 	// 		t("assignmentLetter"),
			// 	// 		claim.client.passengers[0].lastName,
			// 	// 	].join("-"),
			// 	// },
			// 	data: claimResponse,
			// });
		} catch (error) {
			console.log(error);
			return;
		}

	}

	const prepareClaimSubmission = async (claim: ClaimsForm) => {
		try {
			if (!claim.flight) return;
			const response = await submitFlight(claim.flight);
			claim.client.passengers.forEach(processClaimPerPassenger)

		} catch (error) {
			console.log(error);
		}
	};
	return { prepareClaimSubmission }
}