<template>
  <aside class="w-[320px] min-w-[auto] md:sticky md:top-4 h-max pt-0">
    <div class="pt-0 mb-6" v-if="user">
      <NuxtLink
        to="profile"
        class="border-none hover:bg-neutral-300 w-56 h-14 flex items-center border border-gray-200 rounded-md h-md py-2 px-3 hover:border-neutral-400 focus:outline-none focus-visible:border-pink-400 gap-3"
        activeClass="bg-neutral-300"
      >
        <span
          class="inline-block rounded-full overflow-hidden"
          title="Studio Leon Vogler"
        >
          <img
            class="w-10 h-10 shrink-0 rounded-full bg-cover bg-no-repeat bg-center"
            src="https://avatars.githubusercontent.com/u/24809946?v=4"
          />
        </span>
        <div class="flex flex-col items-start">
          <p class="text-base font-semibold">
            {{ user?.user_metadata.full_name }}
          </p>
          <p class="text-xs text-neutral-600 font-medium">
            {{ user?.email }}
          </p>
        </div>
      </NuxtLink>
    </div>
    <div v-for="(item, index) in items" :key="index">
      <hr v-if="'separator' in item" class="m-5 border-neutral-300"/>
      <NuxtLinkLocale
        class="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 relative flex items-center md:px-3 py-2 rounded text-foreground md:hover:bg-neutral-300 hover:text-foreground sidebar-item sidebar-item-General group mb-2 gap-3"
        :class="[
          item.class,
          {
            'cursor-pointer': item.onClick,
          },
        ]"
        :to="item.path"
        @click="item.onClick"
        v-else
      >
        <FontAwesomeIcon :icon="item.icon" fixed-width class="text-sm" />
        <p class="text-base">{{ item.label }}</p>
      </NuxtLinkLocale>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import type { User } from "@supabase/supabase-js";
type Item = {
  icon: string;
  label: string;
  path?: string;
  onClick?: () => void;
  class?: string;
  critical?: boolean;
};
type Separator = {
  separator: boolean;
};
defineProps<{
  items: (Item | Separator)[];
  user?: User | null;
}>();
</script>
