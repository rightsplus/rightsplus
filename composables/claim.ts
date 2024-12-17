import type { ClaimsForm, Database, RowBooking, RowFlight } from "~/types";

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
			console.log('fetch flight for id ...',)
			console.log({ iata: claim.flight.flight.iata, dateDeparture: claim.flight.departure.scheduledTime.split('T')[0] })


			try {

				const { data: existingFlight, error: errExisting } = await supabase
					.from("flight")
					.select('data')
					.match({ iata: claim.flight.flight.iata, dateDeparture: claim.flight.departure.scheduledTime.split('T')[0] })
					.single<RowFlight>();
					console.log(existingFlight, errExisting)
			} catch (err) {
				console.log(err)
			}
			const { data: existingFlight, error: errExisting } = await supabase
				.from("flight")
				.select('data')
				.match({ iata: claim.flight.flight.iata, dateDeparture: claim.flight.departure.scheduledTime.split('T')[0] })
				.single<RowFlight>();


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