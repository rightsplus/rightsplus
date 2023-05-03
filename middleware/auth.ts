export default defineNuxtRouteMiddleware(async (to) => {
	const user = useSupabaseUser()
	const client = useSupabaseClient()

	const isAdmin = (await client.from('users').select('role').eq('email', user.value?.email).single()).data?.role === 'admin'

	if (!isAdmin && to.path === '/admin') {
		navigateTo('/login')
	}

	if (!user.value && to.path === '/status') {
		navigateTo('/login')
	} else if (user.value && to.path === '/login') {
		navigateTo('/status')
	}
})