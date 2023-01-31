<template>
  <div v-if="content?.length > 0">
    <component
      v-for="element in content"
      :key="element.id"
      :is="component(element.__component)"
      :data="element"
      :page="page"
    />
  </div>
</template>

<script lang="ts">
import TextBlock from "~/components/molecules/TextBlock.vue";
import TextCard from "~/components/molecules/TextCard.vue";
import QuoteSection from "~/components/organisms/QuoteSection.vue";
import AboutSection from "~/components/organisms/AboutSection.vue";
import ImageSection from "~/components/organisms/ImageSection.vue";
import ButtonSection from "~/components/organisms/ButtonSection.vue";
import EventsSection from "~/components/organisms/EventsSection.vue";
import PriceSection from "~/components/organisms/PriceSection.vue";
import TestimonialsSection from "~/components/organisms/TestimonialsSection.vue";
import ContactSection from "~/components/organisms/ContactSection.vue";
import OffersSection from "~/components/organisms/OffersSection.vue";
import TileSection from "~/components/organisms/TileSection.vue";
import ImageTextBlock from "~/components/organisms/ImageTextBlock.vue";

export default defineComponent({
  components: {
    TextBlock,
    TextCard,
    QuoteSection,
    AboutSection,
    ImageSection,
    ButtonSection,
    EventsSection,
    PriceSection,
    ContactSection,
    TestimonialsSection,
    OffersSection,
    TileSection,
    ImageTextBlock
  },
  props: {
    content: Object,
    page: Object,
  },
  methods: {
    component(name: string) {
      switch (name) {
        case "block.element":
          return TextBlock;
        case "block.card":
          return TextCard;
        case "block.quote":
          return QuoteSection;
        case "block.image":
          return ImageSection;
        case "block.button":
          return ButtonSection;
        case "block.events":
          return EventsSection;
        case "block.price-group":
          return PriceSection;
        case "block.testimonials":
          return TestimonialsSection;
        case "block.contact-form":
          return ContactSection;
        case "block.about":
          return AboutSection;
        case "block.offers":
          return OffersSection;
        case "block.tiles":
          return TileSection;
        case "block.image-text-block":
          return ImageTextBlock;
      }
    },
  },
});
</script>

<style scoped></style>
