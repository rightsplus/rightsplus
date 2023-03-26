<template>
  <div class="relative">
    <FormKit
      ref="input"
      type="text"
      v-model="query"
      autocomplete="off"
      :label="label"
      :name="name"
      :id="id || name"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      :validation="validation"
      @focus="inputFocused = true"
      @blur="inputFocused = false"
      @prefix-icon-click="$emit('prefix-icon-click')"
      @suffix-icon-click="$emit('suffix-icon-click')"
      @keydown.down.up.prevent="keydown"
      @keydown.enter.prevent="enter"
      :floatingLabel="true"
      :classes="{
        inner:
          inputFocused && airports?.length && query?.length
            ? 'rounded-b-none max-w-full'
            : 'max-w-full',
      }"
    />
    <ListAirport
      class="w-full -mt-[15px]"
      :query="query"
      :limit="5"
      :selected="selectedInList"
      @airports="updateAirports"
      @input="handleInput"
      :inputFocused="inputFocused"
    />
  </div>
</template>

<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import ListAirport from "./ListAirport.vue";
import { Airport, ClaimsForm } from "@/types";
const props = defineProps<{
  modelValue: Airport;
  name: string;
  label: string;
  placeholder: string;
  id?: string;
  validation?: string;
  prefixIcon?: string;
  suffixIcon?: string;
}>();
const emit = defineEmits(["update:modelValue", "suffix-icon-click", "prefix-icon-click"]);
const selectedInList = ref(0);
const query = ref("");
const inputFocused = ref(false);
const airports = ref([] as Airport[]);

watch(
  () => query.value,
  (val) => {
    selectedInList.value = 0;
  }
);
watch(
  () => props.modelValue,
  (val) => {
    if (val?.full) query.value = val?.full;
  },
  { deep: true, immediate: true }
);
function updateAirports(value: Airport[]) {
  airports.value = value;
}
function keydown(e: KeyboardEvent) {
  selectedInList.value = keyIncrement(
    e,
    selectedInList.value,
    airports.value?.length
  );
}
function handleInput(airport: Airport) {
  query.value = airport.full;
  emit("update:modelValue", airport);
  focusNext(true);
}
function enter() {
  if (!airports.value?.length) {
    focusNext(true);
    return
  }

  const { iata, full, name, city, country, countryName, lat, lon } =
    airports.value[selectedInList.value];
  handleInput({
    iata,
    full,
    name,
    city,
    country,
    countryName,
    lat,
    lon,
  });
}
</script>

<style>
.formkit-suffix-icon:hover {
  cursor: pointer;
}
.formkit-suffix-icon:hover svg {
  fill: var(--color-gray-800);
}
</style>
