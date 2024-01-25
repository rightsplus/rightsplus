<template>
  <div class="flex flex-col gap-5">
    <h1 class="text-3xl font-bold">Welches Problem ist aufgetreten?</h1>
    <DisruptionNotice v-if="status" :status="status" :modelValue="modelValue" />

    <div class="relative z-10">
      <AccordionItem
        index="disruptionType"
        :modelValue="active"
        @update:modelValue="active = $event"
        headless
        :tag="{ outer: 'div', inner: 'div', title: 'h3' }"
        :collapsible="false"
      >
        <template #title>
          <SectionHeader
            label="Was ist schiefgelaufen?"
            :showValue="!!modelValue.disruption.type"
            >{{
              disruptions.find((e) => e.value === modelValue.disruption.type)
                ?.label
            }}</SectionHeader
          >
        </template>
        <template #content>
          <DropdownButton
            label="Flugstatus"
            name="disruptionType"
            v-model="modelValue.disruption.type"
            :options="disruptions"
            prefix-icon="exclamation-triangle"
          />
          <div
            class="flex flex-col gap-3 mt-5"
            v-if="
              modelValue.disruption.type === 'cancelled' ||
              modelValue.disruption.type === 'delayed'
            "
          >
            <SectionSubHeader
              :label="
                modelValue.disruption.type === 'cancelled'
                  ? `Wann wurdest du darüber informiert?`
                  : `Wie groß war die Verspätung bei deiner Ankunft?`
              "
            />
            <div class="grid sm:grid-cols-3 gap-3">
              <ButtonLarge
                v-for="c in modelValue.disruption.type === 'cancelled'
                  ? cancelledDetails
                  : delayedDetails"
                :key="c.value"
                @click.prevent="modelValue.disruption.details = c.value"
                :selected="modelValue.disruption.details === c.value"
                :name="c.value"
                :label="c.label"
                :preLabel="c.preLabel"
              />
            </div>
          </div>

          <div
            class="flex flex-col gap-3 mt-5"
            v-if="
              modelValue.disruption.type === 'delayed' &&
              ['<3'].includes(modelValue.disruption.details || '')
            "
          >
            <SectionSubHeader
              :label="`Hast du wegen der Verspätung deinen Anschlussverpasst?`"
            />
            <div class="grid sm:grid-cols-2 gap-3">
              <ButtonLarge
                v-for="c in [
                  {
                    value: false,
                    label: $t('no'),
                    subLabel: `Ich habe ${arrivalCity || $t('myDestination')} wie geplant erreicht.`,
                  },
                  {
                    value: true,
                    label: $t('yes'),
                    subLabel: 'Ich habe meinen Anschluss verpasst',
                  },
                ]"
                :key="c.value.toString()"
                @click.prevent="modelValue.disruption.replacement = c.value"
                :selected="modelValue.disruption.replacement === c.value"
                :name="c.value.toString()"
                :label="c.label"
                :subLabel="c.subLabel"
              />
            </div>
            <!-- {{ modelValue.disruption }} -->

            <div class="flex flex-col gap-3 mt-5" 
                v-if="modelValue.disruption.replacement">
              <SectionSubHeader
                :label="`Ist dein Ersatzflug hier aufgeführt?`"
              />
              <FlightList
                :flights="
                  getFilteredFlights({
                    departure: modelValue.airport.departure?.iata,
                    arrival: modelValue.airport.arrival?.iata,
                    date: props.modelValue.flight_date,
                    custom: isReplacementFlightWithinBounds,
                  })
                "
                :modelValue="modelValue.disruption.replacementFlight"
                @update:modelValue="
                  (e) => {
                    modelValue.disruption.replacementFlight = e;
                  }
                "
              />
            </div>
          </div>

          <div
            class="flex flex-col gap-3 mt-5"
            v-if="
              modelValue.disruption.type === 'cancelled' &&
              ['<7', '8-14'].includes(modelValue.disruption.details || '')
            "
          >
            <SectionSubHeader :label="`Wurde Ersatzbeförderung angeboten?`" />
            <div class="grid sm:grid-cols-2 gap-3">
              <ButtonLarge
                v-for="c in [
                  { value: false, label: $t('no') },
                  { value: true, label: $t('yes') },
                ]"
                :key="c.value.toString()"
                @click.prevent="modelValue.disruption.replacement = c.value"
                :selected="modelValue.disruption.replacement === c.value"
                :name="c.value.toString()"
                :label="c.label"
              />
            </div>
            <div class="flex flex-col gap-3 mt-5"
                v-if="modelValue.disruption.replacement">
              <SectionSubHeader
                :label="`Ist dein Ersatzflug hier aufgeführt?`"
              />
              <FlightList
                :flights="
                  getFilteredFlights({
                    departure: modelValue.airport.departure?.iata,
                    arrival: modelValue.airport.arrival?.iata,
                    date: props.modelValue.flight_date,
                    custom: isReplacementFlightWithinBounds,
                  })
                "
                :modelValue="modelValue.disruption.replacementFlight"
                @update:modelValue="
                  (e) => {
                    modelValue.disruption.replacementFlight = e;
                  }
                "
              />
            </div>
          </div>
          <div
            class="flex flex-col gap-3 mt-5"
            v-if="
              modelValue.disruption.type === 'delayed' &&
              ['<3'].includes(modelValue.disruption.details || '') &&
              modelValue.airport.trip.layover.some(
                (e) => e.iata === modelValue.flight?.arrival.iata
              )
            "
          >
            <SectionSubHeader
              :label="`Hast du deinen Anschlussflug verpasst?`"
            />
            <div class="grid sm:grid-cols-2 gap-3">
              <ButtonLarge
                v-for="c in [
                  { value: false, label: $t('no') },
                  { value: true, label: $t('yes') },
                ]"
                :key="c.value.toString()"
                @click.prevent="
                  modelValue.disruption.connectingFlight = c.value
                "
                :selected="modelValue.disruption.connectingFlight === c.value"
                :name="c.value.toString()"
                :label="c.label"
              />
            </div>
            <SectionHeader :label="`Wähle deinen Anschlussflug?`" />
            <FlightList
              v-if="modelValue.disruption.connectingFlight"
              :flights="
                getFilteredFlights({
                  departure: modelValue.airport.arrival?.iata,
                  arrival: modelValue.airport.trip?.arrival?.iata,
                  date: props.modelValue.flight_date,
                  custom: filterConnectionFlights,
                })
              "
              :modelValue="modelValue.connectingFlight"
              @update:modelValue="
                (e) => {
                  modelValue.connectingFlight = e;
                }
              "
            />
            less time thant 45 min:
            {{
              (new Date(
                modelValue.connectingFlight?.departure.actual
              ).getTime() -
                new Date(
                  modelValue.flight?.arrival.actual_runway ||
                    modelValue.flight?.arrival.actual ||
                    modelValue.flight?.arrival.scheduled
                ).getTime()) /
              1000 /
              60
            }}
            min
          </div>
        </template>
      </AccordionItem>
      <AccordionItem
        index="disruptionCause"
        :modelValue="active"
        @update:modelValue="active = $event"
        headless
        :tag="{ outer: 'div', inner: 'div', title: 'h3' }"
        :collapsible="false"
        v-if="!['>14'].includes(modelValue.disruption.details || '')"
      >
        <template #title>
          <SectionHeader
            label="Was war die Ursache?"
            :showValue="!!modelValue.disruption.reason"
            >{{
              [...noBoardingReasons, ...cancelledDelayedReasons].find(
                (e) => e.value === modelValue.disruption.reason
              )?.label
            }}</SectionHeader
          >
        </template>
        <template #content>
          <div class="flex flex-col gap-5">
            <!--  // mindestens 14 Tage // Ersatzbeförderung -->
            <DropdownButton
              v-if="
                modelValue.disruption.type &&
                ['cancelled', 'delayed', 'noBoarding'].includes(
                  modelValue.disruption.type
                )
              "
              label="Welchen Grund hat die Airline angegeben?"
              name="actualArrivalTime"
              v-model="modelValue.disruption.reason"
              :options="
                modelValue.disruption.type === 'noBoarding'
                  ? noBoardingReasons
                  : cancelledDelayedReasons
              "
              prefix-icon="clock"
            />
          </div>
        </template>
      </AccordionItem>

      <FormKit
        v-if="
          modelValue.disruption.type === 'other' ||
          modelValue.disruption.reason === 'other' ||
          ['>14'].includes(modelValue.disruption.details || '')
        "
        type="textarea"
        label="Deine Erläuterung hilft uns deinen Fall zu bearbeiten"
        name="reason"
        v-model="modelValue.disruption.other"
        select-icon="angle-down"
        inner-class="max-w-full"
      />
      <!-- <div
      v-if="modelValue.disruption.type"
      class="text-xs cursor-pointer hover:underline mr-auto"
      @click="reset"
    >
      reset reason
    </div> -->
    </div>
    <NavigationButtons
      @previous="$emit('back')"
      @next="$emit('submit')"
      :nextDisabled="!completed"
    />
  </div>
</template>

<script setup lang="ts">
import NavigationButtons from "./NavigationButtons.vue";
import FlightList from "./FlightList.vue";
import ButtonLarge from "@/components/organisms/Calculator/ButtonLarge.vue";
import SectionHeader from "@/components/organisms/Calculator/SectionHeader.vue";
import SectionSubHeader from "@/components/organisms/Calculator/SectionSubHeader.vue";
import DisruptionNotice from "@/components/organisms/Calculator/DisruptionNotice.vue";
import DropdownButton from "@/components/molecules/DropdownButton.vue";
import { ClaimsForm, Flight } from "~~/types";
import AccordionItem from "../Accordion/AccordionItem.vue";

const props = defineProps<{
  modelValue: ClaimsForm;
}>();
const emit = defineEmits(["submit", "back"]);
const active = ref<string[]>(["disruptionType"]);
const {
  delayedDetails,
  cancelledDetails,
  disruptions,
  noBoardingReasons,
  cancelledDelayedReasons,
} = useDisruption(props.modelValue.flight);

const status = ref(null as null | ReturnType<typeof useFlightStatus>);

const completed = computed(() => {
  if (!props.modelValue.disruption.type) return;
  if (props.modelValue.disruption.type === "other") return true;
  if (
    props.modelValue.disruption.type === "noBoarding" &&
    props.modelValue.disruption.reason
  )
    return true;
  if (props.modelValue.disruption.details && props.modelValue.disruption.reason)
    return true;
});

const arrivalCity = ref();
const { locale } = useI18n();
watch(
  () => props.modelValue.flight,
  () => {
    if (props.modelValue.flight)
      getCities([props.modelValue.flight.arrival.iata], locale.value).then(([arrival]) => {
        arrivalCity.value = arrival;
      });
  },
  { immediate: true, deep: true }
);
const submitHandler = () => emit("submit");
const reset = () => {
  props.modelValue.disruption = {
    type: null,
    details: null,
    reason: null,
    other: null,
  };
};

const isReplacementFlightWithinBounds = (flight: Flight) => {
  if (!props.modelValue.flight) return false;
  if (flight.flight.iata?.toUpperCase() === props.modelValue.flight.flight.iata)
    return false;
  // 0-7 Tage: max 1h vor planm. Abflug gestartet + max 2h nach planm. Ankunft gelandet
  // 8-14 Tage: max 2h vor planm. Abflug gestartet + max 4h nach planm. Ankunft gelandet
  const { details } = props.modelValue.disruption;
  const { departure, arrival } = props.modelValue.flight;
  const arrivalBuffer = "<7" === details ? 3600000 : 7200000;
  const departureBuffer = "<7" === details ? 7200000 : 14400000;

  return (
    !!details &&
    ["<7", "8-14"].includes(details) &&
    new Date(flight.departure.actual || flight.departure.scheduled).getTime() -
      new Date(departure.scheduled).getTime() <=
      arrivalBuffer &&
    new Date(arrival.scheduled).getTime() -
      new Date(flight.arrival.actual || flight.arrival.scheduled).getTime() <=
      departureBuffer
  );
};
const filterConnectionFlights = (flight: Flight) => {
  if (!props.modelValue.flight) return false;

  const { arrival } = props.modelValue.flight;
  // const buffer = 1800000; // 30 min
  const buffer = 2700000; // 45 min

  return (
    new Date(flight.departure.actual || flight.departure.scheduled).getTime() -
      new Date(arrival.scheduled).getTime() >
    buffer
  );
};
onMounted(() => {
  status.value = useFlightStatus(props.modelValue.flight);
  if (status.value?.cancelled.value) {
    props.modelValue.disruption.type = "cancelled";
  } else if (status.value?.delayed.value > 0) {
    props.modelValue.disruption.type = "delayed";
    if (status.value?.delayed.value < 180) {
      props.modelValue.disruption.details = delayedDetails[0].value;
    } else if (status.value?.delayed.value >= 240) {
      props.modelValue.disruption.details = delayedDetails[2].value;
    } else {
      props.modelValue.disruption.details = delayedDetails[1].value;
    }
  }
});

watch(
  () => props.modelValue.disruption.type,
  (current, old) => {
    props.modelValue.disruption.details = null;
    const similar = ["delayed", "cancelled"];
    if (!similar.includes(current || "") || !similar.includes(old || "")) {
      props.modelValue.disruption.reason = null;
    }
  }
);
watch(
  () => props.modelValue,
  () => {
    fetchFlights({
      departure: props.modelValue.airport.departure.iata,
      arrival: props.modelValue.airport.arrival.iata,
      date: props.modelValue.flight_date,
    });
    fetchFlights({
      departure: props.modelValue.airport.arrival.iata,
      arrival: props.modelValue.airport.trip.arrival.iata,
      date: props.modelValue.flight_date,
    });
  },
  { deep: true }
);
</script>
