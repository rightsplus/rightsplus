import type { ClaimsForm, ClaimsTable, Database, Flight, FlightsTable } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";


export const useSupabaseFunctions = () => {
	const client = useSupabaseClient<Database>()
	const user = useSupabaseUser()
	console.log('setup supabase')

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

	const submitPassenger = async (flight: Flight) => {
		try {
			const { data, error } = await client
				.from("flights")
				.upsert([preparedFlight], { onConflict: "number" })
				.select()
			if (error) throw error
			return data
		} catch (error) {
			throw error
		}
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
		const fileExt = resizedFile.name.split(".").pop();
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
			airline_iata: flight.airline.iata,
			airport_departure: flight.departure.iata,
			airport_arrival: flight.arrival.iata,
			actual_departure: flight.departure.actualTime,
			actual_arrival: flight.arrival.actualTime,
			scheduled_departure: flight.departure.scheduledTime,
			scheduled_arrival: flight.arrival.scheduledTime,
			delay_arrival: flight.arrival.delay,
			data: flight,
		} as Omit<FlightsTable, 'id' | 'created_at'>;
		try {
			const { data, error } = await client
				.from("flights")
				.upsert([preparedFlight], { onConflict: "iata" })
				.select()
			if (error) throw error
			return data
		} catch (error) {
			throw error
		}
	}
	const submitClaim = async (claim: ClaimsForm, passengerIndex: number) => {
		const passenger = claim.client.passengers[passengerIndex];
		const preparedClaim = {
			email: passenger.email,
			flight_iata: claim.flight?.flight.iata,
			booking_number: claim.client.bookingNumber,
			client: passenger,
			disruption: claim.disruption,
		} as ClaimsTable;
		try {
			const { data, error } = await client
				.from("claims")
				.upsert([preparedClaim], { onConflict: "booking_number" })
				.select()
				.single()
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