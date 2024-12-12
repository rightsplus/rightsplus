<template>
  <div class="flex flex-col @container" v-if="useAppState()" ref="container">
    <!-- <div class="flex flex-col gap-3 mb-2">
      <h2 class="text-2xl sm:text-3xl font-bold">{{ title }}</h2>
    </div> -->
    <!-- <div>Um deinen Anspruch zu prüfen brauchen wir ein paar Informationen.</div>
    <ul><li>Bei welchem Flug ist etwas schliefgelaufen?</li><li>Was ist schiefgelaufen?</li><li>Angabe zu den Passagieren?</li></ul> -->
    <AccordionItem
      index="layover"
      :modelValue="active"
      @update:modelValue="active = $event"
      headless
      :tag="{ outer: 'div', inner: 'div', title: 'h3' }"
      :collapsible="false"
    >
      <template #title>
        <SectionHeader
          :label="$t('calculator.flight.title')"
          :showValue="!!modelValue.route"
          >{{ modelValue.route }}</SectionHeader
        >
      </template>
      <template #content>
        <SelectLayover :modelValue="modelValue" />
        <div
          class="mt-10"
          v-if="
            modelValue.airport.trip.layover?.some((e) => Object.keys(e).length) && modelValue.airport.trip.departure && modelValue.airport.trip.arrival
          "
        >
          <SectionSubHeader
            :label="$t('calculator.flight.selectRoute')"
            class="mb-5"
          />
          <SelectRoute :modelValue="modelValue" />
        </div>
      </template>
    </AccordionItem>
    <AccordionItem
      index="date"
      :modelValue="active"
      @update:modelValue="active = $event"
      headless
      :tag="{ outer: 'div', inner: 'div', title: 'h3' }"
      :collapsible="false"
      v-if="modelValue.route"
    >
      <template #title>
        <SectionHeader
          label="Wann bist du geflogen?"
          :showValue="!!modelValue.date"
          >{{ flightDate }}</SectionHeader
        >
      </template>
      <template #content>
        <InputCalendar
          v-model="modelValue.date"
          class="mt-5"
        />
      </template>
    </AccordionItem>
    <AccordionItem
      v-if="
        modelValue.date &&
        !isBarred(modelValue.date) &&
        filteredFlights.length
      "
      index="flight"
      :modelValue="active"
      @update:modelValue="active = $event"
      headless
      :tag="{ outer: 'div', inner: 'div', title: 'div' }"
      :classes="{
        content: 'mt-5',
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
            <NuxtImg
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
        <Callout v-if="loading" class="justify-center">Lädt ... </Callout>
        <div v-else class="flex flex-col gap-5">
          <FlightList
            :flights="filteredFlights"
            :modelValue="modelValue.flight"
            @update:modelValue="modelValue.flight = $event"
          />
          <Callout
            type="warning"
            icon="triangle-exclamation"
            v-if="modelValue.route && modelValue.flight && !europeanUnion"
          >
            Sowohl der Abflugs- und Zielflughafen als auch die Fluggesellschaft
            haben ihren Sitz außerhalb der Europäischen Union.
          </Callout>
        </div>
      </template>
    </AccordionItem>
    <div
      v-if="
        modelValue.route &&
        modelValue.date
      "
      class="mt-5"
    >
      <Callout
        type="info"
        icon="info-circle"
        v-if="isBarred(modelValue.date)"
        ><template #title>Dein Flug ist verjährt</template
        ><span
          >Ansprüche für Flugverspätungen vor dem
          {{
            isBarred(modelValue.date)?.toLocaleDateString($i18n.locale)
          }}
          sind verjährt. Gemäß geltendem EU-Recht kannst du keine Entschädigung
          mehr einfordern.</span
        >
        <NuxtLinkLocale
          to="faq"
          class="flex gap-2 items-center mt-2 mr-auto hover:underline"
          ><FontAwesomeIcon icon="arrow-right" class="text-xs" />Mehr
          erfahren</NuxtLinkLocale
        >
      </Callout>

      <Callout
        type="error"
        icon="triangle-exclamation"
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
    </div>
  </div>
</template>
<script setup lang="ts">
import SectionHeader from "./SectionHeader.vue";
import SectionSubHeader from "./SectionSubHeader.vue";
import FlightList from "./FlightList.vue";
import type { ClaimsForm, Flight } from "@/types";
import Callout from "~/components/core/Callout.vue";
import { get24HTime } from "@/utils";
import AccordionItem from "../Accordion/AccordionItem.vue";
import { useElementSize } from "@vueuse/core";
import SelectRoute from "./Forms/SelectLeg.vue";
import SelectLayover from "./Forms/SelectLayover.vue";

const container = ref(null as HTMLElement | null);

const props = defineProps<{
  modelValue: ClaimsForm;
  title: string;
}>();
const europeanUnion = computed(() =>
  Object.values(
    useFlightStatus(props.modelValue.flight).europeanUnion.value
  ).every((e) => !e)
);
const loading = ref(true);
const error = ref(false);
const active = ref(["layover"] as string[]);

const departureCity = ref();
const arrivalCity = ref();
const { locale } = useI18n();

const filteredFlights = computed(() => {
  if (!props.modelValue.route) return [];
  const { departure, arrival } = props.modelValue.airport;
  const { getFilteredFlights } = useFlights()
  const filtered = getFilteredFlights({
    departure: departure?.iata,
    arrival: arrival?.iata,
    date: props.modelValue.date,
  });
  return filtered;
});

watch(
  () => props.modelValue.date || props.modelValue.airport,
  () => {
    const { departure, arrival } = props.modelValue.airport;
    getCities([departure?.iata, arrival?.iata], locale.value).then(
      ([departure, arrival]) => {
        departureCity.value = departure;
        arrivalCity.value = arrival;
      }
    );
    loading.value = true;
    fetchFlights({
      departure: departure?.iata,
      arrival: arrival?.iata,
      date: props.modelValue.date,
      locale: locale.value,
    })
      .catch(() => (error.value = true))
      .finally(() => (loading.value = false));
    if (props.modelValue.date && !props.modelValue.flight) {
      active.value = ["flight"];
    }
  },
  { immediate: true, deep: true }
);

watch(
  filteredFlights,
  (val) => {
    if (
      !val.some((e) => e.flight.iata === props.modelValue.flight?.flight.iata)
    ) {
      props.modelValue.flight = null;
    }
  }
);

const logoError = ref(false);
const logo = computed(() => {
  let iata =
    props.modelValue.flight?.flight.codeshared?.airline_iata?.toUpperCase() ||
    props.modelValue.flight?.airline?.iata;
  return getAirlineLogo(iata, 80);
});

const { width } = useElementSize(container);
const flightDate = computed(() => {
  const date = new Date(props.modelValue.date);
  const format = {
    weekday: width.value > 480 ? "long" : undefined,
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;
  return date.toLocaleDateString(locale.value, format);
});
const departureTime = computed(() => {
  const date = new Date(props.modelValue.flight?.departure.scheduled || "");
  const format = { hour: "2-digit", minute: "2-digit" } as const;
  return date.toLocaleTimeString(locale.value, format);
});
</script>
