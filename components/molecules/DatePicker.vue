<template>
  <div
    class="relative formkit-inner bg-neutral-100 formkit-disabled:bg-neutral-200 formkit-disabled:cursor-not-allowed formkit-disabled:pointer-events-none [&>label:first-child>svg]:focus-within:fill-primary-500 flex items-center ring-1 ring-neutral-200 focus-within:ring-primary-500 focus-within:ring-1 [&>label:first-child]:focus-within:text-primary-500 rounded-lg mb-1 max-w-full"
    data-floating-label="true"
    :class="{ '!rounded-b-none max-w-full': inputFocused }"
  >
    <div class="container relative flex">
      <input
        v-maska:[options]
        data-maska-eager
        v-model="displayDate"
        :id="name || 'date'"
        @focus="inputFocused = true"
        @blur="inputFocused = false"
        :data-complete="!!displayDate"
        class="formkit-input appearance-none bg-transparent focus:outline-none focus:ring-0 focus:shadow-none font-medium rounded-lg autofill:shadow-autofill autofill:ring-1 ring-blue-200 w-full px-4 py-3 border-none text-base text-neutral-700 placeholder-neutral-400"
      />
      <label
        class="absolute formkit-label -mt-1"
        :data-has-value="!!displayDate"
        >{{ label }}</label
      >
      <label
        class="formkit-suffix-icon w-10 pr-2 -ml-3 flex self-stretch grow-0 shrink-0 [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto [&>svg]:fill-neutral-400 formkit-icon"
        :for="name || 'date'"
        ><ClientOnly
          ><FontAwesomeIcon
            icon="calendar"
            class="text-neutral-400" /></ClientOnly
      ></label>
      <div
        v-show="inputFocused"
        tabindex="1"
        class="peer-focus:none absolute bg-white rounded-b-lg ring-1 ring-primary-500 z-10 top-14 w-full"
      >
        <VueTailwindDatepicker
          as-single
          no-input
          @mousedown.prevent
          :modelValue="modelValue"
          @update:model-value="
            {
              $emit('update:modelValue', $event);

              inputFocused = true;
            }
          "
          :formatter="formatter"
          class="w-full"
          :placeholder="placeholder"
          :i18n="$i18n.locale"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import DateInput from "./DateInput.vue";
import { createInput } from "@formkit/vue";
import { MaskInputOptions, vMaska } from "maska";
const { locale } = useI18n();
const props = defineProps<{
  modelValue: string;
  name: string;
  label: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const displayDate = ref("");

const options: MaskInputOptions = reactive({
  mask: "##.##.####",
  eager: true,
});

watchEffect(() => {
  const date = new Date(props.modelValue);
  if (date?.toISOString().split("T")[0]) {
    displayDate.value = date.toLocaleDateString(locale.value, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }
});
watchEffect(() => {
  const [day, month, year] = displayDate.value
    .split(".")
    .map((e) => parseInt(e));
  const date = new Date(new Date().setFullYear(year, month - 1, day));
  if (date?.toISOString().split("T")[0]) {
    emit("update:modelValue", date.toISOString().split("T")[0]);
  }
});

const inputFocused = ref(false);
const formatter = ref({
  date: "YYYY-MM-DD",
  month: "MMMM",
});
const placeholder = new Date().toLocaleDateString(locale.value, {
  year: "numeric",
  month: "long",
  day: "numeric",
});
</script>
<style lang="scss">
.container::v-deep(button) {
  background: pink !important;
}
.text-vtd-secondary-500.text-xs {
  font-size: var(--text-sm) !important;
  color: var(--color-neutral-400) !important;
}
.dark\:bg-vtd-secondary-800 {
  padding: var(--p-2);
  width: 100%;
}
.text-vtd-secondary-600.uppercase {
  text-transform: none !important;
  letter-spacing: normal;
  font-size: var(--text-sm) !important;
  line-height: 1.25;
}
.vtd-datepicker-date {
  border-radius: var(--rounded-lg) !important;
  font-size: var(--text-sm) !important;
  font-weight: var(--font-medium) !important;
  width: var(--w-8) !important;
  height: var(--h-8) !important;

  &.font-light {
    color: var(--color-neutral-400) !important;
  }
  &.font-medium {
    &:hover {
      background: var(--color-neutral-200) !important;
    }
  }

  &.text-white {
    background: var(--color-primary-500) !important;
    z-index: 1;
    font-weight: var(--font-bold) !important;
    &:hover {
      background: var(--color-primary-600) !important;
    }
  }
}
</style>
