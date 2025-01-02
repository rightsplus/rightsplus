<template>
  <ClientOnly>
    <DropdownSearch
      :modelValue="convertName(modelValue)"
      @update:modelValue="
        ($event) => {
          $emit(
            'update:modelValue',
            $event?.value ? airports[$event?.value] : {} as Airport
          );
        }
      "
      :label="label"
      :name="name"
      :id="id || name"
      :options="dropdownList"
      :prefix-icon="modelValue?.name?.includes('Rail') ? 'train' : prefixIcon"
      :suffix-icon="suffixIcon"
      :placeholder="placeholder || fallbackPlaceholder"
      :errors="errors"
      :loading="loading"
      :disabled="disabled"
      @query="findAirports"
      v-bind="$attrs"
    />
  </ClientOnly>
</template>

<script lang="ts" setup>
import { countries } from "@/config/countries";
import type { Airport } from "@/types";
import type { DropdownItem } from "~~/components/molecules/Dropdown.vue";
import DropdownSearch from "~~/components/molecules/DropdownSearch.vue";
const props = defineProps<{
  modelValue: Airport | undefined;
  name: string;
  label: string;
  placeholder?: string;
  id?: string;
  validation?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  disabled?: boolean;
}>();
const emit = defineEmits<{
  "update:modelValue": [value?: Airport];
}>();

const { t } = useI18n();
emit("update:modelValue", props.modelValue || ({} as Airport));
const { airports } = useAirports();

const { locale } = useI18n();
const convertName = (value?: Airport) =>
  value?.iata ? `${value?.name} (${value?.iata})` : value?.name;
const dropdownList = ref<DropdownItem[]>([]);
const loading = ref(false);
const loadingTimeout = ref<undefined | ReturnType<typeof setTimeout>>();
const errors = ref<undefined | string[]>();
const errorTimeout = ref<undefined | ReturnType<typeof setTimeout>>();
const algolia = useAlgoliaSearch("AIRPORTS");
// const algoliaIndex = useAlgoliaInitIndexFull("AIRPORTS");

const mapAirports = (airport: Airport) => ({
  value: airport.iata,
  label: `${airport._highlightResult?.name.value || "Airport"} (${
    airport._highlightResult?.iata.value
  })`,
  sublabel: [
    getCityTranslation(airport, { highlight: true, locale: locale.value }),
    countries.getName(airport.country_code, locale.value),
  ]
    .filter(Boolean)
    .join(", "),
  icon: airport.name.includes("Rail") ? "train" : "plane-up",
});
function findAirports(query: string) {
  if (query?.length < 1) return;

  clearTimeout(loadingTimeout.value);
  loadingTimeout.value = setTimeout(() => {
    if (query?.length < 1) return;
    loading.value = true;
  }, 200);

  queryAirports(algolia, query)
    .then((hits) => {
      errors.value = undefined;
      if (!hits) return;
      dropdownList.value = hits
        .filter((airport: Airport) => !airport.name.includes("Rail"))
        .map(mapAirports);
    })
    .catch(({ transporterStackTrace }) => {
      const [message] = transporterStackTrace || [];
      errors.value = [message?.response?.content];
      clearTimeout(errorTimeout.value);
      errorTimeout.value = setTimeout(() => (errors.value = undefined), 5000);
    })
    .finally(() => {
      clearTimeout(loadingTimeout.value);
      loading.value = false;
    });
}

const fallbackPlaceholder = computed(() => {
  const departures = {
    BER: "Berlin",
    FRA: "Frankfurt",
    LHR: "London",
    CDG: "Paris",
    MUC: "Munich",
    VIE: "Vienna",
    AMS: "Amsterdam",
    BCN: "Barcelona",
    MAD: "Madrid",
    MXP: "Milan",
    ZRH: "Zurich",
    ISL: "Istanbul",
    FCO: "Rome",
    CPH: "Copenhagen",
    ARN: "Stockholm",
    OSL: "Oslo",
  };
  const arrivals = {
    JFK: "New York",
    SIN: "Singapore",
    DXB: "Dubai",
    BKK: "Bangkok",
    HKG: "Hong Kong",
    PVG: "Shanghai",
    ICN: "Seoul",
    SYD: "Sydney",
    LAX: "Los Angeles",
    SFO: "San Francisco",
    ORD: "Chicago",
    YYZ: "Toronto",
    YVR: "Vancouver",
    YUL: "Montreal",
    CPT: "Cape Town",
    NRT: "Tokyo",
    TLV: "Tel Aviv",
  };
  const exampleAirports = props.name === "arrival" ? arrivals : departures;

  const randomIata = Object.keys(exampleAirports)[
    Math.floor(Math.random() * Object.keys(exampleAirports).length)
  ] as keyof typeof exampleAirports;

  return t("forExample", {
    value: `${exampleAirports[randomIata]} ${t("or")} ${randomIata}`,
  });
});
</script>
