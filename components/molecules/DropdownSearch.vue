<template>
  <div class="relative mb-5">
    <FormKit
      ref="input"
      type="text"
      :modelValue="modelValue"
      @update:modelValue="updateInput"
      autocomplete="off"
      :label="label"
      :name="name"
      :id="id || name"
      :validation="validation"
      @focus="focus"
      @blur="blur"
      :errors="errors"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      @prefix-icon-click="$emit('prefix-icon-click')"
      @suffix-icon-click="$emit('suffix-icon-click')"
      @keydown.down.up.prevent="keydown"
      @keydown.enter.prevent="handleInput"
      :floatingLabel="true"
      :placeholder="placeholder"
      :classes="{
        outer: '!mb-0',
        inner:
          inputFocused && options?.length && inputValue?.length && !errors?.length
            ? 'rounded-b-none max-w-full duration-75 !mb-0'
            : 'max-w-full duration-75 !mb-0',
      }"
    />
    <Transition name="dropdown">
      <Dropdown
        v-if="inputFocused && inputValue?.length && !errors?.length" class="w-full z-50"
        :active="highlighted"
        :options="options"
        @input="handleInput"
      />
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import Dropdown, { DropdownItem } from "~~/components/molecules/Dropdown.vue";
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
  options: DropdownItem[];
}>();
const emit = defineEmits([
  "update:modelValue",
  "query",
  "suffix-icon-click",
  "prefix-icon-click",
]);

const highlighted = ref(0);
const inputFocused = ref(false);
const inputValue = ref(props.modelValue);

function updateInput(input: string) {
  highlighted.value = 0;
  inputValue.value = input;
  if (!input.length) emit("update:modelValue", "");
  emit("query", input);
}
function keydown(e: KeyboardEvent) {
  highlighted.value = keyIncrement(e, highlighted.value, props.options.length);
}
function handleInput(input: DropdownItem) {
  const index = typeof input === "number" ? input : highlighted.value;
  emit("update:modelValue", props.options[index]);
  focusNext(true);
}
function focus() {
  inputFocused.value = true;
  setTimeout(() => {
    (document.activeElement as HTMLInputElement)?.select();
  }, 0);
}
function blur() {
  if (!inputValue.value?.length) emit("update:modelValue", "");
  inputFocused.value = false;
}
</script>

<style>
.formkit-suffix-icon:hover {
  cursor: pointer;
}
.formkit-suffix-icon:hover svg {
  fill: var(--color-gray-800);
}
</style>
