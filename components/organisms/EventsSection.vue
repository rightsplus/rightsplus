<template>
  <section
    class="flex flex-col gap-12 p-5 sm:p-12"
    v-if="events?.length > 0"
    :class="{ 'max-w-5xl mx-auto p-5 md:p-12 lg:px-0': events?.length < 4 }"
  >
    <div class="flex flex-col items-start gap-2">
      <NuxtLink
        to="/termine"
        class="text-3xl font-bold hover:text-primary-500"
        :class="{ 'pointer-events-none': title }"
        >{{ $t("upcoming.events.title") }}</NuxtLink
      >
      <span class="font-medium text-stone-500">{{
        $t("upcoming.events.description")
      }}</span>
    </div>
    <!-- <div class="flex flex-wrap gap-6 overflow-x-auto -mx-5 px-5"> -->
    <div
      class="events-grid flex md:grid gap-5 md:gap-12 overflow-x-auto -mx-5 sm:-mx-12 md:mx-0 p-5 sm:px-12 md:px-0"
    >
      <Event :event="event" v-for="(event, i) in events" :i="i" :grid="true" />
    </div>
  </section>
  <section
    v-else
    class="px-5 py-10 md:p-12 text-center flex item-center justify-center flex-col text-stone-400"
  >
    <div><FontAwesomeIcon :icon="['fas', 'calendar']" fixed-width /></div>
    <span>{{ $t("events:noEvents") }}</span>
  </section>
  <!-- <section v-else class="p-12 my-24 text-center text-stone-300"><FontAwesomeIcon class="spin" :icon="['fas', 'circle-notch']" size="2xl" /></section> -->
  <!-- <section v-else-if="loaded" class="p-12 text-center">Keine bevorstehenden Termine</section>
  <section v-else class="p-12 my-24 text-center text-stone-300"><FontAwesomeIcon class="spin" :icon="['fas', 'circle-notch']" size="2xl" /></section> -->
</template>

<script lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Event from "~/components/cells/Event.vue";
import { Event as EventType } from "~/types";
export default defineComponent({
  components: {
    Event,
    FontAwesomeIcon,
  },
  props: {
    data: {
      type: Object,
    },
    page: {
      type: Object,
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      events: null,
      loaded: false,
    };
  },
  async mounted() {
    if (
      this.data?.filter !== "all" &&
      this.page?.attributes.events?.data.length > 0
    ) {
      this.events = this.page?.attributes.events?.data.filter(
        (event: EventType) => (event.attributes.end || event.attributes.start) > new Date().toISOString()
      );
      this.loaded = true;
    } else if (!this.page?.attributes.events) {
      this.events = (
        await this.$strapi.find("events", {
          sort: "start",
          filters: {
            start: {
              $gte: new Date(),
            },
          },
        })
      ).data;
      this.loaded = true;
    }
  },
});
</script>
<style lang="scss">
.events-grid {
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
}
</style>
