<template>
  <div class="flex flex-col p-5 gap-1 absolute h-[45mm] w-[85mm] left-[20mm] top-[45mm]">
    <span class="text-2xs text-neutral-500 max-h-[10mm]">{{
      [from.name, from.address, [from.postalCode, from.city].join(" "), from.country]
        .filter(Boolean)
        .join(" · ")
    }}</span>
    <div class="flex flex-col leading-tight text-sm">
      <span
        v-for="e in [
          to.name,
          to.address,
          [to.postalCode, to.city].join(' '),
          to.country,
        ].filter(Boolean)"
        >{{ e }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
type Address = {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  country?: string;
};
defineProps<{
  to: Address;
  from: Address;
}>();
</script>
