<template>
  <div class="flex flex-col gap-3">
    <input
      ref="input"
      :id="id"
      type="file"
      @change="handleChange"
      v-bind="$attrs"
      class="opacity-0 pointer-events-none absolute"
      :multiple="multiple"
    />

    <div
      class="font-medium flex items-center rounded-lg ring-neutral-200 bg-neutral-100 gap-3 p-3 pr-5"
      v-if="files"
      v-for="(file, i) in realFiles"
      :key="file.name"
    >
      <div class="w-12 sm:w-16" v-if="preview?.[i] && !errors[i]">
        <img
          :src="preview[i]"
          @load="errors[i] = false"
          @error="errors[i] = true"
          class="max-w-10 sm:max-w-14 max-h-10 object-contain rounded shrink-0 overflow-hidden"
        />
      </div>
      <FontAwesomeIcon
        v-else
        :icon="'file'"
        class="text-neutral-300 text-3xl"
      />
      <div class="flex flex-col">
        <Truncate class="text-sm flex">{{ file.name }}</Truncate
        ><span class="text-neutral-500 text-xs">{{
          getSize(file.size)
        }}</span>
      </div>
      <button
        @click="delete files[file.name]"
        class="text-neutral-500 hover:text-red-500 ml-auto"
      >
        <FontAwesomeIcon icon="times" />
      </button>
    </div>
    <label
      class="rounded-lg ring-neutral-200 bg-neutral-100 hover:bg-neutral-50 flex items-center justify-center min-h-40 cursor-pointer ring-1 focus-within:ring-primary-500 gap-5 leading-none px-5 h-14"
      :for="id"
    >
      <div class="flex flex-col gap-2 w-full items-center">
        <FontAwesomeIcon
          :icon="icon || 'file-arrow-up'"
          class="text-neutral-300 text-4xl"
        />
        <span class="text-neutral-500 text-sm">{{ label || "Upload" }}</span>
      </div>
    </label>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const input = ref<HTMLInputElement>();
const id = `file-${uuid()}`;

const props = defineProps<{
  name?: string;
  label?: string;
  icon?: string;
  multiple?: boolean;
}>();
const files = defineModel<Record<string, string>>();
const realFiles = computed(() =>
  Object.entries(files.value || {}).map(([name, file]) =>
    base64ToFile(file, name)
  )
);
const errors = ref<boolean[]>([]);
const preview = ref<string[]>();

const getSize = formatFileSize
const generatePreview = (files?: Record<string, string>) => {
  if (!files) return;
  try {
    preview.value = Object.values(files || {});
  } catch (e) {
    errors.value = Array(Object.keys(files || {}).length).fill(true);
  }
};
watch(files, generatePreview, { immediate: true });
const handleChange = async ({
  target,
}: { target?: typeof input.value } = {}) => {
  errors.value = [];
  files.value = await Promise.all(
    Array.from(target?.files || []).map(
      (file) =>
        new Promise<[string, string]>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve([file.name, reader.result as string]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  ).then((results) => Object.fromEntries(results));
};
</script>
