import { serverSupabaseUser } from "#supabase/server";

const claims = [
	{
		id: "1",
		email: "leonvogler@ok.de",
		flight: {
			flight_date: "2021-01-01",
			departure: {
				airport: "San Francisco International Airport",
				timezone: "America/Los_Angeles",
				iata: "SFO",
				icao: "KSFO",
				terminal: "3",
				gate: "B12",
				delay: 15,
				scheduled: "2023-02-13T08:00:00Z",
				estimated: "2023-02-13T08:15:00Z",
				actual: "2023-02-13T08:20:00Z",
				estimated_runway: "2023-02-13T08:25:00Z",
				actual_runway: "2023-02-13T08:30:00Z",
			},
			arrival: {
				airport: "John F. Kennedy International Airport",
				timezone: "America/New_York",
				iata: "JFK",
				icao: "KJFK",
				terminal: "4",
				gate: "C32",
				delay: 10,
				scheduled: "2023-02-13T11:00:00Z",
				estimated: "2023-02-13T11:10:00Z",
				actual: "2023-02-13T11:15:00Z",
				estimated_runway: "2023-02-13T11:20:00Z",
				actual_runway: "2023-02-13T11:25:00Z",
			},
			airline: {
				name: "United Airlines",
				iata: "UA",
				icao: "UAL",
			},
			flight: {
				number: "UA101",
				iata: "UA101",
				icao: "UAL101",
				codeshared: null,
			}
		}
	},
	{
		id: "2",
		email: "jobawa@web.de",
		flight: {
			flight_date: "2021-01-01",
			departure: {
				airport: "San Francisco International Airport",
				timezone: "America/Los_Angeles",
				iata: "CGN",
				icao: "KSFO",
				terminal: "3",
				gate: "B12",
				delay: 15,
				scheduled: "2023-02-13T08:00:00Z",
				estimated: "2023-02-13T08:15:00Z",
				actual: "2023-02-13T08:20:00Z",
				estimated_runway: "2023-02-13T08:25:00Z",
				actual_runway: "2023-02-13T08:30:00Z",
			},
			arrival: {
				airport: "John F. Kennedy International Airport",
				timezone: "America/New_York",
				iata: "TLV",
				icao: "KJFK",
				terminal: "4",
				gate: "C32",
				delay: 10,
				scheduled: "2023-02-13T11:00:00Z",
				estimated: "2023-02-13T11:10:00Z",
				actual: "2023-02-13T11:15:00Z",
				estimated_runway: "2023-02-13T11:20:00Z",
				actual_runway: "2023-02-13T11:25:00Z",
			},
			airline: {
				name: "United Airlines",
				iata: "UA",
				icao: "UAL",
			},
			flight: {
				number: "UA101",
				iata: "UA101",
				icao: "UAL101",
				codeshared: null,
			}
		}
	}
]

export default defineEventHandler(async (event) => {
	const user = await serverSupabaseUser(event)
	if (!user) throw createError({ statusCode: 401, message: "Unauthorized" })
	return claims.filter(claim => claim.email === user.email)
})