<template>
  <section
    class="flex justify-center gap-5 p-5 sm:p-12 md:p-10 lg:p-12"
    :class="{
    'flex-col lg:flex-row': data?.size === 'lg',
  }">
    <component
      :is="data?.size === 'lg' ? 'PriceLarge' : 'PriceSmall'"
      v-for="price in data?.price"
      :key="price.id"
      :title="price.title"
      :price="realPrice(price)"
      :discount="price.discount"
      :originalPrice="price.price"
      :list="list(price)"
      :mailTo="`mailto:${emailTo}?subject=${page?.attributes.title} – ${price.title}`"
      :highlight="price.highlight"
    />
  </section>
</template>

<script lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Button from "../molecules/Button.vue";
import PriceLarge from "../molecules/PriceLarge.vue";
import PriceSmall from "../molecules/PriceSmall.vue";
interface Price {
  id: number;
  title: string;
  price: number;
  discount: number;
  list: string;
  popular: boolean;
}
export default defineComponent({
  components: {
    Event,
    Button,
    FontAwesomeIcon,
    PriceLarge,
    PriceSmall
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
      prices: null,
      size: null,
      loaded: false,
      emailTo: useRuntimeConfig().public.email.to,
      lineBreak: "%0D%0A"
    };
  },
  methods: {
    realPrice(price: Price) {
      const p = `${price.price}€`
      if (!price.discount) return p;
      return `${Math.round(price.price - price.price / price.discount)}€`;
    },
    list(price: Price) {
      return price.list?.replaceAll("\n", "").split("- ").filter(Boolean);
    },
  },
});
</script>
<style lang="scss"></style>
