<template>
  <div class="flex flex-col gap-5">
    <div class="flex gap-5">
      <FontAwesomeIcon
        :icon="statuses[statusType].icon"
        :class="['shrink-0 mt-1', statuses[statusType].iconClass]"
      />
      <div class="flex flex-col gap-2">
        <h1 class="text-xl font-bold">
          <span>{{ statuses[statusType].text }}</span>
        </h1>

        <span class="" v-if="statuses[statusType].description">{{
          statuses[statusType].description
        }}</span>
      </div>
    </div>
    <hr />
    <span class="" v-if="statusType === 'landed'"
      >Möchtest du trotzdem mit der Fallprüfung fortfahren?</span
    >
  </div>
</template>
<script setup lang="ts">
import Callout from "~/components/core/Callout.vue";
import type { ClaimsForm } from "@/types";

const props = defineProps<{
  status: ReturnType<typeof useFlightStatus>;
  modelValue: ClaimsForm;
}>();
const { locale, t } = useI18n();
const arrivalCity = ref();
onMounted(() => {
  if (!props.modelValue.flight?.arrival.iata) return;
  getCities([props.modelValue.flight?.arrival.iata], locale.value).then(
    ([arrival]) => {
      console.log(arrival);
      arrivalCity.value = arrival;
    }
  );
});

const statusType = computed(() =>
  props.status?.cancelled.value
    ? "cancelled"
    : props.status?.delayed.value
    ? "delayed"
    : "landed"
);
const statuses = computed(() => {
  const delay = getDuration(getDelay(props.modelValue.flight?.arrival));
  return {
    cancelled: {
      icon: "fa-plane-slash",
      iconClass: "text-primary-500",
      text: t("Du hast möglichweise Anspruch auf Entschädigung!"),
      description: t(
        "Laut unseren Informationen wurde dein Flug annulliert. Wir benötigen noch einige Angaben, um deinen Anspruch zu prüfen."
      ),
    },
    delayed: {
      icon: "fa-clock",
      iconClass: "text-primary-500",
      text: `Laut unseren Informationen ist dein Flug mit ${delay} Verspätung in ${arrivalCity.value} gelandet.`,
      description: t("Wir helfen dir, deine Entschädigung zu erhalten."),
    },
    landed: {
      icon: "fa-plane-circle-check",
      iconClass: "text-yellow-500",
      text: `Laut unseren Informationen ist dein Flug ohne große Verspätung in ${arrivalCity.value} gelandet.`,
      description: t(""),
    },
  };
});
</script>
