<template>
  <component
    :is="is || 'div'"
    class="rounded-lg py-3 px-5 @container border border-transparent flex flex-col gap-3"
    :class="{
      'bg-gray-700 text-white': selected,
      'bg-neutral-100 text-gray-800': !selected,
      'hover:bg-neutral-50 hover:border-neutral-100':
        !selected && !disabled && is === 'button',
    }"
    @click="actionButton ? undefined : emit('click')"
  >
    <div class="flex gap-2 sm:gap-5 items-center w-full">
      <AirlineLogo
        class="-ml-2 hidden @md:flex"
        :airline="flight.airline"
        size="lg"
      />
      <div class="flex flex-col items-start text-start">
        <span
          class="text-sm leading-none"
          v-if="airports && flight.departure && flight.arrival"
          ><span class="font-bold">{{ city.departure }}</span>
          {{ $t("to") }}
          <span class="font-bold">{{ city.arrival }}</span></span
        >

        <span
          v-if="flight.departure && flight.arrival"
          class="text-lg font-bold flex items-center gap-3"
          >{{ time(flight.departure.scheduledTime)
          }}<FontAwesomeIcon icon="plane" class="text-sm text-gray-400" />{{
            time(flight.arrival.scheduledTime)
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
          <div class="">
            <span>{{ flight.airline?.name }}</span
            >{{ " "
            }}<span v-if="flight?.codeshared?.airline.name" class="opacity-50">
              {{
                $t("operatedBy", {
                  airline: flight?.codeshared?.airline.name,
                })
              }}</span
            >
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-1 items-center ml-auto shrink-0">
        <span
          class="ml-auto text-gray-400 text-base font-medium leading-none whitespace-nowrap"
          >{{ iata }}</span
        >
      </div>
      <FontAwesomeIcon
        v-if="is === 'button'"
        icon="angle-right"
        class="text-gray-400 text-base shrink-0"
      />
    </div>
    <template v-if="compensation">
      <hr class="w-full mt-2" />
    </template>
    <template v-if="actionButton">
      <hr class="w-full mt-2" />
      <div class="flex justify-between items-center">
        <span
          class="text-sm font-medium leading-none whitespace-nowrap px-3 py-1.5 rounded-full"
          :class="status.class"
          >{{ status.text }}</span
        >
        <Button @click="emit('click')" v-bind="actionButton" />
      </div>
    </template>
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
};
const props = defineProps<FlightCardProps>();

const emit = defineEmits(["click"]);
const iata = computed(() => {
  return `${props.flight.airline.iata} ${props.flight.flight.number}`;
});
const { t } = useI18n();
const status = computed(() => {
  const s =
    props.flight.status === "cancelled"
      ? "cancelled"
      : props.flight.arrival?.delay > 0
      ? "delayed"
      : "landed";
  return {
    cancelled: {
      class: "bg-red-100 text-red-600",
      text: t("cancelled"),
    },
    delayed: {
      class: "bg-yellow-100 text-yellow-700",
      text: t("delayed.by", {
        value: getDuration(props.flight.arrival?.delay),
      }),
    },
    landed: {
      class: "bg-green-100 text-green-600",
      text: t("onTime"),
    },
  }[s];
});

const city = useCities({
  departure: props.flight.departure?.iata,
  arrival: props.flight.arrival?.iata,
});

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

  return timeDifferenceDays !== 0 ? Math.floor(timeDifferenceDays) : 0;
};
const time = (time: string) => {
  return new Date(time).toLocaleTimeString(useI18n().locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
