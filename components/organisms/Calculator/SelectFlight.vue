<template>
  <div
    class="flex flex-col gap-2 @container"
    v-if="useAppState()"
    ref="container"
  >
    <div class="flex flex-col gap-3">
      <h2 class="text-2xl sm:text-3xl font-bold">{{ title }}</h2>
    </div>
    <AccordionItem
      index="date"
      :modelValue="active"
      @update:modelValue="active = $event"
      headless
      :tag="{ outer: 'div', inner: 'div', title: 'h3' }"
      :collapsible="false"
    >
      <template #title>
        <SectionHeader
          label="Wann bist du geflogen?"
          :showValue="!!modelValue.flight_date"
          >{{ flightDate }}</SectionHeader
        >
      </template>
      <template #content>
        <InputDate v-model="modelValue.flight_date" class="mt-5" />
      </template>
    </AccordionItem>
    <div v-if="modelValue.flight_date">
      <Callout
        type="info"
        icon="info-circle"
        v-if="isBarred(modelValue.flight_date)"
        ><template #title>Dein Flug ist verjährt</template
        ><span
          >Ansprüche für Flugverspätungen vor dem
          {{
            isBarred(modelValue.flight_date)?.toLocaleDateString($i18n.locale)
          }}
          sind verjährt. Gemäß geltendem EU-Recht kannst du keine Entschädigung
          mehr einfordern.</span
        >
        <NuxtLink
          :to="'/faq/verjaehrung'"
          class="flex gap-2 items-center mt-2 mr-auto hover:underline"
          ><FontAwesomeIcon icon="arrow-right" class="text-xs" />Mehr
          erfahren</NuxtLink
        >
      </Callout>

      <Callout
        type="error"
        icon="exclamation-triangle"
        v-else-if="!filteredFlights.length && error"
        >Flüge konnten nicht geladen werden
      </Callout>

      <Callout
        type="info"
        icon="info-circle"
        v-else-if="!filteredFlights.length && !loading"
      >
        An diesem Datum konnten wir keinen Flug von
        {{ departureCity }}
        nach
        {{ arrivalCity }}
        finden.
        <!-- <FormKit type="button">Mit Flugnummer finden</FormKit> -->
      </Callout>
      <Callout v-if="loading" class="justify-center">Lädt ... </Callout>
      <div
        v-else-if="!isBarred(modelValue.flight_date) && filteredFlights.length"
        class="w-full flex flex-col gap-3"
      >
        <AccordionItem
          index="flight"
          :modelValue="active"
          @update:modelValue="active = $event"
          headless
          :tag="{ outer: 'div', inner: 'div', title: 'div' }"
          :classes="{
            content: 'mt-5',
            title:
              'w-full flex justify-between items-center text-base sm:text-lg md:text-xl leading-tight font-medium'
          }"
          :collapsible="false"
        >
          <template #title>
            <SectionHeader
              label="Welchen Flug hast du genommen?"
              :showValue="!!modelValue.flight"
            >
              <div
                class="flex items-center justify-center w-7 h-7 border border-neutral-200 rounded-full"
              >
                <img
                  v-show="!logoError"
                  @error="logoError = true"
                  @load="logoError = false"
                  :src="logo"
                  :alt="modelValue.flight?.airline?.name"
                  class="w-5"
                />
              </div>
              <span>{{ departureTime }}</span>
            </SectionHeader>
          </template>
          <template #content>
            <div v-if="!loading" class="flex flex-col gap-5">
              <FlightList
                :flights="filteredFlights"
                :modelValue="modelValue.flight"
                @update:modelValue="modelValue.flight = $event"
              />
              <Callout
                type="warning"
                icon="exclamation-triangle"
                v-if="modelValue.route && modelValue.flight && !europeanUnion"
              >
                Sowohl der Abflugs- und Zielflughafen als auch die
                Fluggesellschaft haben ihren Sitz außerhalb der Europäischen
                Union.
              </Callout>
            </div>
          </template>
        </AccordionItem>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SectionHeader from "./SectionHeader.vue";
import FlightList from "./FlightList.vue";
import type { ClaimsForm, Flight } from "@/types";
import InputDate from "@/components/molecules/InputDate.vue";
import Callout from "@/components/molecules/Callout.vue";
import { get24HTime } from "@/utils";
import AccordionItem from "../Accordion/AccordionItem.vue";
import { useElementSize } from "@vueuse/core";

const container = ref(null as HTMLElement | null);

const props = defineProps<{
  modelValue: ClaimsForm;
  title: string;
}>();
const europeanUnion = computed(() =>
  Object.values(
    useFlightStatus(props.modelValue.flight).europeanUnion.value
  ).every(e => !e)
);
defineEmits(["back", "submit"]);
const loading = ref(true);
const error = ref(false);
const active = ref(["date"] as string[]);

const departureCity = ref();
const arrivalCity = ref();
const { locale } = useI18n();
watch(
  () => props.modelValue.flight,
  () => {},
  { immediate: true, deep: true }
);

watch(
  () => props.modelValue.flight_date || props.modelValue.airport,
  () => {
    const { departure, arrival } = props.modelValue.airport;
    getCities([departure?.iata, arrival?.iata], locale.value).then(
      ([departure, arrival]) => {
        departureCity.value = departure;
        arrivalCity.value = arrival;
      }
    );
    loading.value = true
    fetchFlights({
      departure: departure?.iata,
      arrival: arrival?.iata,
      date: props.modelValue.flight_date
    })
      .catch(() => (error.value = true))
      .finally(() => (loading.value = false));
    if (props.modelValue.flight_date) active.value = ["flight"];
  },
  { immediate: true, deep: true }
);
const filteredFlights = computed(() => {
  if (!props.modelValue.route) return [];
  const { departure, arrival } = props.modelValue.airport;
  const filtered =  getFilteredFlights({
    departure: departure?.iata,
    arrival: arrival?.iata,
    date: props.modelValue.flight_date
  });
  return filtered;
});

watch(() => filteredFlights.value, (val) => {
  if (!val.find(e => e.flight.iata === props.modelValue.flight?.flight.iata)) {
    props.modelValue.flight = null
  }
});

const logoError = ref(false);
const logo = computed(() => {
  let iata =
    props.modelValue.flight?.flight.codeshared?.airline_iata?.toUpperCase() ||
    props.modelValue.flight?.airline?.iata;
  return getAirlineLogo(iata, 80);
});

const { width } = useElementSize(container);
const flightDate = computed(() => {
  const date = new Date(props.modelValue.flight_date);
  const format = {
    weekday: width.value > 480 ? "long" : undefined,
    year: "numeric",
    month: "long",
    day: "numeric"
  } as const;
  return date.toLocaleDateString(locale.value, format);
});
const departureTime = computed(() => {
  const date = new Date(props.modelValue.flight?.departure.scheduled || "");
  const format = { hour: "2-digit", minute: "2-digit" } as const;
  return date.toLocaleTimeString(locale.value, format);
});
</script>
