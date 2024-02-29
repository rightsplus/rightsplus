export default defineNuxtRouteMiddleware(async (to) => {
	const user = useSupabaseUser()
	const client = useSupabaseClient()
	const isAdmin = user.value?.email && (await client.from('users').select('role').eq('email', user.value?.email).single()).data?.role === 'admin'

	if ((!isAdmin && to.path === '/admin') || (!user.value && to.path === '/status')) return navigateTo('/login?redirect=' + to.path)

	if (user.value && to.path === '/login') return navigateTo('/status')
})