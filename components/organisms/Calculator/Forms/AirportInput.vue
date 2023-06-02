<template>
  <DropdownSearch
    :modelValue="convertName(modelValue)"
    @update:modelValue="$emit('update:modelValue', useAirports()[$event?.value])"
    :label="label"
    :name="name"
    :id="id || name"
    :options="dropdownList"
    :prefix-icon="modelValue?.name?.includes('Rail') ? 'train' : prefixIcon"
    :suffix-icon="suffixIcon"
    :placeholder="placeholder"
    :errors="errors"
    @query="findAirports"
    @prefix-icon-click="$emit('prefix-icon-click')"
    @suffix-icon-click="$emit('suffix-icon-click')"
  />
</template>

<script lang="ts" setup>
import { countries } from "@/config/countries";
import { Airport } from "@/types";
import { DropdownItem } from "~~/components/molecules/Dropdown.vue";
import DropdownSearch from "~~/components/molecules/DropdownSearch.vue";

const props = defineProps<{
  modelValue: Airport;
  name: string;
  label: string;
  placeholder?: string;
  id?: string;
  validation?: string;
  prefixIcon?: string;
  suffixIcon?: string;
}>();
const emit = defineEmits(["update:modelValue", "suffix-icon-click", "prefix-icon-click"]);

emit("update:modelValue", props.modelValue)

const { locale } = useI18n();
const convertName = (value: Airport) => value?.name ? `${value?.name} (${value?.iata})` : ''
const dropdownList = ref([] as DropdownItem[])
const errors = ref(undefined as undefined | string[])
const errorTimeout = ref(undefined as undefined | ReturnType<typeof setTimeout>)
const algolia = useAlgoliaSearch("AIRPORTS");
function findAirports (query: string) {
  if (query?.length < 1) return;
    queryAirports(algolia, query)
      .then(hits => {
        errors.value = undefined
        if (!hits) return
        dropdownList.value = hits.map((airport) => {
          // if (airport.name.includes('Rail')) return
          return {
            value: airport.iata,
            label: `${airport._highlightResult?.name.value || "Airport"} (${airport._highlightResult?.iata.value})`,
            sublabel: [
              getCityTranslation(airport, locale.value, true),
              countries.getName(airport.country_code, locale.value),
            ]
              .filter(Boolean)
              .join(", "),
            icon: airport.name.includes('Rail') ? "train" : "plane",
          }}).filter(Boolean)
      })
      .catch(({transporterStackTrace}) => {
        const [message] = transporterStackTrace
        errors.value = [message?.response?.content]
        clearTimeout(errorTimeout.value)
        errorTimeout.value = setTimeout(() => errors.value = undefined, 5000)
      })
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
