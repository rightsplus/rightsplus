<template>
  <div class="bg-neutral-50 rounded-xl">
    <OrganismsCalculatorFormsPassengerForm
      :open="open"
      @setOpen="open = $event"
      key="'i'"
      :index="0"
      :modelValue="localClient"
      @update:modelValue="localClient = $event"
      :pendingChanges="pendingChanges"
      @save="saveChanges"
      @revert="revertChanges"
      :loading="loading"
    />
    <!-- <div class="flex justify-between">
      <h2>{{ [localClient.firstName, localClient.lastName].join(" ") }}</h2>

      <Button
        tertiary
        round
        success
        @click="saveChanges"
        prefix-icon="check"
        class="h-7 !py-0 !px-3 text-sm"
        >Save</Button
      >
      {{ loading && "loading" }}
    </div>
    <FormPersonalInfo
      v-model:first-name="localClient.firstName"
      v-model:last-name="localClient.lastName"
      v-model:email="localClient.email"
      v-model:phone="localClient.phone"
      v-model:address="localClient.address"
    /> -->
  </div>
</template>
<script lang="ts" setup>
import type { RowClaimExtended } from "~/types";
const props = defineProps<{ client: RowClaimExtended["client"] }>();
const emit = defineEmits<{
  "update:modelValue": [claim: RowClaimExtended["client"]];
}>();
const localClient = ref({ ...props.client });
const loading = ref(false);
const open = ref([]);
const pendingChanges = computed(
  () => JSON.stringify(props.client) !== JSON.stringify(localClient.value)
);
const saveChanges = async () => {
  if (!localClient?.value) return;
  loading.value = true;
  emit("update:modelValue", localClient.value);
};
const revertChanges = async () => {
  localClient.value = { ...props.client };
};
watch(pendingChanges, (changes) => {
  console.log("changes", changes);
  if (!changes) loading.value = false;
});
</script>
