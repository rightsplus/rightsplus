<template>
  <div class="flex flex-col gap-5 bg-neutral-100 rounded-xl p-4 px-5">
    <div
      class="grid grid-cols-[1fr_auto_1fr] items-center w-full text-sm font-medium text-gray-500"
    >
      <FlightResultAirport
        label="Abflug"
        :flight="flight.departure"
        :allAirports="allAirports"
      />
      <div class="text-center text-primary-500">
        <FontAwesomeIcon icon="plane" />
      </div>
      <FlightResultAirport
        label="Ankunft"
        :flight="flight.arrival"
        :allAirports="allAirports"
        class="items-end text-right"
      />
    </div>
    <!-- <pre class="text-sm">{{ flight }}</pre> -->
    <ol>
      <li class="flex gap-3 items-center text-base font-medium">
        <FontAwesomeIcon icon="route" />
        <span>{{ $n(distance, "km") }}</span>
      </li>
      <li v-if="!isEuMember" class="flex gap-3 items-center text-base font-medium">
        Weder Abflug- noch Ankuftsflughafen liegen in der EU.
      </li>
      <li v-if="isEuMember">
        <svg
          class="w-6 h-6"
          viewBox="0 0 707 697"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M338.84 559.906C343.33 546.086 362.881 546.086 367.371 559.906L375.557 585.098H402.046C416.577 585.098 422.619 603.693 410.863 612.234L389.433 627.803L397.618 652.996C402.109 666.816 386.291 678.307 374.536 669.766L353.106 654.197L331.676 669.766C319.92 678.307 304.103 666.816 308.593 652.996L316.779 627.803L295.348 612.234C283.593 603.693 289.634 585.098 304.165 585.098H330.654L338.84 559.906Z"
          />
          <path
            d="M338.84 43.9057C343.33 30.0861 362.881 30.0861 367.371 43.9058L375.557 69.0983H402.046C416.577 69.0983 422.619 87.6925 410.863 96.2336L389.433 111.803L397.618 136.996C402.109 150.816 386.291 162.307 374.536 153.766L353.106 138.197L331.676 153.766C319.92 162.307 304.103 150.816 308.593 136.996L316.779 111.803L295.348 96.2335C283.593 87.6925 289.634 69.0983 304.165 69.0983H330.654L338.84 43.9057Z"
          />
          <path
            d="M80.8398 301.906C85.3301 288.086 104.881 288.086 109.371 301.906L117.557 327.098H144.046C158.577 327.098 164.619 345.693 152.863 354.234L131.433 369.803L139.618 394.996C144.109 408.816 128.291 420.307 116.536 411.766L95.1057 396.197L73.6756 411.766C61.9199 420.307 46.1027 408.816 50.593 394.996L58.7785 369.803L37.3485 354.234C25.5927 345.693 31.6344 327.098 46.1652 327.098H72.6543L80.8398 301.906Z"
          />
          <path
            d="M596.84 301.906C601.33 288.086 620.881 288.086 625.372 301.906L633.557 327.098H660.046C674.577 327.098 680.619 345.693 668.863 354.234L647.433 369.803L655.619 394.996C660.109 408.816 644.292 420.307 632.536 411.766L611.106 396.197L589.676 411.766C577.92 420.307 562.103 408.816 566.593 394.996L574.779 369.803L553.349 354.234C541.593 345.693 547.635 327.098 562.165 327.098H588.654L596.84 301.906Z"
          />
          <path
            d="M521.273 484.339C525.764 470.52 545.315 470.52 549.805 484.339L557.991 509.532H584.48C599.011 509.532 605.052 528.126 593.296 536.667L571.866 552.237L580.052 577.43C584.542 591.249 568.725 602.741 556.969 594.2L535.539 578.63L514.109 594.2C502.353 602.741 486.536 591.249 491.027 577.43L499.212 552.237L477.782 536.667C466.026 528.126 472.068 509.532 486.599 509.532H513.088L521.273 484.339Z"
          />
          <path
            d="M156.406 119.472C160.897 105.653 180.448 105.653 184.938 119.472L193.124 144.665H219.613C234.143 144.665 240.185 163.259 228.429 171.8L206.999 187.37L215.185 212.562C219.675 226.382 203.858 237.874 192.102 229.333L170.672 213.763L149.242 229.333C137.486 237.874 121.669 226.382 126.16 212.562L134.345 187.37L112.915 171.8C101.159 163.259 107.201 144.665 121.732 144.665H148.221L156.406 119.472Z"
          />
          <path
            d="M156.406 484.339C160.897 470.52 180.448 470.52 184.938 484.339L193.124 509.532H219.613C234.143 509.532 240.185 528.126 228.429 536.667L206.999 552.237L215.185 577.43C219.675 591.249 203.858 602.741 192.102 594.2L170.672 578.63L149.242 594.2C137.486 602.741 121.669 591.249 126.16 577.43L134.345 552.237L112.915 536.667C101.159 528.126 107.201 509.532 121.732 509.532H148.221L156.406 484.339Z"
          />
          <path
            d="M521.273 119.472C525.764 105.652 545.315 105.653 549.805 119.472L557.991 144.665H584.48C599.011 144.665 605.052 163.259 593.296 171.8L571.866 187.37L580.052 212.562C584.542 226.382 568.725 237.874 556.969 229.333L535.539 213.763L514.109 229.333C502.353 237.874 486.536 226.382 491.027 212.562L499.212 187.37L477.782 171.8C466.026 163.259 472.068 144.665 486.599 144.665H513.088L521.273 119.472Z"
          />
        </svg>
        <p>Bei Ansprüchen, die unter das EU-Fluggastrecht (EG 261) fallen, müssen die Fluggesellschaften nur bei Verspätungen von mehr als 3 Stunden eine Entschädigung zahlen.</p>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAirportDistance } from "@/utils";
import { Airport, Flight } from "@/types";
import { isEuMember } from "is-eu-member";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import FlightResultAirport from "@/components/organisms/Calculator/FlightResultAirport.vue";

export default defineComponent({
  components: {
    FlightResultAirport,
  },
  props: {
    flight: {
      type: Object as () => Flight,
      required: true,
    },
  },
  computed: {
    allAirports() {
      const airport = this.$state.reimbursement?.airport;
      const all = [
        airport?.departure,
        airport?.arrival,
        ...(airport?.layover || []),
      ];
      return all.reduce((acc, cur) => {
        if (cur) acc[cur.iata] = cur;
        return acc;
      }, {} as Record<string, Airport>);
    },
    distance() {
      return getAirportDistance(
        this.allAirports[this.flight.departure.iata],
        this.allAirports[this.flight.arrival.iata]
      );
    },
    isEuMember() {
      const airport = this.$state.reimbursement?.airport;
      return (
        isEuMember(airport?.departure?.country || "") ||
        isEuMember(airport?.arrival?.country || "")
      );
    },
  },
  methods: {
    time(date: string) {
      return new Date(date).toLocaleTimeString(this.$i18n.locale, {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    date(date: string) {
      return new Date(date).toLocaleDateString(this.$i18n.locale);
    },
    duration(minutes: number) {
      const min = `${minutes % 60} min`;
      const h = `${Math.floor(minutes / 60)} h`;
      return minutes >= 60 ? `${h} ${min}` : min;
    },
    delay(delay: number) {
      if (delay === 0) return "pünktlich";
      if (delay < 0) return `${this.duration(delay)} früher`;
      return `${this.duration(delay)} verspätet`;
    },
  },
});
</script>
