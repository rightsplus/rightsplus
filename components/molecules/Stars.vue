<template>
  <div>
    <ClientOnly
      ><FontAwesomeIcon
        icon="star"
        class="text-base"
        v-for="n in stars"
        :class="n > rating ? 'text-gray-200' : 'text-yellow-500'"
    /></ClientOnly>
    <span class="sr-only">{{ rating }} Sterne Bewertung</span>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    rating: {
      type: Number,
      required: true,
    },
    stars: {
      type: Number,
      default: 5,
    },
  },
});
</script>
