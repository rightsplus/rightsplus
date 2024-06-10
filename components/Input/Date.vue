<template>
  <FormKit
    type="text"
    v-maska:[options]
    :modelValue.string="displayValue"
    @update:modelValue="handleInput"
    prefix-icon="calendar"
    :label="label"
    :placeholder="placeholder || mask"
    :valid="isValidDate(displayValue)"
  />
</template>
<script lang="ts" setup>
import { vMaska, type MaskInputOptions } from "maska";
import type { CalendarProps } from "./Calendar.vue";
type Props = {
  modelValue: string | null;
  name: string;
  label?: string;
  placeholder?: string;
  outerClass?: string;
  help?: string;
  touched?: boolean;
};

const props = defineProps<Props>();
const { locale } = useI18n();
const mask = getLocaleDateFormatMask(locale.value);
const emit = defineEmits(["update:modelValue"]);
const displayValue = computed({
  get: () => {
    if (!props.modelValue) return "";

    try {
    const formatted = new Date(props.modelValue).toLocaleDateString(locale.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      if (formatted === "Invalid Date") {
        throw new Error("Invalid Date");
      }
      return formatted;
    } catch (err) {
      const [year, month, day] = props.modelValue.split("-").map(Number);

      return [day, month, year].join(".");
    }
  },
  set: (val: string) => {
    const [day, month, year] = val.split(".").map(Number);
    const array = [year, month, day].filter(Boolean)

    try {
      if (array.length < 3) throw new Error("Invalid Date: short");
      if (year?.toString()?.length < 4) throw new Error("Invalid Date: year");
      const formatted = getISODate(array.join("-"))
      if (formatted === "Invalid Date") {
        throw new Error("Invalid Date");
      }
      console.log(formatted)
      emit("update:modelValue", formatted);
    } catch (err) {
      console.log(err);
    }
  },
});

const handleInput = (event: string) => {
  displayValue.value = event;
};

const isValidDate = (dateString: string) => {
  const [day, month, year] = dateString.split(".").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

const isLeap = (year: number) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
const isDefined = (val: number) => val !== undefined && val !== null;

const maxDay = (month: number, year: number) => {
  if (month === 2) return isLeap(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};
const options: MaskInputOptions = {};
// const options: MaskInputOptions = {
//   tokens: {
//     D: { pattern: /[0-9]/ },
//     M: { pattern: /[0-9]/ },
//     Y: { pattern: /[0-9]/ },
//   },
//   eager: true,
//   mask: mask,
//   preProcess: (value) => {
//     const raw = value.split(/[^0-9]/).filter(Boolean);
//     const lastChar = value.slice(-1);
//     const isLastCharNumber = !isNaN(Number(lastChar));
//     const [d, m, y] = raw.map(Number);

//     console.log(raw, d, m, y);

//     const day = isDefined(d) ? Math.min(d, maxDay(m, y)) : d;
//     const month = isDefined(m) ? Math.min(m, 12) : m;
//     const year = y;

//     // console.log(value, isLastCharNumber);
//     let padded = [day, month, year]
//       .filter(isDefined)
//       .map((e, i) => {
//         if (!isLastCharNumber && i < 2 && String(raw[i]).length === 1)
//           return String(e).padStart(2, "0");
//         if (e && String(raw[i]).length === 2) return String(e).padStart(2, "0");
//         return String(e);
//       })
//       .join("");

//     return padded;
//   },
// };
</script>
