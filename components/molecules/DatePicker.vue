<template>
  <div class="container relative">
    <FormKit
      :type="'date'"
      ref="input"
      :modelValue="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      @focus="inputFocused = true"
      label="Abflugdatum"
      validation="required"
      validation-visibility="live"
      :autocomplete="false"
      :autofill="false"
      :floatingLabel="true"
      :classes="{
        inner: inputFocused ? 'rounded-b-none max-w-full' : 'max-w-full',
      }"
    />
    <!-- <FormKit
      :type="customDate"
      ref="input"
      :modelValue="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      @focus="inputFocused = true"
      label="Abflugdatum"
      validation="required"
      validation-visibility="live"
      suffix-icon="calendar"
      :autocomplete="false"
      :autofill="false"
      :floatingLabel="true"
      :classes="{
        inner: inputFocused ? 'rounded-b-none max-w-full' : 'max-w-full',
      }"
    /> -->
    <div
      v-show="inputFocused"
      tabindex="1"
      class="peer-focus:none absolute bg-white rounded-b-lg ring-1 ring-primary-500 z-10 -mt-[15px]"
    >
      <VueTailwindDatepicker
        as-single
        no-input
        :modelValue="modelValue"
        @update:model-value="
          {
            $emit('update:modelValue', $event);

            inputFocused = true;
          }
        "
        :formatter="formatter"
        input-classes="bg-neutral-100 formkit-disabled:bg-neutral-200 formkit-disabled:cursor-not-allowed formkit-disabled:pointer-events-none [&>label:first-child>svg]:focus-within:fill-primary-500 rounded-lg h-12 border-none ring-1 ring-neutral-200 focus-within:ring-primary-500 focus-within:ring-1"
        :placeholder="placeholder"
        :i18n="$i18n.locale"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import DateInput from "./DateInput.vue";
import { createInput } from '@formkit/vue'
const { locale } = useI18n();
defineProps<{
  modelValue: string;
}>();

const customDate = createInput(DateInput, {
  // props: ['digits'],
})

const inputFocused = ref(false);
const dropdownFocused = ref(false);
document.addEventListener("click", (e) => {
  if (!e.target?.closest(".container")) {
    inputFocused.value = false;
  }
});
const formatter = ref({
  date: "YYYY-MM-DD",
  month: "MMMM YYYY",
});
const placeholder = new Date().toLocaleDateString(locale.value, {
  year: "numeric",
  month: "long",
  day: "numeric",
});
</script>
<style>
.container::v-deep(button) {
  background: pink !important;
}
</style>
