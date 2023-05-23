<template>
  <DropdownSearch
    :modelValue="convertName(modelValue)"
    @update:modelValue="$emit('update:modelValue', useAirports()[$event?.value])"
    :label="label"
    :name="name"
    :id="id || name"
    :options="dropdownList"
    @query="findAirports"
    :prefix-icon="modelValue?.name?.includes('Rail') ? 'train' : prefixIcon"
    :suffix-icon="modelValue?.name?.includes('Rail') ? 'train' : suffixIcon"
    :placeholder="placeholder"
    @prefix-icon-click="$emit('prefix-icon-click')"
    @suffix-icon-click="$emit('suffix-icon-click')"
  />
</template>

<script lang="ts" setup>
import { countries } from "@/config/countries";
import { Airport } from "@/types";
import { DropdownItem } from "~~/components/molecules/Dropdown.vue";
import DropdownSearch from "~~/components/molecules/DropdownSearch.vue";
import airportRelevance from "~~/public/api/airportRelevance.json";

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

const algolia = useAlgoliaSearch("AIRPORTS");
function findAirports (query: string) {
  if (query?.length < 1) return;
    queryAirports(algolia, query).then(hits => {
      if (!hits) return
      dropdownList.value = hits.map((airport) => {
        // if (airport.name.includes('Rail')) return
        console.log(airport)
        return {
          value: airport.iata,
          label: `${airport._highlightResult?.name.value || "Airport"} (${airport._highlightResult?.iata.value})`,
          sublabel: [
            airport._highlightResult?.city_translations?.[locale.value]?.value || airport._highlightResult?.city.value,
            countries.getName(airport.country_code, locale.value),
          ]
            .filter(Boolean)
            .join(", "),
          icon: airport.name.includes('Rail') ? "train" : "plane",
        }}).filter(Boolean)
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
