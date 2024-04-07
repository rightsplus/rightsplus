<template>
  <div class="overflow-x-hidden">
      <img
        src="/images/jessica-newendyke-eEYAbuxP1gA-unsplash.jpg"
        alt="Airport"
        class="absolute inset-0 h-full w-full object-cover object-right -z-1"
      />
    <section
      class="min-h-screen flex flex-col items-stretch pt-16 sm:pt-36 pb-8 bg-neutral-200"
    >
      <!-- style="background-image: url('/images/samuel-t-XYJ2JZrj0kg-unsplash-2.jpg'); background-size: cover; background-position: center;" -->
      <!-- <section
      class="min-h-screen flex flex-col items-stretch pt-16 sm:pt-36 pb-8 bg-white"
    > -->
      <!-- <video muted loop playsinline autoplay
        class="absolute inset-0 h-full max-h-screen w-full object-cover object-right -z-1 grayscale brightness-110 opacity-70">
        <source src="https://www.united-internet.de/fileadmin/user_upload/united-innovation-united-success-united-internet.mp4">
      </video> -->
      <div
        class="max-w-7xl w-full mx-auto p-5 sm:px-12 flex flex-col items-stretch relative z-1"
      >
        <div class="flex flex-col gap-12 lg:w-2/3 max-w-4xl">
          <Dashboard class="" />
          <Transition name="fade">
            <div
              class="container bg-white rounded-3xl p-5 shadow-2xl shadow-black/10"
              v-if="claim && ready"
            >
              <FlightByAirport
                v-model="claim"
                @submit="() => {}"
              /></div
          ></Transition>
        </div>
      </div>
      <div
        style="--duration: 1000ms"
        class="max-w-7xl w-full p-5 sm:p-12 mx-auto mt-auto z-10"
      >
        <Transition name="move-up">
          <ScrollDown v-show="scrollDownReady" scrollTo="below-the fold" />
        </Transition>
      </div>
    </section>
    <CompensationBanner />
    <DisruptedFlights id="below-the fold" />
    <YourRights />
    <ProcessSummary />
    <Reasons />
    <Stats class="bg-gray-700 text-white" />
    <FeeCalculator />
    <Reviews />
    <CTASection />
  </div>
</template>
<script setup lang="ts">
import Dashboard from "@/components/species/Dashboard.vue";
import FlightByAirport from "@/components/organisms/Calculator/Forms/FlightByAirport.vue";
import ScrollDown from "@/components/cells/ScrollDown.vue";
import ProcessSummary from "@/components/organisms/Sections/ProcessSummary.vue";
import DisruptedFlights from "@/components/organisms/Sections/DisruptedFlights.vue";
import YourRights from "@/components/organisms/Sections/YourRights.vue";
import CTASection from "@/components/organisms/Sections/CTASection.vue";
import Reasons from "@/components/organisms/Sections/Reasons.vue";
import Stats from "@/components/organisms/Sections/Stats.vue";
import FeeCalculator from "@/components/organisms/Sections/FeeCalculator.vue";
import Reviews from "@/components/organisms/Sections/Reviews.vue";
import type { Database } from "@/types";
import CompensationBanner from "~/components/organisms/Calculator/Forms/CompensationBanner.vue";
const ready = ref(false);
const scrollDownReady = ref(false);
const claim = useClaim()
onMounted(() => {
  ready.value = true;
  setTimeout(() => {
    scrollDownReady.value = true;
  }, 1000);
});
definePageMeta({
  title: "Flugverspätung oder Flugausfall?",
  layoutTransition: {
    name: "layout",
    mode: "out-in",
  },
});
</script>
