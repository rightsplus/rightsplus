<template>
  <DropdownSearch
    :modelValue="modelValue.street"
    @update:modelValue="fillFields($event)"
    :label="$t('streetAndNumber')"
    :name="name"
    :id="id || name"
    :options="dropdownList"
    :prefix-icon="prefixIcon?.street"
    :suffix-icon="suffixIcon?.street"
    :prefix-icon-class="prefixIconClass?.street"
    :suffix-icon-class="suffixIconClass?.street"
    :placeholder="placeholder?.street"
    :errors="errors"
    :loading="loading"
    @query="findAddress"
    class="col-span-full"
    autocomplete="address-line1"
  />
  <!-- <FormKit
    type="text"
    autocomplete="address-line1"
    :label="$t('streetAndNumber')"
    name="street-address"
    v-model="modelValue.street"
    @input="emit('update:modelValue', { ...modelValue, street: $event })"
    outer-class="col-span-full"
  /> -->
  <FormKit
    type="text"
    autocomplete="postal-code"
    :label="$t('postalCode')"
    name="postal-code"
    v-model="modelValue.postalCode"
    @input="emit('update:modelValue', { ...modelValue, postalCode: $event })"
    @blur="emit('blur:postalCode')"
    outer-class="col-span-1"
    :placeholder="placeholder?.postalCode"
    :suffix-icon="suffixIcon?.postalCode"
    :prefix-icon="prefixIcon?.postalCode"
    :suffix-icon-class="suffixIconClass?.postalCode"
    :prefix-icon-class="prefixIconClass?.postalCode"
  />
  <FormKit
    type="text"
    :label="$t('city')"
    v-model="modelValue.city"
    @input="emit('update:modelValue', { ...modelValue, city: $event })"
    @blur="emit('blur:city')"
    outer-class="col-span-3"
    :placeholder="placeholder?.city"
    :suffix-icon="suffixIcon?.city"
    :prefix-icon="prefixIcon?.city"
    :suffix-icon-class="suffixIconClass?.city"
    :prefix-icon-class="prefixIconClass?.city"
  />
</template>

<script lang="ts" setup>
import placekit from "@placekit/client-js";
import type { PKResult } from "@placekit/client-js";

import type { Address, Airport } from "@/types";
import type { DropdownItem } from "~~/components/molecules/Dropdown.vue";
import DropdownSearch from "~~/components/molecules/DropdownSearch.vue";

const props = defineProps<{
  modelValue: Address;
  name: string;
  label: string;
  placeholder?: Address;
  id?: string;
  validation?: string;
  prefixIcon?: Address;
  suffixIcon?: Address;
  prefixIconClass?: Address;
  suffixIconClass?: Address;
}>();
const emit = defineEmits([
  "update:modelValue",
  "blur:street",
  "blur:postalCode",
  "blur:city",
]);

const { t } = useI18n();
const { locale } = useI18n();
const dropdownList = ref<DropdownItem[]>([]);
const listReference = ref<Record<string, PKResult>>({});
const loading = ref(false);
const loadingTimeout = ref<undefined | ReturnType<typeof setTimeout>>();
const errors = ref<undefined | string[]>();
const errorTimeout = ref<undefined | ReturnType<typeof setTimeout>>();
const currentQuery = ref(props.modelValue.street);
const manual = ref(false);
async function findAddress(query: string) {
  currentQuery.value = query;

  if (!query?.length) manual.value = false;
  if (manual.value || (query?.length || 0) < 2) return;
  try {
    const fetchMethod = fetch(
      `https://photon.komoot.io/api/?q=${query}&lang=${locale.value}&layer=house`
    );

    const { features } = await (await fetchMethod).json();

    errors.value = undefined;
    const addressesObj = {} as Record<
      string,
      { value: string; label: string; sublabel: string }
    >;
    const addresses = [];

    features
      .filter(({ properties }) => properties.street && properties.housenumber)
      .forEach(({ properties }) => {
        const { name, street, housenumber, postcode, city, country, osm_id } =
          properties;
        const id = osm_id.toString();

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
        const unique = `${address}-${postcode}-${city}-${country}`;
        addressesObj[unique] = {
          value: id,
          label: address,
          sublabel: [[postcode, city].filter(Boolean).join(" "), country]
            .filter(Boolean)
            .join(", "),
        };
        addresses.push({
          value: id,
          label: address,
          sublabel: [[postcode, city].filter(Boolean).join(" "), country]
            .filter(Boolean)
            .join(", "),
        });
      });
    dropdownList.value = Object.values(addressesObj).slice(0, 3);
    if (dropdownList.value?.length) {
      dropdownList.value.push({
        value: "manual",
        label: t("manualInput"),
        cancel: true,
      });
    }
  } catch (e) {
    clearTimeout(errorTimeout.value);
    errorTimeout.value = setTimeout(() => (errors.value = undefined), 5000);
  } finally {
    clearTimeout(loadingTimeout.value);
    loading.value = false;
  }
}

const fillFields = (street: DropdownItem) => {
  if (!street?.value) {
    emit("update:modelValue", { street: props.modelValue.street });
    return;
  }
  if (street?.value === "manual") {
    emit("update:modelValue", { street: currentQuery.value });
    dropdownList.value = [];
    manual.value = true;
    return;
  }
  const reference = listReference.value[street.value];
  if (!reference) return;

  const { name, street: st, housenumber, postcode, city } = reference || {};
  console.log(reference);
  emit("update:modelValue", {city: ''})
  setTimeout(() => {
    emit("update:modelValue", {
      street: [st || name, st && housenumber].filter(Boolean).join(" "),
      postalCode: postcode,
      city: city,
    });
  });
};
</script>
