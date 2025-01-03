<template>
  <component
    :is="is || 'div'"
    class="rounded-lg py-3 px-5 @container border border-transparent flex flex-col gap-3"
    :class="{
      'bg-gray-700 text-white': selected,
      'bg-neutral-100 text-gray-800': !selected,
      'hover:bg-neutral-50 hover:border-neutral-100 focus-ring':
        !selected && !disabled && is === 'button',
    }"
    @click="
      actionButton
        ? undefined
        : emit(flight.type === 'toggle' ? 'toggle' : 'click')
    "
  >
    <div
      v-if="flight.type === 'toggle'"
      class="flex gap-2 items-center w-full justify-center text-sm text-gray-400"
    >
      <div class="hidden @md:flex gap-1 flex-row-reverse" v-if="!groupOpen">
        <AirlineLogo
          v-for="airline in flight.airlines"
          :airline="airline"
          size="sm"
          class="-ml-4"
        />
      </div>
      <span class="font-medium">{{
        groupOpen ? "Weniger Anzeigen" : "Mehr Anzeigen"
      }}</span
      ><FontAwesomeIcon
        icon="angle-down"
        class="duration-300"
        :class="groupOpen ? 'rotate-180' : ''"
      />
    </div>
    <div v-else class="flex gap-2 sm:gap-5 items-center w-full">
      <AirlineLogo
        class="-ml-2 hidden @md:flex"
        :airline="flight.airline"
        size="lg"
      />
      <div class="flex flex-col items-start text-start">
        <span
          class="text-sm leading-none"
          v-if="flight.departure && flight.arrival"
          ><span class="font-bold">{{ city.departure?.city }}</span>
          {{ $t("to") }}
          <span class="font-bold">{{ city.arrival?.city }}</span>
          <!-- <span v-if="showDate && flight.departure">{{
            getLocalizedTime(flight.departure.scheduledTime)
          }}</span> -->
        </span>

        <span
          v-if="flight.departure && flight.arrival"
          class="text-lg font-bold flex items-center gap-3"
          >{{ getLocalizedTime(flight.departure.scheduledTime)
          }}<FontAwesomeIcon icon="plane" class="text-sm text-gray-400" />{{
            getLocalizedTime(flight.arrival.scheduledTime)
          }}<span v-if="overNight(flight)" class="-ml-2 text-gray-500 text-xs"
            >+{{ overNight(flight) }}</span
          ></span
        >
        <div class="flex items-center gap-2 text-sm leading-none">
          <AirlineLogo
            :airline="flight.airline"
            size="sm"
            class="ml-auto @md:hidden"
          />
          <div :class="{ 'text-neutral-200 bg-neutral-200 rounded': pending }">
            <span>{{ airline?.name }}</span
            ><span v-if="codesharedAirline?.name" class="opacity-50">
              {{ " "
              }}{{
                $t("operatedBy", {
                  airline: codesharedAirline?.name,
                })
              }}</span
            ><span v-if="actionButton" class="text-gray-500">
              {{ " · " }}{{ iata }}</span
            >
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 items-end ml-auto shrink-0">
        <span
          v-if="!actionButton"
          class="ml-auto text-gray-400 text-base font-medium leading-none whitespace-nowrap"
          >{{ iata }}</span
        >
        <span :class="status.class">{{ status.text }}</span>
        <Button
          v-if="actionButton"
          @click="emit('click')"
          v-bind="actionButton"
        />
      </div>
      <FontAwesomeIcon
        v-if="is === 'button'"
        icon="angle-right"
        class="text-gray-400 text-base shrink-0"
      />
    </div>
  </component>
</template>

<script setup lang="ts">
import type { Flight } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AirlineLogo from "./AirlineLogo.vue";
import type { ButtonProps } from "../core/Button.vue";
export type FlightCardProps = {
  flight: Flight;
  selected?: boolean;
  is?: string;
  disabled?: boolean;
  airports?: boolean;
  compensation?: boolean;
  actionButton?: ButtonProps;
  showDate?: boolean;
  groupOpen?: boolean;
};
const props = defineProps<FlightCardProps>();

const emit = defineEmits(["click", "toggle"]);
const iata = computed(() => {
  return `${props.flight.airline.iata} ${props.flight.flight.number}`;
});
const status = useFlightStatus(props.flight, { detailed: true });

const { getCities, cities } = useGetCities();
const city = computed(() => {
  return {
    departure: cities.value[props.flight.departure.iata]?.[locale.value],
    arrival: cities.value[props.flight.arrival.iata]?.[locale.value],
  };
});
watch(
  () => props.flight,
  ({ departure, arrival }) => {
    getCities([departure.iata, arrival.iata]);
  },
  { deep: true, immediate: true }
);

const { airline, pending } = useAirline(props.flight?.airline);
const { airline: codesharedAirline } = useAirline(
  props.flight?.codeshared?.airline
);

const overNight = (flight: Flight) => {
  const getTime = (date: string) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  const timeDifferenceDays =
    (getTime(flight.arrival.scheduledTime) -
      getTime(flight.departure?.scheduledTime)) /
    (1000 * 60 * 60 * 24);
  if (timeDifferenceDays < 0)
    console.log(flight.arrival.scheduledTime, flight.departure?.scheduledTime);

  return timeDifferenceDays !== 0 ? Math.floor(timeDifferenceDays) : 0;
};
const { locale } = useI18n();
</script>
