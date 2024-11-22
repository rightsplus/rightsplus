<template>
  <ClientOnly>
    <div class="flex flex-col gap-2 bg-neutral-100 rounded-3xl p-5 my-5">
      <span class="uppercase tracking-wider text-sm font-medium text-gray-500" v-if="$slots.category"
        ><slot name="category" /></span
      >
      <p class="font-bold text-xl">
        <slot name="title" />
      </p>
      <p>
        <slot />
      </p>
      <p class="flex gap-5 items-center">
        <slot name="footer" />
      </p>
    </div>
    <template #fallback>
      <slot name="category" />
      <slot />
      <slot name="footer" />
    </template>
  </ClientOnly>
</template>