<template>
  <Teleport to="body" :disabled="!teleport">
    <Transition name="dropdown">
      <ul
        class="peer-focus:none bg-white rounded-b-lg ring-1 ring-primary-500 z-10 max-h-52 overflow-y-auto w-full absolute z-9999"
        :class="class"
        :style="style"
        ref="options"
        v-if="show && options?.length"
      >
        <li
          v-for="(item, i) in options"
          :key="item.value"
          :name="item.value"
          class="flex gap-2 text-base leading-none p-3 cursor-pointer hover:bg-primary-50 border-b border-b-white last:rounded-b-lg focus-within:outline-none focus-within:bg-primary-50 focus-within:text-primary-600"
          :class="{
            'bg-primary-50': i === active,
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
              'text-primary-600': i === active,
              'text-gray-500': i !== active,
            }"
          />
          <div class="flex flex-col gap-1">
            <span
              class="algolia-result"
              v-html="item.label"
              :class="{
                'text-primary-600': i === active,
              }"
            />
            <span
              class="algolia-result text-sm leading-none text-neutral-500"
              v-html="item.sublabel"
            />
          </div>
        </li>
      </ul>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from "vue";
import type { StyleValue } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export type DropdownItem = {
  value: string;
  label: string;
  sublabel?: string;
  icon?: string;
};

const props = defineProps<{
  active: number;
  options: DropdownItem[];
  class?: string;
  show?: boolean;
  style?: StyleValue;
  teleport?: boolean;
}>();

defineEmits(["input"]);
const instance = ref();
onMounted(() => {
  instance.value = getCurrentInstance();
});
watch(
  () => props.active,
  () => {
    setTimeout(() => {
      const refs = instance.value?.refs;
      const el = refs?.[
        `item-${props.active}`
      ] as HTMLCollectionOf<HTMLElement>;
      if (el && refs.options) {
        el[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 0);
  },
  { immediate: true }
);
</script>
<style scoped>
.algolia-result::v-deep(em),
.algolia-result::v-deep(mark) {
  font-style: normal;
  font-weight: bold;
  background-color: transparent;
  color: inherit;
}
</style>
