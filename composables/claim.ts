import assignmentAgreement from "~/plugins/pdfmake/pdf/documents/assignmentAgreement";
import useCreatePdf from "~/plugins/pdfmake/useCreatePdf";
import type { SendPDFMailProps, GeneratePDFProps } from "~/server/api/types";
import type { ClaimsForm, Database, RowBooking, RowFlight } from "~/types";




export const useSendMail = () => {
	const send = async (props: SendPDFMailProps) => {
		console.log("sending email");

		// Construct FormData
		const formData = new FormData();

		console.log(props)
		// Append props and attachments
		appendNested(formData, props);


		// Send FormData
		const response = await fetch("/api/mail", {
			method: "POST",
			headers: useRequestHeaders(["cookie"]),
			body: formData,
		});

		return response;
	};

	return { send };
};

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

		console.log('response', response)

		return streamToPdfLink(response.body);
	};
	return { generate };
}

export const useCompensation = (estimate = false) => {
	const { t } = useI18n()
	const claim = useClaim()
	const { airport: a, assignLeg } = useFlightLeg(claim);

	const { airlines } = useAirlines()
	const { noBoardingReasons } = useDisruption()

	const eligible = ref<boolean | null>(null);
	const compensation = ref(0);
	const distance = ref(0);
	const message = ref<string>();

	const getError = () => {
		assignLeg()
		eligible.value = null
		if (!claim) return 'errors.noClaim' // No claim
		const { airport, leg, flight, disruption, replacement, connection } = claim

		// TRIP
		const { departure, arrival, trip } = airport || {}
		const legs = generateLegs(airport.trip)
		// console.log(departure, arrival, trip, legs)

		if (!departure || !Object.keys(departure).length || !arrival || !Object.keys(arrival).length) return 'errors.airport.missing'
		if (departure.iata === arrival.iata) {
			// console.log(departure, arrival)
			return 'errors.airport.identical'
		}
		if (!departure.ec261 && !arrival.ec261) return 'errors.ec261.airport'
		if (!leg || !generateLegs(trip)[leg]) return 'errors.leg.missing'

		// FLIGHT
		if (!flight) return 'errors.flight.missing'
		const airline = airlines.value[flight.airline.iata]
		// if (!airline) return 'errors.airline.missing'

		if (!departure.ec261 && !airline?.isEuMember) {
			eligible.value = false
			return 'errors.ec261.airline' // ineligible
		}


		// DISRUPTION

		if (!disruption || !disruption.type) return 'errors.disruption.missing'

		if (disruption.type === "delayed") {
			if (!disruption.details) return 'errors.disruption.detail.delay'
			if (disruption.details === "<3") {
				// console.log('connection', connection)
				const { departure, arrival } = nextLeg(claim)
				if (!connection || !(departure || arrival)) {
					eligible.value = false
					return 'errors.eligible.reason.delay.<3'
				}
				if (!connection.flight) return 'errors.connectionFlight.missing'
				if (reachedConnectionFlight(claim)) {
					eligible.value = false
					return 'errors.connection.reached'
				}
			}
		} else if (disruption.type === "cancelled") {
			if (!disruption.details) return 'errors.disruption.detail.cancelled'
			if (disruption.details === '>14') {
				eligible.value = false
				return 'errors.cancelled.>14'
			}
			if (isReplacementFlightWithinBounds(claim)) {
				eligible.value = false
				return 'errors.replacement.withinBounds'
			}
		} else if (disruption.type === "noBoarding") {
			if (noBoardingReasons.find(e => e.value === disruption.reason)?.selfInflicted) {
				eligible.value = false
				return 'errors.disruption.selfInflicted'
			}
		}
		eligible.value = true
	}

	const getCompensation = () => {
		const distance = getDistance(claim)
		let message = ""

		// if (claim.flight?.status === 'landed') {
		if (!estimate && getError()) {
			const errorCode = getError()
			if (errorCode) {
				message = t(errorCode)
				return { compensation: 0, distance, message }
			}
		}
		// console.log('error code', getError())

		const wasDelayed = (claim.flight?.arrival.delay || 0) >= 180
		if ((claim.flight?.status === 'landed' && !wasDelayed) && (claim.disruption.type !== "noBoarding" || claim.disruption.selfInflicted)) {
			message = t('Dein Flug ist offenbar pünktlich gelandet.')
			eligible.value = false
			return { compensation: 0, distance, message }
		}
		let compensation = 250
		if (distance > 1500) compensation = 400
		const beyondEU = [claim.airport.departure, claim.airport.arrival].some(e => !e.ec261)
		if (distance > 3500 && beyondEU) compensation = 600
		return { compensation, distance, message }
	}

	watch(claim, () => {
		const { compensation: c, distance: d, message: m } = getCompensation()
		compensation.value = c
		distance.value = d
		message.value = m
	}, { immediate: true, deep: true })

	return { compensation, distance, message, eligible }
}

export const usePrepareClaimSubmission = () => {
	const supabase = useSupabaseClient<Database>()
	const { submitFlight, submitBooking, submitClaim, handleUploadFile, handleUploadSignature } = useSupabaseFunctions()
	const claim = useClaim()
	const { emails } = useStatusEmail()
	const processClaimPerPassenger = async (passenger: ClaimsForm['client']['passengers'][number], passengerIndex: number, booking: RowBooking) => {
		try {
			if (!passenger.signature) {
				throw Error('No Signature')
			}

			const claimResponse = await submitClaim(claim, passengerIndex, booking.id);

			if (!claimResponse?.id) {
				throw Error('No Claim ID')
			}

			claimResponse.client.signature = passenger.signature

			const storageFolderClaim = [formatClaimId(claimResponse.id, false), passenger.lastName].join("/");

			// console.log(passenger.signature.svg, passenger.boardingPass)
			await Promise.all([
				// Signature
				handleUploadSignature(
					passenger.signature.svg,
					[storageFolderClaim, "signature"].join("/")
				),
				// Boarding Pass

				...(passenger.boardingPass ? Object.entries(passenger.boardingPass).filter(Boolean).map(([name, file]) => handleUploadFile(
					base64ToFile(file, name),
					[storageFolderClaim, "boarding-pass"].join("/")
				)) : [])
			])

			// const fileName = `${uuid.v4()}.svg`;
			emails.dataReceived?.forEach(e => e.handler(claimResponse));
			// send({
			// 	to: passenger.email,
			// 	subject: "Deine Anfrage wurde erfolgreich eingereicht",
			// 	template: "Status.vue",
			// 	// pdf: {
			// 	// 	template: "assignment-letter",
			// 	// 	fileName: [
			// 	// 		t("assignmentLetter"),
			// 	// 		claim.client.passengers[0].lastName,
			// 	// 	].join("-"),
			// 	// },
			// 	data: {
			// 		name: [passenger?.firstName, passenger?.lastName].join(" "),
			// 		firstName: passenger?.firstName,
			// 		claimId: formatClaimId(claimResponse.id),
			// 		bookingNumber: booking.number,
			// 		status: "dataReceived",
			// 		...emails.dataReceived(claimResponse),
			// 	},
			// });
		} catch (error) {
			console.log(error);
			return;
		}

	}

	const prepareClaimSubmission = async (claim: ClaimsForm) => {
		try {
			if (!claim.flight) return;
			console.log('fetch flight for id ...', )
			console.log({ iata: claim.flight.flight.iata, dateDeparture: claim.flight.departure.scheduledTime.split('T')[0] })


			const { data: existingFlight, error: errExisting } = await supabase.from("flight").select().match({ iata: claim.flight.flight.iata, dateDeparture: claim.flight.departure.scheduledTime.split('T')[0] }).single<RowFlight>();
			

			console.log(claim.flight.departure.scheduledTime)
			const { id: flightId } = existingFlight || (await submitFlight(claim.flight)) || {}
			
			if (!flightId || errExisting) {
				throw new Error(!flightId ? 'no flight' : errExisting?.message)
			}
			console.log('submitting booking...')
			const booking = await submitBooking(claim, flightId);
			console.log('process claims...')
			claim.client.passengers.forEach((passenger, index) => processClaimPerPassenger(passenger, index, booking))

		} catch (error) {
			console.log(error);
		}
	};
	return { prepareClaimSubmission }
}