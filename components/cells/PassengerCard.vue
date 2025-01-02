<script setup lang="ts">
import type { ClaimsForm } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useI18n } from "vue-i18n";

export type PassengerCardProps = {
  passenger: ClaimsForm["client"]["passengers"][number];
};
const props = defineProps<PassengerCardProps>();
const { t } = useI18n();
const boardingPass = computed(() => {
  const file = props.passenger.boardingPass
    ? Object.values(props.passenger.boardingPass)[0]
    : undefined;
  if (!file) return "";
  try {
    return URL.createObjectURL(file);
  } catch (err) {
    console.warn(err);
    return "";
  }
});
</script>
<template>
  <div
    v-if="passenger"
    class="rounded-lg py-3 px-3 @container border border-transparent flex flex-col gap-3 bg-neutral-100 text-gray-800"
  >
    <div class="flex gap-2">
      <FontAwesomeIcon
        :icon="'user'"
        class="mt-1 text-gray-400 shrink-0"
        fixed-width
      />
      <div class="flex flex-col">
        <span class="font-bold"
          >{{ passenger.firstName }} {{ passenger.lastName }}</span
        >
        <span class="text-sm">{{ t("email") }}: {{ passenger.email }}</span>

        <span class="text-sm"
          >{{ t("address") }}: {{ passenger.address.street }} ·
          {{ passenger.address.postalCode }}
          {{ passenger.address.city }}</span
        >

        <span class="text-sm">{{ t("iban") }}: {{ passenger.iban }}</span>
        <div v-if="passenger.isMinor">
          <span class="text-sm"
            >{{ t("isMinor") }}:
            {{ passenger.isMinor ? t("yes") : t("no") }}</span
          >
          <span class="text-sm"
            >{{ t("dateOfBirth") }}: {{ passenger.dateOfBirth }}</span
          >
          <span class="text-sm"
            >{{ t("guardian") }}: {{ passenger.guardian?.firstName }}
            {{ passenger.guardian?.lastName }}</span
          >
        </div>
      </div>
    </div>
    <div v-if="passenger.boardingPass" class="flex gap-2">
      <FontAwesomeIcon
        :icon="'ticket-airline'"
        class="mt-1 text-gray-400 shrink-0"
        fixed-width
      />
      <div class="flex flex-col">
        <span class="font-bold">{{ t("boardingPass") }}</span>
        <div
          v-for="[fileName, file] in Object.entries(passenger.boardingPass)"
          :key="fileName"
        >
          <img :src="file" class="my-1 max-h-62" />
        </div>
      </div>
    </div>
  </div>
</template>
