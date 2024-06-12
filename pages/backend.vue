<template>
  <section class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full lg:w-1/2">
        <div class="flex flex-col gap-5">
          <h1 class="text-6xl">
            Backend <b class="font-extrabold">RightsPlus</b>
          </h1>
          <span class="text-3xl font-medium text-gray-500">
          </span>
					<div v-for="claim in claims" :key="claim.id">
						{{ claim.email }} //
						{{ claim.flight.departure.iata }} -> {{ claim.flight.arrival.iata }}
						<button class="bg-primary-500 text-white  py-5 px-3 rounded-md">send email</button>
					</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
const user = useSupabaseUser();

definePageMeta({
  middleware: ["auth"],
});
const localeRoute = useLocaleRoute();

onMounted(() => {
  watchEffect(() => {
    if (!user.value) navigateTo(localeRoute("login"));
  });
});
const { data: claims } = await useFetch("/api/claims", {
  headers: useRequestHeaders(["cookie"]),
});
</script>

<style scoped></style>
