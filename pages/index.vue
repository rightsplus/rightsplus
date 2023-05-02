<template>
  <div>
    <section class="min-h-screen pt-16 sm:pt-36 pb-8 bg-neutral-200">
      <img
        src="/airport-light-comp.jpg"
        alt="Airport"
        class="absolute inset-0 h-full max-h-screen w-full object-cover object-right -z-1 hidden lg:block"
      />
      <div class="max-w-7xl mx-auto p-5 sm:px-12 h-full relative z-1">
        <div class="flex flex-col gap-12 leading-0 h-full lg:w-1/2">
          <Dashboard />
          <div class="container bg-white rounded-3xl p-5 sm:p-12" v-if="useState().claims">
            <ClientOnly><FlightByAirport
              v-model="useState().claims"
              @submit="useState().claims.step = (useState().claims.step || 0)"
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
</script>
