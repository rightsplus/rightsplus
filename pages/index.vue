<template>
  <div class="overflow-x-hidden">
    <section
      class="min-h-screen flex flex-col items-stretch pt-16 sm:pt-36 pb-8 bg-neutral-200"
    >
      <img
        src="/airport-light-comp.jpg"
        alt="Airport"
        class="absolute inset-0 h-full max-h-screen w-full object-cover object-right -z-1 hidden lg:block"
      />
      <div
        class="max-w-7xl w-full mx-auto p-5 sm:px-12 flex flex-col items-stretch relative z-1"
      >
        <div class="flex flex-col gap-12 lg:w-1/2">
          <Dashboard />
          <Transition name="fade">
            <div
              class="container bg-white rounded-3xl p-5 sm:p-12"
              v-if="useClaim().value && ready"
            >
              <FlightByAirport
                v-model="useClaim().value"
                @submit="useClaim().value.step = useClaim().value.step || 0"
              /></div
          ></Transition>
        </div>
      </div>
      <div
        style="--duration: 1000ms"
        class="max-w-7xl w-full p-5 sm:p-12 mx-auto mt-auto z-10"
      >
        <Transition name="move-up">
          <ScrollDown v-if="scrollDownReady" scrollTo="process-summary" />
        </Transition>
      </div>
    </section>
    <ProcessSummary id="process-summary" />
    <YourRights />
    <CTASection />
    <Reasons />
    <Stats class="bg-gray-700 text-white" />
    <FeeCalculator />
    <Reviews />
  </div>
</template>
<script setup lang="ts">
import Dashboard from "@/components/species/Dashboard.vue";
import FlightByAirport from "@/components/organisms/Calculator/Forms/FlightByAirport.vue";
import ScrollDown from "@/components/cells/ScrollDown.vue";
import ProcessSummary from "@/components/organisms/Sections/ProcessSummary.vue";
import YourRights from "@/components/organisms/Sections/YourRights.vue";
import CTASection from "@/components/organisms/Sections/CTASection.vue";
import Reasons from "@/components/organisms/Sections/Reasons.vue";
import Stats from "@/components/organisms/Sections/Stats.vue";
import FeeCalculator from "@/components/organisms/Sections/FeeCalculator.vue";
import Reviews from "@/components/organisms/Sections/Reviews.vue";
const ready = ref(false);
const scrollDownReady = ref(false);
onMounted(() => {
  ready.value = true;
  setTimeout(() => {
    scrollDownReady.value = true;
  }, 1000);
});
</script>
