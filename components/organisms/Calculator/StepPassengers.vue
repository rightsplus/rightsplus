<template>
  <div class="flex flex-col gap-2">
    <PassengerForm
      v-if="modelValue.client.passengers.length > 0"
      v-for="(p, i) in modelValue.client.passengers"
      :open="active"
      @setOpen="active = $event"
      :key="i"
      :index="i"
      :modelValue="p"
      :length="modelValue.client.passengers?.length"
      @remove="modelValue.client.passengers?.splice(i, 1)"
      @update:modelValue="modelValue.client.passengers[i] = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Database, ClaimsForm } from "@/types";
import PassengerForm from "./Forms/PassengerForm.vue";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();

const active = ref<number[]>([0]);

const addPassenger = (n = 1) => {
  if (!props.modelValue.client.passengers)
    props.modelValue.client.passengers = [];
  Array.from({ length: n }).forEach(() => {
    props.modelValue.client.passengers.push({
      firstName: "",
      lastName: "",
      address: {
        street: "",
        postalCode: "",
        city: "",
      },
      email: "",
      iban: "",
    });
  });
  if (n === 1) {
    active.value = [props.modelValue.client.passengers.length - 1];
  }
};
const removePassenger = (n = 1) => {
  if (!props.modelValue.client.passengers)
    props.modelValue.client.passengers = [];
  props.modelValue.client.passengers.splice(
    props.modelValue.client.passengers.length - n,
    n
  );
};

defineExpose({ addPassenger, removePassenger });

</script>
