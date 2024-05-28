export default defineNuxtRouteMiddleware(async (to) => {
	const user = useSupabaseUser()
	const client = useSupabaseClient()
	const isAdmin = user.value?.email && (await client.from('users').select('role').eq('email', user.value?.email).single()).data?.role === 'admin'

	console.log('isAdmin', isAdmin)
	console.log('user', user.value)
	console.log('path', to.path)
	if ((!isAdmin && to.path.includes('/admin'))) return navigateTo('/login?redirect=' + to.path)

	if (user.value && to.path === '/login') return navigateTo('/status')

	return
})