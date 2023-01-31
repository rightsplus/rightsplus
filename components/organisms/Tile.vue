<template>
  <div
    class="tile bg-white p-5 md:p-12 rounded-2xl flex flex-col items-start justify-between gap-12 min-w-[160px] min-h-[160px]"
    :class="{
      'cursor-pointer hover:scale-[0.99] hover:bg-stone-50 duration-75':
        !!description,
      [icon]: icon,
      [iconNew]: iconNew,
    }"
    @click="open = !open && !!description"
    v-bind="$attrs"
  >
    <FontAwesomeIcon
      v-if="iconNew || icon"
      :icon="['fas', iconNew || icon]"
      class="text-primary-500 text-4xl leading-none"
    />
    <h3 class="text-xl md:text-2xl font-bold text-stone-500 leading-snug hyphens-auto">
      {{ title }}
    </h3>
  </div>
  <Popup :title="title" :content="content" :open="open" @close="open = false" />
</template>

<script lang="ts">
import Popup from '../molecules/Popup.vue';
export default defineComponent({
  components: {
    Popup,
  },
  props: {
    icon: {
      type: String,
    },
    iconNew: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    content() {
      if (!this.description) return ""
      return useMarkdown(this.description);
    },
  },
});
</script>
<style lang="scss">
svg {
  .suitcase-medical &,
  .certificate &,
  .road-barrier & {
    color: var(--color-alert-500);
  }
  .wand-sparkles &,
  .scale-balanced &,
  .briefcase &,
  .bolt-lightning &,
  .couch & {
    color: var(--color-gold-400);
  }
  .route &, .tree &, .leaf & {
    color: var(--color-success-400);
  }
  .compass &,
  .wind &,
  .kite &,
  .circle-nodes &, .spa & {
    color: var(--color-info-300);
  }
  .user-gear &,
  .person-hiking &,
  .person-walking-arrow-right &,
  .people-group &,
  .eye-low-vision &, .chess-knight & {
    color: var(--color-stone-400);
  }
}
</style>
