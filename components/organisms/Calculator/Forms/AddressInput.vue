<template>
  <!-- <DropdownSearch
    :modelValue="modelValue.street"
    @update:modelValue="fillFields($event)"
    :label="label"
    :name="name"
    :id="id || name"
    :options="dropdownList"
    :prefix-icon="prefixIcon"
    :suffix-icon="suffixIcon"
    :placeholder="placeholder"
    :errors="errors"
    :loading="loading"
    @query="findAddress"
    class="col-span-full"
    autocomplete="address-line1"
  /> -->
  <FormKit
    type="text"
    autocomplete="address-line1"
    :label="$t('streetAndNumber')"
    name="street-address"
    v-model="modelValue.street"
    @input="emit('update:modelValue', { ...modelValue, street: $event })"
    outer-class="col-span-full"
  />
  <FormKit
    type="text"
    autocomplete="postal-code"
    :label="$t('postalCode')"
    name="postal-code"
    v-model="modelValue.postalCode"
    @input="emit('update:modelValue', { ...modelValue, postalCode: $event })"
    outer-class="col-span-1"
  />
  <FormKit
    type="text"
    :label="$t('city')"
    v-model="modelValue.city"
    @input="emit('update:modelValue', { ...modelValue, city: $event })"
    outer-class="col-span-3"
  />
</template>

<script lang="ts" setup>
import placekit from "@placekit/client-js";
import type { PKResult } from "@placekit/client-js";
const pk = placekit(import.meta.env.VITE_PLACEKIT_API_KEY);

import type { Address, Airport } from "@/types";
import type { DropdownItem } from "~~/components/molecules/Dropdown.vue";
import DropdownSearch from "~~/components/molecules/DropdownSearch.vue";

const props = defineProps<{
  modelValue: Address;
  name: string;
  label: string;
  placeholder?: string;
  id?: string;
  validation?: string;
  prefixIcon?: string;
  suffixIcon?: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const { t } = useI18n();

const airports = ref<Record<string, Airport>>({});
onMounted(async () => (airports.value = await useAirports()));

const { locale } = useI18n();
const dropdownList = ref<DropdownItem[]>([]);
const listReference = ref<Record<string, PKResult>>({});
const loading = ref(false);
const loadingTimeout = ref<undefined | ReturnType<typeof setTimeout>>();
const errors = ref<undefined | string[]>();
const errorTimeout = ref<undefined | ReturnType<typeof setTimeout>>();
const pkQuery = false;
function findAddress(query: string) {
  console.log(query);
  if ((query?.length || 0) < 2) return;

  const limit = 5;
  const fetchMethod = pkQuery
    ? pk.search(query, {
        countries: ["de", 'pt'],
        // countries: ["de", "ch", "gb", "es", "fr"],
        language: locale.value,
        types: ["street"],
        maxResults: limit,
      })
    : fetch(
        `https://photon.komoot.io/api/?q=${query}&lang=${locale.value}&limit=${limit}`
      );

  fetchMethod
    .then(async (data) => {
      errors.value = undefined;
      if (pkQuery) {
        const results = data?.results;
        if (!results) return;
        dropdownList.value = results.map((e) => {
          const { highlight, coordinates, city, country } = e;
          const id = coordinates.replace(/[ ,.]/g, "");
          listReference.value[id] = e;
          return {
            value: id,
            label: highlight,
            sublabel: [city, country].filter(Boolean).join(", "),
          };
        });
      } else {
        const results = (await data.json())?.features;
        dropdownList.value = results.map(({ properties }) => {
          const { name, street, housenumber, city, country, osm_id } =
            properties;
          const id = osm_id.toString();
          console.log(properties);
          const address = [street || name, street && housenumber]
            .filter(Boolean)
            .join(" ")
            ?.trim()
            ?.replace(
              new RegExp(query?.trim(), "gi"),
              (match) => `<mark>${match}</mark>`
            );
          listReference.value[id] = {
            ...properties,
            name: address,
          };
          return {
            value: id,
            label: address,
            sublabel: [city, country].filter(Boolean).join(", "),
          };
        });
      }
      dropdownList.value.push({
        value: "other",
        label: t("other"),
        sublabel: t("otherAddress"),
      });
    })
    .catch(({ transporterStackTrace }) => {
      const [message] = transporterStackTrace;
      errors.value = [message?.response?.content];
      clearTimeout(errorTimeout.value);
      errorTimeout.value = setTimeout(() => (errors.value = undefined), 5000);
    })
    .finally(() => {
      clearTimeout(loadingTimeout.value);
      loading.value = false;
    });
}

const fillFields = (street: DropdownItem) => {
  if (street?.value === "other") {
    dropdownList.value = [];
    return;
  }
  const reference = listReference.value[street.value];
  if (!reference) return;

  const {
    name,
    street: st,
    housenumber,
    zipcode,
    postcode,
    city,
  } = reference || {};
  console.log(reference);
  emit("update:modelValue", {
    street: pkQuery
      ? name
      : [st || name, st && housenumber].filter(Boolean).join(" "),
    postalCode: pkQuery ? zipcode[0] : postcode,
    city,
  });
};
</script>
