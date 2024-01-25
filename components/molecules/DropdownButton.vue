<template>
  <div
    class="relative w-full h-14"
    data-floating-label="true"
    data-suffix-icon="true"
    :data-prefix-icon="(current?.icon || prefixIcon) && 'true'"
  >
    <button
      role="button"
      autocomplete="off"
      :label="label"
      :name="name"
      :id="id || name"
      :validation="validation"
      @focus="inputFocused = true"
      @blur="inputFocused = false"
      @mousedown="inputFocused = !inputFocused"
      @keydown.down.up.prevent="keydown"
      @keydown.enter.prevent="handleInput"
      class="flex items-center gap-3.5 w-full bg-neutral-100 hover:bg-neutral-50 ring-neutral-200 ring-1 text-base p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 h-14 min-w-0 max-w-full duration-75"
      :class="[
        inputFocused && options?.length
          ? 'rounded-b-none ring-1 ring-primary-500'
          : '',
        modelValue ? 'active' : '',
      ]"
    >
      <ClientOnly
        ><FontAwesomeIcon
          v-if="current?.icon || prefixIcon"
          :icon="current?.icon || prefixIcon"
          :class="[inputFocused && options?.length ? 'text-primary-600' : '']"
          fixed-width
      /></ClientOnly>

      <div
        class="text-ellipsis overflow-hidden whitespace-nowrap translate-y-2 w-full text-left"
        ><Transition name="move-up"
          ><div v-if="current">{{ current?.label }}</div></Transition
        ></div
      ><ClientOnly><FontAwesomeIcon icon="angle-down" /></ClientOnly>
    </button>
    <label :for="id || name" class="formkit-label" :data-has-value="modelValue && 'true'">{{ label }}</label>
    <Transition name="dropdown">
      <Dropdown
        class="w-full mt-[1px] z-50"
        v-if="inputFocused"
        :active="highlighted"
        :options="options"
        @input="handleInput"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import Dropdown, { DropdownItem } from "~~/components/molecules/Dropdown.vue";
const props = defineProps<{
  modelValue: string | null | undefined;
  name: string;
  label: string;
  id?: string;
  validation?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  options: DropdownItem[];
}>();
const emit = defineEmits([
  "update:modelValue",
  "query",
  "suffix-icon-click",
  "prefix-icon-click",
]);

const highlighted = ref(
  props.options.findIndex((e) => e.value === props.modelValue) || 0
);
const inputFocused = ref(false);
const current = computed(() => {
  return props.options.find((e) => e.value === props.modelValue);
});
function keydown(e: KeyboardEvent) {
  highlighted.value = keyIncrement(e, highlighted.value, props.options.length);
}
function handleInput(input: KeyboardEvent): void
function handleInput(input: DropdownItem | KeyboardEvent) {
  const index = typeof input === "number" ? input : highlighted.value;
  highlighted.value = index;
  emit("update:modelValue", props.options[index].value);
  focusNext(true);
  inputFocused.value = false
}
</script>
