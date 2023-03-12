<template>
  <div>
    <section class="min-h-screen pt-36 pb-8 bg-neutral-200">
      <img
        src="/airport-light-comp.jpg"
        alt="Airport"
        class="absolute inset-0 h-full max-h-screen w-full object-cover object-right -z-1 hidden lg:block"
      />
      <div class="max-w-7xl mx-auto px-12 h-full relative z-1">
        <div class="flex flex-col gap-12 leading-0 h-full lg:w-1/2">
          <Dashboard />
          <div class="container bg-white rounded-3xl p-5 sm:p-12" v-if="$state.claims">
            <ClientOnly><FlightByAirport
              v-model="$state.claims"
              @submit="$state.claims.step++"
            /></ClientOnly>
          </div>
          <ScrollDown class="mt-auto" />
        </div>
      </div>
    </section>
    <ProcessSummary />
    <YourRights />
    <CTASection />
    <Reasons />
    <Stats class="bg-gray-700 text-white" />
    <FeeCalculator />
    <Reviews />
  </div>
</template>
<script lang="ts">
import Dashboard from "@/components/species/Dashboard.vue";
import Button from "@/components/molecules/Button.vue";
import Arrow from "@/components/molecules/Arrow.vue";
import ClaimsCalculator from "@/components/organisms/Calculator/ClaimsCalculator.vue";
import FlightByAirport from "@/components/organisms/Calculator/Forms/FlightByAirport.vue";
import ScrollDown from "@/components/cells/ScrollDown.vue";
import ProcessSummary from "@/components/organisms/Sections/ProcessSummary.vue";
import YourRights from "@/components/organisms/Sections/YourRights.vue";
import CTASection from "@/components/organisms/Sections/CTASection.vue";
import Reasons from "@/components/organisms/Sections/Reasons.vue";
import Stats from "@/components/organisms/Sections/Stats.vue";
import FeeCalculator from "@/components/organisms/Sections/FeeCalculator.vue";
import Reviews from "@/components/organisms/Sections/Reviews.vue";
export default defineComponent({
  setup() {},
  components: {
    Dashboard,
    Button,
    Arrow,
    FlightByAirport,
    ClaimsCalculator,
    ScrollDown,
    ProcessSummary,
    YourRights,
    CTASection,
    Reasons,
    Stats,
    FeeCalculator,
    Reviews,
  },
  data() {
    return {
      page: null,
    };
  },
  methods: {
    scrollToHash(hash: string) {
      document.querySelector(hash)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
  },
});
</script>
<style scoped>
.green:after {
  opacity: 0;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: hard-light;
  background-size: cover;
  transition: 2s;
}
.show-green:after {
  opacity: 1;
}
</style>
