<template>
  <section class="py-12 md:py-24 bg-neutral-200 relative">
    <img
      src="/images/airport-light-comp.jpg"
      alt="Airport"
      class="absolute inset-0 h-full max-h-screen w-full object-cover object-right -z-1 hidden lg:block"
    />
    <div class="max-w-7xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full md:w-1/2">
        <div class="flex flex-col gap-6">
          <h3
            class="text-lg sm:text-xl text-green-600 font-medium uppercase tracking-wider"
          >
            Deine Rechte
          </h3>
          <h2 class="text-3xl sm:text-5xl font-bold">
            Wann bekomme ich eine Entschädigung?
          </h2>
        </div>
        <ol class="flex flex-col gap-8 text-base sm:text-lg">
          <li
            v-for="item in process"
            :key="item.title"
            class="flex gap-5 items-center"
            :class="{ 'text-gray-500': item.exception }"
          >
            <FontAwesomeIcon :icon="item.icon" :class="item.color" />
            <span class="flex flex-col gap-1 leading-none font-medium">{{
              item.title
            }}</span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
const process = [
  {
    icon: "plane-circle-xmark",
    color: "text-green-600",
    title:
      "Entschädigung deckt Verspätungen, Annullierungen und verweigerte Beförderungen ab"
  },
  {
    icon: "clock",
    color: "text-green-600",
    title:
      "Gilt für Verspätung von mindestens 2-3 Stunden (abhängig von Flugdistanz)"
  },
  {
    icon: "globe-europe",
    color: "text-green-600",
    title:
      "Flug muss innerhalb der EU starten oder landen oder der Flugbetreiber muss in der EU ansässig sein"
  },
  {
    icon: "calendar",
    color: "text-green-600",
    title: "Anspruch kann für die letzten 3 Jahre geltend gemacht werden"
  },
  {
    icon: "meteor",
    color: "text-gray-500",
    title:
      "Ausnahmen möglich bei Verspätung aufgrund außergewöhnlicher Umstände",
    exception: true
  }
];
</script>
