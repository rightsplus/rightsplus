import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event)
		console.log(body)

		
		// const url = new URL("https://aviation-edge.com/v2/public/flightsHistory");
		// url.searchParams.append("code", departure);
		// url.searchParams.append("type", 'departure');
		// url.searchParams.append('date_from', date);
		return body
	} catch (error) {
		return error
	}
})
