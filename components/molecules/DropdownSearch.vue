<template>
  <div class="relative">
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
      @focus="inputFocused = true"
      @blur="blur"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      @prefix-icon-click="$emit('prefix-icon-click')"
      @suffix-icon-click="$emit('suffix-icon-click')"
      @keydown.down.up.prevent="keydown"
      @keydown.enter.prevent="handleInput"
      :floatingLabel="true"
      :placeholder="placeholder"
      :classes="{
        inner:
          inputFocused && options?.length && inputValue?.length
            ? 'rounded-b-none max-w-full duration-75'
            : 'max-w-full duration-75',
      }"
    />
    <Transition name="dropdown">
    <Dropdown
      class="w-full -mt-[15px] z-50"
      v-if="inputFocused && inputValue?.length"
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
  options: DropdownItem[];
}>();
const emit = defineEmits(["update:modelValue", "query", "suffix-icon-click", "prefix-icon-click"]);

const highlighted = ref(0);
const inputFocused = ref(false);
const inputValue = ref(props.modelValue)

function updateInput (input: string) {
  highlighted.value = 0;
  inputValue.value = input;
  emit("query", input);
}
function keydown(e: KeyboardEvent) {
  highlighted.value = keyIncrement(
    e,
    highlighted.value,
    props.options.length
  );
}
function handleInput(input: DropdownItem) {
  const index = typeof input === "number" ? input : highlighted.value;
  console.log(props.options[index])
  emit("update:modelValue", props.options[index]);
  focusNext(true);
}
function blur() {
  if (!inputValue.value?.length) emit("update:modelValue", "");
  inputFocused.value = false
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
