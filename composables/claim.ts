import type { SendPDFMailProps, GeneratePDFProps } from "~/server/api/types";
import type { ClaimsForm } from "~/types";

export const useSendMail = () => {
	const send = async (props: SendPDFMailProps) => {
		console.log('sending email')
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



export const useCompensation = () => {
	const claim = useClaim()
	const { t } = useI18n()
	const compensation = ref(0);
	const distance = ref(0);
	const message = ref<string>();

	const getCompensation = () => {
		const distance = getDistance(claim)
		let message = ""
		if (claim.flight?.status !== 'cancelled' && (claim.flight?.arrival.delay || 0) < 180) {
			message = t("Dein Flug hatte weniger als 3 Stunden Verspätung. Wenn du wegen der Verspätung deinen Anschlussflug verpasst hast, kannst du trotzdem eine Entschädigung beantragen.")
			return { compensation: 0, distance, message }
		}
		let compensation = 250
		if (distance > 1500) compensation = 400
		const beyondEU = [claim.airport.departure, claim.airport.arrival].some(e => !e.ec261)
		if (distance > 3500 && beyondEU) compensation = 600
		return { compensation, distance, message }
	}

	watch(claim.airport, () => {
		const { compensation: c, distance: d, message: m } = getCompensation()
		compensation.value = c
		distance.value = d
		message.value = m
	}, { immediate: true, deep: true })
	return { compensation, distance, message }
}

export const usePrepareClaimSubmission = () => {
	const { submitFlight, submitClaim, handleUploadFile, handleUploadSignature } = useSupabaseFunctions()
	const claim = useClaim()
	const { t } = useI18n()
	const { send } = useSendMail();
	const statusEmail = useStatusEmail()
	const processClaimPerPassenger = async (passenger: ClaimsForm['client']['passengers'][number], passengerIndex: number, flightId: number) => {
		try {
			if (!passenger.signature) {
				throw Error('No Signature')
			}

			const claimResponse = await submitClaim(claim, passengerIndex, flightId);

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
			const email = send({
				to: passenger.email,
				subject: "Deine Anfrage wurde erfolgreich eingereicht",
				template: "Status.vue",
				// pdf: {
				// 	template: "assignment-letter",
				// 	fileName: [
				// 		t("assignmentLetter"),
				// 		claim.client.passengers[0].lastName,
				// 	].join("-"),
				// },
				data: {
					name: [passenger?.firstName, passenger?.lastName].join(" "),
					firstName: passenger?.firstName,
					claimId: formatClaimId(claimResponse.id),
					bookingNumber: claimResponse.bookingNumber,
					status: "dataReceived",
					...statusEmail('dataReceived', { name: passenger?.firstName, reimbursment: 300, }),
				},
			});
		} catch (error) {
			console.log(error);
			return;
		}

	}

	const prepareClaimSubmission = async (claim: ClaimsForm) => {
		try {
			if (!claim.flight) return;
			const { id } = await submitFlight(claim.flight);
			const claimWithFlightId = { ...claim, flight_id: id };
			claim.client.passengers.forEach((passenger, index) => processClaimPerPassenger(passenger, index, id))

		} catch (error) {
			console.log(error);
		}
	};
	return { prepareClaimSubmission }
}