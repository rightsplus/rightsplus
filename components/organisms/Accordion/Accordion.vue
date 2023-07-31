<template>
  <component :is="tag?.outer || 'ul'">
    <AccordionItem
      v-for="(item, i) in items"
      :key="itemKey ? item[itemKey] : i"
      :index="i"
      :modelValue="active"
      @update:modelValue="$emit('setActive', $event)"
      :tag="tag"
      :classes="classes"
      :border="border"
      :arrow="arrow"
      :collapsible="collapsible"
    >
      <template #title>
        <slot :item="item" name="title" />
      </template>
      <template #content>
        <slot :item="item" name="content" />
      </template>
    </AccordionItem>
  </component>
</template>

<script setup lang="ts">
import AccordionItem from "@/components/organisms/Accordion/AccordionItem.vue";
import { AccordionStructure }  from "./types";
defineProps<{
  tag?: AccordionStructure;
  classes?: AccordionStructure;
  itemKey?: string;
  items: any[];
  active: number[];
  border?: boolean;
  arrow?: boolean;
  collapsible?: boolean;
  headless?: boolean;
}>();
defineEmits(["setActive"]);
</script>
