export default defineNuxtRouteMiddleware((to) => {
	const user = useSupabaseUser()
	console.log('user', user.value)
	console.log('to.path', to.path)

	if (!user.value && to.path === '/status') {
		navigateTo('/login')
	} else if (user.value && to.path === '/login') {
		navigateTo('/status')
	}
})