import type { ClaimsForm, ClaimsRow, Database, Flight, FlightsRow } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";


export const useSupabaseFunctions = () => {
	const client = useSupabaseClient<Database>()
	const user = useSupabaseUser()

	const fetchProxy = async <T>(url: string, options?: RequestInit) => {
		console.log('proxy', client)
		client.functions.invoke("proxy", {
			body: { url, options },
		}).then(console.log).catch(console.error).finally(() => console.log('fin'))
		const { data, error } = await client.functions.invoke("proxy", {
			body: { url, options },
		})
		console.log("data", data)
		if (error) {
			throw error;
		}
		return data as T;
	}

	const userExists = async ({ email }: {
		email: string
	}) => {
		const { data, error } = await client.functions.invoke("user-exists", {
			body: { email },
		})
		if (error) {
			throw error;
		}
		return data as boolean;
	}

	// const handleUploadSignatures = (claimId: number, signatures: string[]) => signatures.map(async (signature, index) => {
	// 	const storageFolderClaim = formatClaimId(claimId, false);
	// 	const signatureSVG = new Blob([signature], {
	// 		type: "image/svg+xml",
	// 	});

	// 	const filePath = [storageFolderClaim, `signature_${index}.svg`].join("/");

	// 	const { data, error } = await client.storage
	// 		.from("client-files")
	// 		.upload(filePath, signatureSVG, {
	// 			cacheControl: "3600",
	// 			upsert: false,
	// 		});

	// 	// Handle the result (data, error) as needed
	// 	return { data, error, index };
	// });
	const handleUploadSignature = async (signature: string, folder?: string) => {
		const signatureSVG = new Blob([signature], {
			type: "image/svg+xml",
		});

		const filePath = [folder, `signature.svg`].join("/");

		const { data, error } = await client.storage
			.from("client-files")
			.upload(filePath, signatureSVG, {
				cacheControl: "3600",
				upsert: false,
			});

		return { data, error };
	};

	const handleUploadFile = async (file: File, folder?: string) => {
		if (!file) {
			throw new Error("No file provided");
		}
		const options = {
			convertSize: 0.5,
			quality: 0.8,
			maxWidth: 1080,
			maxHeight: 1080,
		};

		const resizedFile = await compressImage(file, options);
		const fileExt = (resizedFile as File).name.split(".").pop();
		const fileName = `${uuid()}.${fileExt}`;
		const filePath = [folder, fileName].filter(Boolean).join("/");
		const { data, error } = await client.storage
			.from("client-files")
			.upload(filePath, resizedFile, {
				cacheControl: "3600",
				upsert: false,
			});
		if (error) {
			console.error(error);
			throw error;
		} else {
			console.log(data);
			return data.path;
		}
	};
	const submitFlight = async (flight: Flight) => {
		const preparedFlight = {
			iata: flight.flight.iata,
			status: flight.status,
			airlineIata: flight.airline.iata,
			airportDeparture: flight.departure.iata,
			airportArrival: flight.arrival.iata,
			actualDeparture: flight.departure.actualTime,
			actualArrival: flight.arrival.actualTime,
			scheduledDeparture: flight.departure.scheduledTime,
			scheduledArrival: flight.arrival.scheduledTime,
			delayArrival: flight.arrival.delay,
			data: flight,
		} as Omit<FlightsRow, 'id' | 'createdAt'>;

		try {
			const { data: existingFlight, error: errExisting } = await client.from("flights").select().match({ iata: flight.flight.iata, scheduledDeparture: flight.departure.scheduledTime }).single<FlightsRow>();

			if (errExisting) throw errExisting
			if (existingFlight) return existingFlight
			const { data: addedFlight, error } = await client
				.from("flights")
				.upsert([preparedFlight]
				)
				.select()
				.single<FlightsRow>()
			if (error) {
				throw error
			}
			if (!addedFlight) {
				throw Error('No flight data')
			}
			return addedFlight
		} catch (error) {
			throw error
		}
	}
	const submitClaim = async (claim: ClaimsForm, passengerIndex: number, flightId: number) => {
		const passenger = claim.client.passengers[passengerIndex];
		const preparedClaim = {
			email: passenger.email,
			flightId: flightId,
			flightIata: claim.flight?.flight.iata,
			bookingNumber: claim.client.bookingNumber,
			client: passenger,
			disruption: claim.disruption,
		} as ClaimsRow;
		try {
			const { data, error } = await client
				.from("claims")
				.upsert([preparedClaim])
				.select()
				.single<ClaimsRow>()
			if (error) throw error
			return data
		} catch (error) {
			throw error
		}
	}
	return {
		userExists,
		handleUploadFile,
		handleUploadSignature,
		submitFlight,
		submitClaim,
		fetchProxy
	}
}