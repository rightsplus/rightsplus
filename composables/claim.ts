import type { SendPDFMailProps, GeneratePDFProps } from "~/server/api/types";
import type { ClaimsForm, RowBooking } from "~/types";

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

export const useCompensation = (estimate = false) => {
	const { t } = useI18n()
	const claim = useClaim()
	const { airlines } = useAirlines()
	const { noBoardingReasons } = useDisruption()

	const eligible = ref<boolean | null>(null);
	const compensation = ref(0);
	const distance = ref(0);
	const message = ref<string>();

	const getError = () => {
		eligible.value = null
		if (!claim) return 'noClaim' // No claim
		const { airport, leg, flight, disruption, replacement, connection } = claim

		// TRIP
		const { departure, arrival, trip } = airport || {}
		if (!departure || !arrival) return 'airport.missing'
		if (departure.iata === arrival.iata) return 'airport.identical'
		if (!departure.ec261 && !arrival.ec261) return 'ec261.airport'
		if (!leg || !generateLegs(trip)[leg]) return 'leg.missing'

		// FLIGHT
		if (!flight) return 'flight.missing'
		const airline = airlines.value[flight.airline.iata]
		// if (!airline) return 'airline.missing'

		if (!departure.ec261 && !airline?.isEuMember) {
			eligible.value = false
			return 'ec261.airline' // ineligible
		}




		// DISRUPTION

		if (!disruption || !disruption.type) return 'disruption.missing'

		if (disruption.type === "delayed") {
			if (!disruption.details) return 'disruption.detail.delay'
			if (disruption.details === "<3") {
				if (!connection) {
					eligible.value = false
					return 'delay.<3'
				}
				if (!connection.flight) return 'connectionFlight.missing'
				if (reachedConnectionFlight(claim)) {
					eligible.value = false
					return 'connection.reached'
				}
			}
		} else if (disruption.type === "cancelled") {
			console.log(disruption.details)
			if (!disruption.details) return 'disruption.detail.cancelled'
			if (disruption.details === '>14') {
				eligible.value = false
				return 'cancelled.>14'
			}
			if (replacement) {
				if (!replacement.flight) return 'replacement.missing'
				if (isReplacementFlightWithinBounds(claim)) {
					eligible.value = false
					return 'replacement.withinBounds'
				}
			}
		} else if (disruption.type === "noBoarding") {
			if (noBoardingReasons.find(e => e.value === disruption.reason)?.selfInflicted) {
				eligible.value = false
				return 'disruption.selfInflicted'
			}
		}
		eligible.value = true
	}

	const getCompensation = () => {
		const distance = getDistance(claim)
		let message = ""
		if (claim.flight?.status !== 'cancelled' && (claim.flight?.arrival.delay || 0) < 180) {
			message = t("Dein Flug hatte weniger als 3 Stunden Verspätung. Wenn du wegen der Verspätung deinen Anschlussflug verpasst hast, kannst du trotzdem eine Entschädigung beantragen.")
			return { compensation: 0, distance, message }
		}
		if (!estimate && getError()) {
			const errorCode = getError()
			if (errorCode) {
				message = t(errorCode)
				return { compensation: 0, distance, message }

			}
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

	return { compensation, distance, message, eligible }
}

export const usePrepareClaimSubmission = () => {
	const { submitFlight, submitBooking, submitClaim, handleUploadFile, handleUploadSignature } = useSupabaseFunctions()
	const claim = useClaim()
	const { t } = useI18n()
	const { send } = useSendMail();
	const statusEmail = useStatusEmail()
	const processClaimPerPassenger = async (passenger: ClaimsForm['client']['passengers'][number], passengerIndex: number, booking: RowBooking) => {
		try {
			if (!passenger.signature) {
				throw Error('No Signature')
			}

			const claimResponse = await submitClaim(claim, passengerIndex, booking.id);

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
					bookingNumber: booking.number,
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
			const { id: flightId } = await submitFlight(claim.flight);
			const booking = await submitBooking(claim, flightId);
			claim.client.passengers.forEach((passenger, index) => processClaimPerPassenger(passenger, index, booking))

		} catch (error) {
			console.log(error);
		}
	};
	return { prepareClaimSubmission }
}