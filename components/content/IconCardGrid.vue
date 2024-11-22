<template>
  <ClientOnly>
    <div class="grid gap-5 md:grid-cols-2 my-5">
      <slot />
    </div>
    <template #fallback>
      <slot />
    </template>
  </ClientOnly>
</template>
