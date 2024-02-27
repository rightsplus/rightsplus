<template>
  <div class="relative mb-5" ref="container">
    <FormKit
      ref="input"
      type="text"
      :modelValue="modelValue"
      @update:modelValue="updateInput"
      :autocomplete="!showDropdown ? autocomplete : 'one-time-code'"
      :label="label"
      :name="name"
      :id="id || name"
      :validation="validation"
      @focus="focus"
      @blur="blur"
      :errors="errors"
      :prefix-icon="prefixIcon"
      :suffix-icon="loading ? 'circle-notch' : suffixIcon || 'circle-notch'"
      @prefix-icon-click="$emit('prefix-icon-click')"
      @suffix-icon-click="$emit('suffix-icon-click')"
      @keydown.down.up.prevent="keydown"
      @keydown.enter.prevent="handleInput"
      @keydown.escape.prevent="blur"
      floatingLabel
      :placeholder="placeholder"
      :classes="{
        outer: `!mb-0 ${
          !loading && !suffixIcon
            ? 'hidden-suffix [&_.formkit-suffix-icon]:hidden'
            : ''
        }`,
        inner: `${
          inputFocused &&
          options?.length &&
          inputValue?.length &&
          !errors?.length
            ? 'rounded-b-none'
            : ''
        } ${
          loading ? '[&_.formkit-suffix-icon_svg]:animate-spin' : ''
        } max-w-full duration-75 !mb-0`,
      }"
    />
    <Dropdown
      class="w-full z-50"
      :active="highlighted"
      :options="options"
      :show="!!showDropdown"
      :style="position"
      @input="handleInput"
      teleport
    />
  </div>
</template>

<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import type { FormKitFrameworkContext } from "@formkit/core";
import Dropdown from "~~/components/molecules/Dropdown.vue";
import type { DropdownItem } from "~~/components/molecules/Dropdown.vue";
const props = defineProps<{
  modelValue: string;
  name: string;
  label: string;
  placeholder?: string;
  id?: string;
  validation?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  errors?: string[];
  loading?: boolean;
  autocomplete?: string;
  options: DropdownItem[];
}>();
const emit = defineEmits([
  "update:modelValue",
  "query",
  "suffix-icon-click",
  "prefix-icon-click",
]);
const highlighted = ref(0);
const input = ref<FormKitFrameworkContext | null>(null);
const [container, position] = usePosition()
const inputFocused = ref(false);
const inputValue = ref(props.modelValue);

const showDropdown = computed(() => {
  return (
    inputFocused.value && inputValue.value?.length && !props.errors?.length
  );
});

watch(showDropdown, (open) => {
  if (!open) return;
  const value = props.modelValue.match(/\(([^)]+)\)/)?.[1];
  const index = props.options.findIndex((option) => option.value === value);
  if (index > -1) highlighted.value = index;
});

function updateInput(value: string) {
  highlighted.value = 0;
  inputValue.value = value;
  if (!value.length) emit("update:modelValue", "");
  if (value !== props.modelValue) emit("query", value);
}
function keydown(e: KeyboardEvent) {
  highlighted.value = keyIncrement(e, highlighted.value, props.options.length);
}
function handleInput(value?: DropdownItem) {
  console.log('handlingInpu', value)
  const index = typeof value === "number" ? value : highlighted.value;
  if (props.options[index]) emit("update:modelValue", props.options[index]);
  if (input.value?.node) {
    input.value.node.context?.handlers.DOMInput({
      target: { value: props.modelValue },
    });
  }
  focusNext(true);
}
function focus() {
  inputFocused.value = true;
  setTimeout(() => {
    (document.activeElement as HTMLInputElement)?.select();
  }, 0);
}
function blur() {
  if (!inputValue.value?.length) {
    emit("update:modelValue", "");
  }
  inputFocused.value = false;
}
</script>
