<template>
  <div class="p-5 md:p-12 mx-auto w-full">
    <EventsSection :data="{ size: 'xl' }" class="!p-0" :title="$route.meta.title" />
  </div>
</template>

<script lang="ts">
import EventsSection from "~/components/organisms/EventsSection.vue";

export default defineComponent({
  components: {
    EventsSection
  },
  setup() {
    definePageMeta({
      title: "Termine",
    });
  },
  head() {
    return {
      title: "Termine",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t('upcoming.events.description'),
        },
      ],
    };
  },
  mounted() {
    this.$state.headerColor = "dark";
  },
  unmounted() {
    this.$state.headerColor = null;
  },
});
</script>

<style scoped></style>
