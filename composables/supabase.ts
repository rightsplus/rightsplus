import type { ClaimsForm, RowClaim, Database, Flight, RowFlight, RowBooking } from "@/types";

type BaseProps = {
	date: string;
	or?: string;
}
export const useSupabaseFunctions = () => {
	const supabase = useSupabaseClient<Database>()
	const user = useSupabaseUser()
	const { locale } = useI18n()

	async function fetchFlights<T>(body: BaseProps & {
		iata: string;
	}): Promise<T>
	async function fetchFlights<T>(body: BaseProps & {
		arrival: string;
		departure: string;
	}): Promise<T>
	async function fetchFlights<T>(body: BaseProps & {
		type: "departure";
		departure: string;
	}): Promise<T>
	async function fetchFlights<T>(body: BaseProps & {
		type: "arrival";
		arrival: string;
	}): Promise<T>
	async function fetchFlights<T>(body: BaseProps & {
		departure?: string
		arrival?: string
		type?: "departure" | "arrival",
		iata?: string
	}): Promise<T> {
		console.log('fetching supabase')
		const { date, departure, arrival, type, iata, or } = body
		type Match = {
			dateDeparture: string
			iata: string
		} | {
			dateDeparture: string
			airportDeparture: string
		} | {
			dateArrival: string
			airportArrival: string
		} | {
			dateDeparture: string
			airportDeparture: string
			airportArrival: string
		}
		// let match: Match
		let match: Partial<Match> // for testing purposes only, while not subscribed to aviation stack
		if (iata) {
			match = {
				dateDeparture: date,
				iata
			}
		} else if (type === 'departure' && departure) {
			match = {
				dateDeparture: date,
				airportDeparture: departure
			}
		} else if (type === 'arrival' && arrival) {
			match = {
				dateArrival: date,
				airportArrival: arrival
			}
		} else if (departure && arrival) {
			match = {
				dateDeparture: date,
				airportDeparture: departure,
				airportArrival: arrival
			}
		} else {
			throw 'supply iata OR type and dep/arr OR dep and arr'
		}

		console.log('match...', match)


		// const { error : err} = await supabase.rpc('delete_duplicate_flights')
		// console.log(err)

		// return []

		console.log('wait')
		const supabaseQuery = supabase
			.from('flight')
			.select('data')
			.match(match)
			.abortSignal(AbortSignal.timeout(5000))

		console.log(supabaseQuery)

		const { data: flights, error: errFlights } = await (or ? supabaseQuery.or(or) : supabaseQuery)

		console.log('data', flights)
		console.log('error', errFlights)

		const mappedFlights = flights?.map(e => e.data)
		console.timeEnd('fetching supabase')
		if (mappedFlights?.length) {
			console.log('flights cached')
			return mappedFlights as T
		}
		console.log('flights not cached')

		console.log('fetching aviation stack/edge')
		const { data, error } = await supabase.functions.invoke("flights", { body })
		console.log('fetching aviation stack/edge done', data, error)
		if (error) {
			throw error;
		}
		return data as T;
	}

	const fetchProxy = async <T>(url: string, options?: RequestInit) => {
		// console.log('proxy', supabase)
		supabase.functions.invoke("proxy", {
			body: { url, options },
		})
			.then((e) => {
				// console.log(e)
			})
			.catch(console.error)
			.finally(() => {
				// console.log('fin')
			})
		const { data, error } = await supabase.functions.invoke("proxy", {
			body: { url, options },
		})
		// console.log("data", data)
		if (error) {
			throw error;
		}
		return data as T;
	}

	const userExists = async ({ email }: {
		email: string
	}) => {
		const { data, error } = await supabase.functions.invoke("user-exists", {
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

	// 	const { data, error } = await supabase.storage
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

		const { data, error } = await supabase.storage
			.from("client-files")
			.upload(filePath, signatureSVG, {
				cacheControl: "3600",
				upsert: false,
			});

		return { data, error };
	};

	const handleUploadFile = async (file: File, folder?: string) => {
		try {

			if (!file) {
				throw new Error("No file provided");
			}
			// if (!(file instanceof File)) {
			// 	throw new Error(`${file} is not of type File`);
			// }
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
			const { data, error } = await supabase.storage
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
		} catch (err) {
			console.error(err)
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
		} as Omit<RowFlight, 'id' | 'createdAt'>;

		try {
			console.log('checking existing flight...')
			const { data: existingFlight, error: errExisting } = await supabase.from("flight").select().match({ iata: flight.flight.iata, dateDeparture: flight.departure.scheduledTime.split('T')[0] }).single<RowFlight>();
			console.log('query:', { iata: flight.flight.iata, scheduledDeparture: flight.departure.scheduledTime })
			console.log('existing flight:', existingFlight)
			console.log('errExisting', errExisting)

			return
			// if (errExisting) throw errExisting
			if (existingFlight) return existingFlight
			console.log('preparedFlight', preparedFlight)
			const { data: addedFlight, error } = await supabase
				.from("flight")
				.insert([preparedFlight])
				.select()
				.single<RowFlight>()
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
	const submitBooking = async (claim: ClaimsForm, flightId: number) => {
		// @todo: add connection and replacement flight
		const preparedBooking = {
			flightId,
			number: claim.client.bookingNumber,
			disruption: claim.disruption,
			trip: {
				departure: claim.airport.trip.departure!.iata,
				arrival: claim.airport.trip.arrival!.iata,
				layover: claim.airport.trip.layover?.map(e => e.iata),
			},
		} as Omit<RowBooking, 'id' | 'createdAt'>;
		try {
			const { data, error } = await supabase
				.from("booking")
				.insert([preparedBooking])
				.select()
				.single<RowBooking>()
			if (error) throw error
			return data
		} catch (error) {
			throw error
		}
	}
	const submitClaim = async (claim: ClaimsForm, passengerIndex: number, bookingId: number) => {
		const passenger = { ...claim.client.passengers[passengerIndex] };
		delete passenger.signature
		const preparedClaim = {
			email: passenger.email,
			client: passenger,
			bookingId: bookingId,
			lang: locale.value
		} as Omit<RowClaim, 'id' | 'createdAt' | 'status' | 'unread'>;
		try {
			const { data, error } = await supabase
				.from("claim")
				.insert([preparedClaim])
				.select(getExtendedClaimQuery())
				.single<RowClaim>()
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
		submitBooking,
		submitClaim,
		fetchProxy,
		fetchFlights
	}
}