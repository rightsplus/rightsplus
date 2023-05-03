<template>
  <section class="min-h-screen pt-48 pb-8 bg-gray-900 text-white">
    <img
      src="/empty-airport.jpg"
      alt="Airport"
      class="image absolute inset-0 min-h-[70vw] w-full object-cover object-top -z-1"
    />
    <div class="max-w-4xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-5 mt-[10vh] sm:mt-[40vh] mb-48">
          <span class="uppercase tracking-wider text-primary-500 font-bold"
            >Über uns</span
          >
          <div class="flex flex-col gap-5 drop-shadow-xl">
          <h1 class="text-4xl sm:text-6xl font-extrabold">RightsPlus</h1>
          <span class="text-2xl sm:text-3xl font-medium">
            Erlebe eine neue Dimension an Rechte-Durchsetzung mit RightsPlus.
          </span>
          <p>
            Wir sind ein innovatives Unternehmen, das sich auf die Durchsetzung
            der Entschädigungsansprüche von Flugpassagieren konzentriert.
            Basierend auf der Fluggastrechteverordnung der Europäischen Union,
            bieten wir unseren Kunden eine schnelle und effiziente Lösung für
            ihre Ansprüche.
          </p>
          <p>
            Unser Team besteht aus erfahrenen Juristen und Reiserechtexperten,
            die jeden Fall sorgfältig prüfen und dafür sorgen, dass unsere
            Kund:innen die von ihnen verdiente Entschädigung erhalten. Wir
            setzen uns für die Rechte unserer Kunden ein und garantieren ihnen
            eine faire Behandlung und angemessene Entschädigung.
          </p>
          <p>
            Wir sind stolz auf unsere Erfolgsbilanz und unsere zufriedenen
            Kunden. Unser Unternehmen wächst stetig und wir haben uns einen
            guten Ruf in der Branche erworben. Dank unserer umfangreichen
            Erfahrung und unseres fachkundigen Personals können wir jeden Fall
            schnell und effizient bearbeiten und unseren Kunden eine positive
            Lösung anbieten.
          </p>
          <Stats />
          <p>
            Wir verstehen, dass Flugverspätungen, Annullierungen und die
            Verweigerung der Beförderung für unsere Kund:innen stressig und
            ärgerlich sein können. Deshalb arbeiten wir hart daran, den Prozess
            so einfach und unkompliziert wie möglich zu gestalten. Unser
            Online-System ermöglicht es unseren Kund:innen, ihren Fall bequem
            von zu Hause aus zu übermitteln, und wir halten sie über den
            Fortschritt ihres Falls auf dem Laufenden.
          </p>
          <p>
            RightsPlus ist eines der führendes Unternehmen im Bereich der
            Fluggastrechte, das sich für die Rechte seiner Kund:innen einsetzt
            und für eine schnelle und effiziente Lösung ihrer Ansprüche sorgt.
            Wir sind stolz auf unsere Erfolgsbilanz und unsere zufriedenen
            Kund:innen und arbeiten hart daran, weiterhin die besten Ergebnisse
            für unsere Kund:innen zu erzielen.
          </p>
        </div>
          <div class="flex items-center gap-8 mt-24">
            <img
              src="/jo.jpg"
              alt="Joachim Bawa"
              class="object-cover rounded-full w-16 h-16 grayscale contrast-125"
            />
            <div class="flex flex-col">
              <span class="text-xl font-bold">Joachim Bawa</span>
              <span class="text-base text-neutral-400">Geschäftsführer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Button from "~/components/molecules/Button.vue";
import Stats from "@/components/organisms/Sections/Stats.vue";
export default defineComponent({
  components: {
    Button,
    Stats,
  },
  data() {
    return {
      featured: [],
    };
  },
  async mounted() {
    this.$state.headerColor = "white";
  },
  unmounted() {
    this.$state.headerColor = undefined;
  },
});
</script>

<style scoped>
.image {
  /* from 0 to 5% */
  /* from 50% to 100% */
  mask: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.25) 5%,
    rgba(0, 0, 0, 1) 15% 50%,
    transparent 100%
  );
}
</style>
