<template>
  <ClientOnly>
    <div class="gap-5 my-5 grid" :class="{
      'md:grid-cols-2': ($slots.default?.().length || 0) % 2 === 0,
      'md:grid-cols-3 !col-start-1 !-col-end-1': ($slots.default?.().length || 0) % 3 === 0,
    }">
      <slot />
    </div>
    <template #fallback>
      <slot />
    </template>
  </ClientOnly>
</template>