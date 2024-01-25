<template>
  <div class="relative mb-5">
    <FormKit
      ref="input"
      type="text"
      :modelValue="modelValue"
      @update:modelValue="updateInput"
      :autocomplete="!showDropdown ? autocomplete : 'nope'"
      :label="label"
      :name="name"
      :id="id || name"
      :validation="validation"
      @focus="focus"
      @blur="blur"
      :errors="errors"
      :prefix-icon="prefixIcon"
      :suffix-icon="loading ? 'circle-notch' : (suffixIcon || 'circle-notch')"
      @prefix-icon-click="$emit('prefix-icon-click')"
      @suffix-icon-click="$emit('suffix-icon-click')"
      @keydown.down.up.prevent="keydown"
      @keydown.enter.prevent="handleInput"
      floatingLabel
      :placeholder="placeholder"
      :classes="{
        outer: `!mb-0 ${!loading && !suffixIcon ? 'hidden-suffix [&_.formkit-suffix-icon]:hidden' : ''}`,
        inner: `${
          inputFocused &&
          options?.length &&
          inputValue?.length &&
          !errors?.length
            ? 'rounded-b-none'
            : ''
        } ${loading ? '[&_.formkit-suffix-icon_svg]:animate-spin' : ''} max-w-full duration-75 !mb-0`,
      }"
    />
    <Transition name="dropdown">
      <Dropdown
        v-if="showDropdown"
        class="w-full z-50"
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
const inputFocused = ref(false);
const inputValue = ref(props.modelValue);

const showDropdown = computed(() => inputFocused.value && inputValue.value?.length && !props.errors?.length)

function updateInput(input: string) {
  highlighted.value = 0;
  inputValue.value = input;
  if (!input.length) emit("update:modelValue", "");
  if (input !== props.modelValue) emit("query", input);
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
