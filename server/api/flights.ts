import crypto from 'crypto';
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event)
		console.log('fetching, body', body)


		function doubleMd5(str: string, appSecurity: string) {
			const concatenatedString = str + appSecurity;
			const firstMd5 = crypto.createHash('md5').update(concatenatedString).digest('hex');
			const secondMd5 = crypto.createHash('md5').update(firstMd5).digest('hex');
			return secondMd5;
		}

		const  { departure, arrival, date } = body
		const appId = '11590'
		const str = `appid=${appId}&arr=${arrival}&date=${date}&dep=${departure}&lang=en`
		const appSecurity = '6606271db5bc7'
		const token = doubleMd5(str, appSecurity);
		const vari = new URL(`http://open-al.variflight.com/api/flight?${str}&token=${token}`)

		const response = await fetch(vari.href).then(res => res.json())
		return response
	} catch (error) {
		return error
	}
})
