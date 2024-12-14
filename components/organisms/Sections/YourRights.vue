<template>
  <section class="py-12 md:py-24 bg-neutral-200 relative">
    <NuxtImg
      src="/images/kenrick-mills-MF9Wy1NA55I-unsplash.webp"
      quality="70"
      width="1920"
      height="1080"
      alt="Airport"
      loading="lazy"
      format="webp"
      class="absolute inset-0 h-full max-h-screen w-full object-cover -z-1"
    />
    <div class="max-w-5xl mx-auto px-5 sm:px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-6">
          <h3 class="uppercase tracking-wider text-red-200 font-bold">
            {{ t('yourRights') }}
          </h3>
          <h2 class="text-3xl sm:text-5xl font-bold">
            {{ t('yourRights.title') }}
          </h2>
        </div>
        <ol class="flex flex-col gap-8 text-base sm:text-lg">
          <li
            v-for="(item, key) in process"
            :key="key"
            class="flex gap-5 items-center"
            :class="{ 'text-gray-50': item.exception }"
          >
            <FontAwesomeIcon
              :icon="item.icon"
              class="shrink-0"
              :class="item.color"
            />
            <span class="flex flex-col gap-1 leading-none font-medium">
              {{ t(`yourRights.process.${key}`) }}
            </span>
          </li>
        </ol>
        <Button
          class="text-white !bg-gray-700 hover:!bg-gray-800 mr-auto mt-12"
          :to="'your-passenger-rights'"
          suffix-icon="angle-right"
        >
          {{ t('yourRights.cta') }}
        </Button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { t } = useI18n()

interface ProcessItem {
  icon: string;
  color?: string;
  exception?: boolean;
}

const process: Record<string, ProcessItem> = {
  compensation: {
    icon: "plane-circle-xmark",
    color: "text-red-200",
  },
  delay: {
    icon: "clock",
    color: "text-red-200",
  },
  eligibility: {
    icon: "globe-europe",
    color: "text-red-200",
  },
  period: {
    icon: "calendar",
    color: "text-red-200",
  },
  exceptions: {
    icon: "meteor",
    color: "text-red-200",
    exception: true,
  },
}
</script>
