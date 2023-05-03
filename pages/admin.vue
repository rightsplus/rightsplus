<template>
  <div class="min-h-screen pt-36 pb-8 bg-neutral-200">
    <div class="max-w-7xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-12">
          <h1 class="text-xl sm:text-2xl font-extrabold">Admin Board</h1>
        </div>
        <CustomTable :data="tableData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomTable from "@/components/cells/CustomTable.vue";
const currentUser = useSupabaseUser();
const client = useSupabaseClient();
const { data } = await useAsyncData("user", async () => {
  return {
    user: (await client
      .from("users")
      .select("role")
      .eq("email", currentUser.value?.email)
      .single()).data,
    cases: (await client.from("cases").select(`
			*,
			users (
				first_name,
				last_name
			)
  `)).data,
  };
});

const isAdmin = computed(() => data.value?.user?.role === "admin");

const tableData = computed(() => {
  return data.value?.cases.map((item) => {
    return {
      first_name: item.users.first_name,
      last_name: item.users.last_name,
      created_at: new Date(item.created_at).toLocaleDateString(
        useI18n().locale.value
      ),
      updated_at: new Date(
        item.updated_at || item.created_at
      ).toLocaleDateString(useI18n().locale.value),
    };
  });
});

definePageMeta({
  middleware: ["auth"],
});
// watchEffect(() => {
//   if (!isAdmin.value) navigateTo("/login");
// });
</script>

<style scoped></style>
