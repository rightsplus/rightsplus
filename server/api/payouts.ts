import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import stripe from 'stripe'

export default defineEventHandler(async (event) => {
	const user = await serverSupabaseUser(event)
	const client = serverSupabaseClient(event)
	const isAdmin = (await client.from('users').select('role').eq('email', user?.email).single()).data?.role === 'admin'

	if (!isAdmin) throw createError({ statusCode: 401, message: "Unauthorized" })
	const body = await readBody(event)
	
	// console.log('body', body);
	try {
		// console.log('stripe', stripe(process.env.STRIPE_SECRET_KEY));
		const customer = await stripe(process.env.STRIPE_SECRET_KEY).customers.create();
		const { amount, currency, accountId } = body;
		// console.log('customer', customer);
    // const payout = await stripe.payouts.create({
    //   amount: amount,
    //   currency: currency,
    //   destination: accountId,
    // });
    // console.log('Payout created:', payout);
		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'Payout successful' })
		}
  } catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Payout failed' })
		}
  }
})
