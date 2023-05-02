<template>
  <DropdownSearch
    :modelValue="modelValue?.full"
    @update:model-value="$emit('update:model-value', airports[$event.value])"
    :label="label"
    :name="name"
    :id="id || name"
    :options="dropdownList"
    @query="findAirports"
    :prefix-icon="prefixIcon"
    :suffix-icon="suffixIcon"
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
  placeholder: string;
  id?: string;
  validation?: string;
  prefixIcon?: string;
  suffixIcon?: string;
}>();
const emit = defineEmits(["update:modelValue", "suffix-icon-click", "prefix-icon-click"]);

onMounted(() => {
  emit("update:modelValue", {
    ...props.modelValue,
    full: props.modelValue?.full || "",
  })
})
watch(() => props.modelValue, (value) => {
  console.log(value)
}, { deep: true })
const { search } = useAlgoliaSearch("AIRPORTS");
const { locale } = useI18n();
const airports = useAirports();

const dropdownList = ref([] as DropdownItem[])

function findAirports (query: string) {
  if (query?.length < 1) return;
    search({ query, hitsPerPage: 10 }).then(({ hits }) => {
      dropdownList.value = hits.map((airport) => ({
        value: airport.iata,
        label: airport._highlightResult?.full.value || "Airport",
        sublabel: [
          airport._highlightResult?.city.value,
          airport.countryName?.[locale.value] ||
            countries.getName(airport.country, locale.value),
        ]
          .filter(Boolean)
          .join(", "),
        icon: "plane",
      }));
      hits.forEach((hit: Airport, i: number) => {
        const a = { ...hit };
        delete a._highlightResult;
        delete a.objectID;
        airports.value[hit.iata] = a;
      });
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
