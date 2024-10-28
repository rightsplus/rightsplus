<template>
  <div class="overflow-x-hidden">
    <img
      src="/images/jessica-newendyke-eEYAbuxP1gA-unsplash.jpg"
      quality="70"
      width="1920"
      height="1080"
      format="webp"
      alt="Airport"
      preload
      class="absolute inset-0 h-[115%] w-full object-cover z-1"
    />
    <section
      class="min-h-[80vh] flex flex-col items-stretch pt-16 sm:pt-36 pb-8 bg-neutral-200"
    >
      <div
        class="max-w-7xl w-full mx-auto p-5 sm:px-12 flex flex-col relative z-1"
      >
        <div class="flex flex-col gap-12 lg:w-2/3 max-w-4xl">
          <FlapDisplay />
          <Transition name="fade">
            <div
              class="container bg-white rounded-3xl p-5 shadow-2xl shadow-black/10"
              v-if="ready && claim"
            >
              <FlightByAirport v-model="claim" />
            </div></Transition
          >
        </div>
      </div>
    </section>
    <div class="bg-white z-5 relative">
      <CompensationBanner />
      <DisruptedFlights id="below-the-fold" />
      <YourRights />
      <ProcessSummary />
      <Reasons />
      <Stats class="bg-gray-700 text-white" />
      <FeeCalculator />
      <Reviews />
      <CTASection />
    </div>
  </div>
</template>
<script setup lang="ts">
import FlapDisplay from "~/components/species/FlapDisplay.vue";
import FlightByAirport from "@/components/organisms/Calculator/Forms/FlightByAirport.vue";
import ProcessSummary from "@/components/organisms/Sections/ProcessSummary.vue";
import DisruptedFlights from "@/components/organisms/Sections/DisruptedFlights.vue";
import YourRights from "@/components/organisms/Sections/YourRights.vue";
import CTASection from "@/components/organisms/Sections/CTASection.vue";
import Reasons from "@/components/organisms/Sections/Reasons.vue";
import Stats from "@/components/organisms/Sections/Stats.vue";
import FeeCalculator from "@/components/organisms/Sections/FeeCalculator.vue";
import Reviews from "@/components/organisms/Sections/Reviews.vue";
import CompensationBanner from "~/components/organisms/Calculator/Forms/CompensationBanner.vue";
const ready = ref(false);
const claim = useClaim();
onMounted(() => {
  ready.value = true;
});
definePageMeta({
  title: "Flugverspätung oder Flugausfall?",
});
</script>
