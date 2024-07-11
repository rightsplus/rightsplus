<template>
  <div class="relative" ref="container">
    <FormKit
      ref="input"
      type="text"
      :modelValue="modelValue"
      @update:modelValue="updateInput"
      :prefix-icon="prefixIcon"
      :suffix-icon="loading ? 'circle-quarter' : suffixIcon || 'circle-quarter'"
      :prefix-icon-class="$attrs['prefix-icon-class']"
      :suffix-icon-class="$attrs['suffix-icon-class']"
      :autocomplete="!showDropdown ? autocomplete : 'one-time-code'"
      :label="label"
      :name="name"
      :id="id || name"
      :validation="validation"
      :errors="errors"
      @focus="focus"
      @blur="blur"
      @keydown.down.up.prevent="keydown"
      @keydown.enter.prevent="handleEnter"
      @keydown.tab.exact.prevent="handleTab"
      @keydown.escape.prevent="blur"
      v-bind="attrs"
      floatingLabel
      :loading="loading"
      :placeholder="placeholder"
      :disabled="disabled"
      :classes="{
        outer: `!mb-0 ${
          !loading && !suffixIcon
            ? 'hidden-suffix [&_.formkit-suffix-icon]:hidden'
            : ''
        }`,
        suffixIcon: loading ? '[&>svg]:animate-revolve' : '',
        inner: `${
          inputFocused &&
          options?.length &&
          inputValue?.length &&
          !errors?.length
            ? 'rounded-b-none'
            : ''
        } max-w-full !mb-0`,
      }"
    />
    <Dropdown
      class="w-full z-50"
      :active="highlighted"
      :options="options"
      :show="!!showDropdown"
      @input="handleInput"
      :required="required"
    />
      <!-- teleport -->
      <!-- :style="position" -->
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
  disabled?: boolean;
  autocomplete?: string;
  minLength?: number;
  required?: boolean;
  options: DropdownItem[];
}>();
const emit = defineEmits([
  "update:modelValue",
  "blur",
  "query",
  "suffix-icon-click",
  "prefix-icon-click",
  "keydown.enter",
]);
const passedProps = getCurrentInstance()?.vnode.props || {};
const attrs = computed(() => {
  const a = {} as typeof passedProps;
  if (passedProps.onPrefixIconClick)
    a.onPrefixIconClick = () => emit("prefix-icon-click");
  if (passedProps.onSuffixIconClick)
    a.onSuffixIconClick = () => emit("suffix-icon-click");
  return a;
});
const highlighted = ref(0);
const input = ref<FormKitFrameworkContext | null>(null);
const [container, position] = usePosition();
const inputFocused = ref(false);
const inputValue = ref(props.modelValue);

const showDropdown = computed(() => {
  return (
    inputFocused.value &&
    (inputValue.value?.length || 0) >= (props.minLength || 1) &&
    !props.errors?.length
  );
});

watch(showDropdown, (open) => {
  if (!open) return;
  const value = props.modelValue?.match(/\(([^)]+)\)/)?.[1];
  const index = props.options.findIndex((option) => option.value === value);
  if (index > -1) highlighted.value = index;
});

function updateInput(value: string | undefined) {
  highlighted.value = 0;
  inputValue.value = value || "";
  if (!value?.length) emit("update:modelValue", "");
  if (value !== props.modelValue || !value?.length) emit("query", value);
}
function keydown(e: KeyboardEvent) {
  highlighted.value = keyIncrement(e, highlighted.value, props.options.length);
}
function handleEnter() {
  handleInput();
  emit("keydown.enter");
}
function handleTab(e: KeyboardEvent) {
  if (showDropdown.value) {
    handleInput();
  } else if (!props.modelValue) {
    focusNext({ select: true });
  }
}
function handleInput(value?: DropdownItem) {
  const index = typeof value === "number" ? value : highlighted.value;
  if (props.options[index]) {
    emit("update:modelValue", props.options[index]);
  }
  if (input.value?.node && !props.options[index]?.cancel) {
    input.value.node.context?.handlers.DOMInput({
      target: { value: props.modelValue || inputValue.value },
    });
  }
  if (!props.options[index]?.cancel) focusNext({ select: true });
}
function focus() {
  inputFocused.value = true;
  setTimeout(() => {
    const active = document.activeElement as HTMLInputElement;
    if (active && typeof active?.select === "function") {
      active.select();
    }
  }, 0);
}
function blur() {
  emit("blur");
  if (!inputValue.value?.length) {
    emit("update:modelValue", "");
  }
  inputFocused.value = false;
}
</script>
