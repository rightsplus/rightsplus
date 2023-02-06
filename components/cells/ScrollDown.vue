<template>
  <div>
    <button
      to="/"
      class="text-sm flex items-center gap-3 text-neutral-600 hover:text-black !bg-transparent"
    >
      <span
        class="bg-white/50 rounded-full w-6 h-6 inline-flex items-center justify-center left-0 text-sm"
      >
        <ClientOnly><FontAwesomeIcon icon="arrow-down" fixed-width /></ClientOnly>
				</span><span>Nach unten scrollen</span>
    </button>
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { defineComponent } from "vue";
import Button from "@/components/molecules/Button.vue";
export default defineComponent({
  components: {
    Button,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
