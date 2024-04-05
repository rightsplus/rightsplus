<template>
  <div
    class="formkit-inner bg-neutral-100 formkit-disabled:bg-neutral-200 formkit-disabled:cursor-not-allowed formkit-disabled:pointer-events-none [&>label:first-child>svg]:focus-within:fill-primary-500 flex items-center ring-1 ring-neutral-200 focus-within:ring-primary-500 focus-within:ring-1 [&>label:first-child]:focus-within:text-primary-500 rounded-lg mb-1 rounded-b-none max-w-full"
  >
    <input
      :value="localizedDate"
      inputmode="numeric"
      v-maska:[options]
      data-maska-eager
      :id="context.id"
      :name="context.node.name"
      @blur="context.handlers.blur"
      @focus="context.handlers.focus"
      class="formkit-input appearance-none bg-transparent focus:outline-none focus:ring-0 focus:shadow-none font-medium rounded-lg autofill:shadow-autofill autofill:ring-1 ring-primary-200 w-full px-4 py-3 border-none text-base text-neutral-700 placeholder-neutral-400"
    />

    <span
      v-if="context.suffixIcon"
      class="formkit-suffix-icon w-10 pr-2 -ml-3 flex self-stretch grow-0 shrink-0 [&amp;>svg]:w-full [&amp;>svg]:max-w-[1em] [&amp;>svg]:max-h-[1em] [&amp;>svg]:m-auto [&amp;>svg]:fill-neutral-400 formkit-icon"
      ><FontAwesomeIcon :icon="context.suffixIcon"
    /></span>
    <!-- <label
      class="formkit-label text-neutral-500 font-medium text-sm leading-tight block"
      :for="context.id"
      >{{ context.label }}</label
    > -->
  </div>
</template>

<script lang="ts" setup>
import { vMaska } from "maska";
import type { MaskInputOptions } from "maska";
import type { FormKitFrameworkContext } from "@formkit/core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";
const { locale } = useI18n();
interface Context extends FormKitFrameworkContext {
  suffixIcon?: string;
}
const { context } = defineProps<{ context: Context }>();
const localizedDate = ref(
  new Date(context._value).toLocaleDateString(locale.value)
);
const maskFormat = computed(() =>
  new Intl.DateTimeFormat(locale.value).formatToParts(new Date("12-12-2000"))
);

const format = (date: Date) =>
  date?.toLocaleDateString(locale.value, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
const maskMap = {
  year: "Y",
  month: "M",
  day: "D",
};
// const mask = computed(() =>
//   maskFormat.value
//     .map(({ value, type }, i) =>
//       type === "literal"
//         ? value
//         : value
//             .split("")
//             .map((e) => "#")
//             .join("")
//     )
//     .join("")
// );

const mask = computed(() =>
  maskFormat.value
    .map(({ value, type }, i) =>
      type === "literal"
        ? value
        : value
            .split("")
            .map(() => maskMap[type as keyof typeof maskMap] || "#")
            .join("")
    )
    .join("")
);
const reverseRegex = computed(() =>
  maskFormat.value
    .map(({ value, type }, i) =>
      type === "literal" ? `\\${value}?` : `(?<${type}>\\d{${value.length}})?`
    )
    .join("")
);
const parseDate = (date: string) => {
  return (new RegExp(reverseRegex.value).exec(date) || {})?.groups;
};

const options: MaskInputOptions = reactive({
  mask: () => mask.value,
  tokens: {
    D: { pattern: /[0-9]/ },
    M: { pattern: /[0-9]/ },
    Y: { pattern: /[0-9]/ },
  },
  onMaska(e) {
    const { year, month, day } = parseDate(e.masked) || {};
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (date.toString() === "Invalid Date") return;
    context.node.input(date);
    localizedDate.value = format(date);
  },
});

watch(locale, (value) => {
  if (value.length < 2) return;
  localizedDate.value = format(context._value);
});
</script>
