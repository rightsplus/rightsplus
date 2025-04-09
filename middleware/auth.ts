import type { Database, RowUser } from "~/types"

export default defineNuxtRouteMiddleware(async (to) => {
	const user = useSupabaseUser()
	const client = useSupabaseClient<Database>()
	const { data: currentUser } = await client.from('users').select('role').eq('email', user.value?.email).single<RowUser>()
	const isAdmin = user.value?.email && currentUser?.role === 'admin'
	console.log('Checking path:', to.path); // Keep this for debugging



	console.log(to.path)
	if (!isAdmin && to?.path?.includes('/admin')) {
		console.log(`Redirecting non-admin from ${to.path} to /login`); // Add log
		return navigateTo('/login?redirect=' + to.path);
	}
})