<template>
  <ul
    class="peer-focus:none absolute bg-white rounded-b-lg ring-1 ring-primary-500 z-10 max-h-64 overflow-y-auto w-full"
    v-if="list?.length"
    ref="list"
  >
    <li
      v-for="(item, i) in list"
      :key="item.value"
      :name="item.value"
      class="flex gap-2 text-base leading-none p-3 cursor-pointer hover:bg-primary-50 last:rounded-b-lg focus-within:outline-none focus-within:bg-primary-50 focus-within:text-primary-600"
      :class="{
        'bg-primary-50': i === selected,
      }"
      @mousedown.prevent="$emit('input', i)"
      :ref="`item-${i}`"
    >
      <FontAwesomeIcon
        v-if="item.icon"
        :icon="item.icon"
        fixed-width
        class="icon"
        :class="{
          'text-primary-600': i === selected,
          'text-gray-500': i !== selected,
        }"
      />
      <div class="flex flex-col gap-1">
        <span
          class="algolia-result"
          v-html="item.label"
          :class="{
            'text-primary-600': i === selected,
          }"
        />
        <span
          class="algolia-result text-sm leading-none text-neutral-500"
          v-html="item.sublabel"
        />
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export type DropdownItem = {
  value: string;
  label: string;
  sublabel: string;
  icon?: string;
};

const props = defineProps<{
  selected: number;
  list: DropdownItem[];
}>();
defineEmits(["input"]);
const instance = ref();
onMounted(() => {
  instance.value = getCurrentInstance();
});
watch(
  () => props.selected,
  () => {
    const refs = instance.value?.refs;
    const el = refs?.[
      `item-${props.selected}`
    ] as HTMLCollectionOf<HTMLElement>;
    if (el && refs.list) {
      el[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
);
</script>
<style scoped>
.algolia-result::v-deep(em) {
  font-style: normal;
  font-weight: bold;
}
</style>
