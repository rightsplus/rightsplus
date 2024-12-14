<script setup lang="ts">
import type { ClaimsForm, Flight, RowBooking } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AirlineLogo from "./AirlineLogo.vue";
import type { ButtonProps } from "../core/Button.vue";
export type FlightCardProps = {
  flight: Flight;
  booking: RowBooking;
  selected?: boolean;
  is?: string;
  disabled?: boolean;
  airports?: boolean;
  compensation?: boolean;
  actionButton?: ButtonProps;
  showDate?: boolean;
};
const props = defineProps<FlightCardProps>();

const emit = defineEmits(["click"]);
const { t, n } = useI18n();
const iata = computed(() => {
  return `${props.flight.airline.iata} ${props.flight.flight.number}`;
});
const status = useFlightStatus(props.flight, { detailed: true });
const airportIatas = computed(() => ({
  departure: props.flight.departure,
  arrival: props.flight.arrival,
}))
const city = useCities(airportIatas.value);
const { airline, pending } = useAirline(props.flight?.airline);
const { airline: codesharedAirline } = useAirline(
  props.flight?.codeshared?.airline
);

const { locale } = useI18n();

const arrivalTime = computed(() => {
  const { actualTime } = props.flight?.arrival || {};
  // console.log(flight.value)
  return actualTime;
});
const { airports, query } = useAirports();
onMounted(() => {
  query([props.booking.trip?.departure, props.booking.trip?.arrival]);
});
const distance = computed(() =>
  getAirportDistance(
    airports.value[props.booking.trip?.departure],
    airports.value[props.booking.trip?.arrival]
  )
);
</script>
<template>
  <div
    class="rounded-lg py-3 px-5 @container border border-transparent bg-neutral-100 text-gray-800 grid gap-3"
  >
    <div class="flex flex-wrap @md:flex-nowrap gap-3 sm:gap-5">
      <div class="grid flex-col @md:basis-1/2 w-full grow">
        <span
          class="text-xs text-neutral-500"
          v-if="city.departure && city.arrival"
          ><span class="font-bold">{{ city.departure }}</span>
          {{ t("to") }}
          <span class="font-bold">{{ city.arrival }}</span></span
        >
        <div class="flex items-center justify-between gap-2">
          <div class="flex flex-col">
            <span class="font-bold text-xl">{{ flight.departure.iata }}</span>
            <span class="text-sm text-neutral-500">{{ city.departure }}</span>
          </div>
          <FontAwesomeIcon icon="plane" class="text-gray-400" />
          <div class="flex flex-col items-end">
            <span class="font-bold text-xl">{{ flight.arrival.iata }}</span>
            <span class="text-sm text-neutral-500">{{ city.arrival }}</span>
          </div>
        </div>
      </div>

      <div class="h-full w-[1px] bg-neutral-200 hidden @md:block" />

      <div
        class="flex justify-between items-center gap-2 text-sm leading-none @md:basis-1/2 w-full grow"
      >
        <div class="flex items-center gap-2">
          <AirlineLogo :airline="flight.airline" size="sm" />
          <div class="flex flex-col gap-1">
            <span class="flex flex-col gap-1">
              <span class="font-bold">{{ airline?.name }}</span>
              <span
                v-if="codesharedAirline?.name"
                class="opacity-50 text-xs leading-none"
                >{{
                  t("operatedBy", {
                    airline: codesharedAirline?.name,
                  })
                }}</span
              >
            </span>
          </div>
        </div>
        <span class="whitespace-nowrap font-bold"
          >{{ flight.airline.iata }} {{ flight.flight.number }}</span
        >
      </div>
    </div>
    <hr class="border-neutral-200" />

    <div class="grid @sm:grid-cols-2 gap-6 sm:gap-10">
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-1">
          <span class="text-sm text-neutral-500">{{
            t("scheduledArrivalTime")
          }}</span>
          <span class="font-bold flex items-center text-sm gap-3"
            ><span class="leading-0 flex items-center gap-2"
              ><FontAwesomeIcon icon="calendar" class="text-neutral-400" />{{
                getLocalizedDate(flight.arrival.scheduledTime, locale, 'short')
              }}</span
            ><span class="leading-0 flex items-center gap-2"
              ><FontAwesomeIcon icon="clock" class="text-neutral-400" />{{
                getLocalizedTime(flight.arrival.scheduledTime)
              }}</span
            >
          </span>
        </div>
        <!-- @todo: maybe do not check for status ...-->
        <div class="flex flex-col gap-1" v-if="flight?.status !== 'active'">
          <span class="text-sm text-neutral-500">{{
            t("actualArrivalTime")
          }}</span>
          <div class="font-bold flex text-sm gap-3 flex-col" v-if="arrivalTime">
            <div class="flex items-center gap-3">
              <span class="leading-0 flex items-center gap-2"
                ><FontAwesomeIcon icon="calendar" class="text-neutral-400" />{{
                  getLocalizedDate(arrivalTime, locale, 'short')
                }}</span
              ><span class="leading-0 flex items-center gap-2"
                ><FontAwesomeIcon icon="clock" class="text-neutral-400" />{{
                  getLocalizedTime(arrivalTime)
                }}</span
              >
            </div>
            <div class="flex items-center gap-3">
              <span
                class="leading-0 flex items-center gap-2 text-orange-500"
                v-if="flight.arrival.delay"
                >{{
                  t("delayed.by", { value: getDuration(flight.arrival.delay) })
                }}</span
              >
            </div>
          </div>
          <div
            class="font-bold flex items-center text-sm gap-3 text-red-500"
            v-else
          >
            <span class="leading-0 flex items-center gap-2"
              ><FontAwesomeIcon icon="plane-slash" class="text-red-500" />{{
                t("neverArrived")
              }}</span
            >
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-1">
          <span class="text-sm text-neutral-500"
            >{{ t("flightDistance") }} ({{
              t("fromTo", {
                from: booking.trip?.departure,
                to: booking.trip?.arrival,
              })
            }})</span
          >
          <span class="font-bold flex items-center text-sm gap-3">
            <span class="leading-0 flex items-center gap-2"
              ><FontAwesomeIcon
                icon="arrow-right-long"
                class="text-neutral-400"
              />{{ n(distance, "km") }}</span
            >
          </span>
        </div>
        <div class="flex flex-col gap-1" v-if="flight?.status !== 'active'">
          <span class="text-sm text-neutral-500">{{ t("flightStatus") }}</span>
          <span class="font-medium flex items-center text-sm gap-3"
            ><span :class="status.class">{{ status.text }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
