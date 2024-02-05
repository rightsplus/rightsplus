<template>
  <AccordionItem v-for="claim in claims" :index="claim.uuid" :modelValue="active" @update:modelValue="active = $event"
    headless :tag="{ outer: 'div', inner: 'div' }" :classes="{ title: 'pb-0 mb-0', content: 'mx-1' }" collapsible>
    <template #title>
      <CellsFlightCard :key="claim.uuid" :flight="claim.flights.data || undefined" class="w-full" :class="{
        'rounded-b-none': active?.includes(claim.uuid),
      }" />
    </template>
    <template #content>
      <ol class="p-5 bg-white rounded-b-xl">
        <li>Scheduled Arrival Time</li>
        <li>Actual Arrival Time</li>
        <li>Flight Distance</li>
        <li>Status</li>
      </ol>
    </template>
  </AccordionItem>
</template>
<script lang="ts" setup>
import AccordionItem from "~/components/organisms/Accordion/AccordionItem.vue";
const props = defineProps<{
  claims: any[];
}>();
const active = ref<string[]>([]);
</script>
