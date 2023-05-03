<template>
  <div class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full lg:w-1/2">
        <div class="flex flex-col gap-12">
          <h1 class="text-4xl sm:text-6xl font-extrabold">Der Status deiner Forderung</h1>
          <ClientOnly><FlightResult v-for="claim in data.claims" :key="claim.id" :flight="claim.data" /></ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FlightResult from "~~/components/organisms/Calculator/FlightResult.vue";

const user = useSupabaseUser();

definePageMeta({
  middleware: ["auth"],
});
watchEffect(() => {
  if (!user.value) navigateTo("/login");
});

const client = useSupabaseClient();
const { data } = await useAsyncData("user", async () => {
  return {
    claims: (await client.from("cases").select(`
			*,
			users (
				first_name,
				last_name
			)
  `).eq('user_id', user.value.id)).data
  };
});

</script>

<style scoped></style>
