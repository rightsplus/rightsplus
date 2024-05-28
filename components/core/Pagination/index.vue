<template>
  <div class="shadow-lg rounded-full bg-white p-1 font-medium text-sm">
    <Item
      @click="$emit('update:currentPage', Math.max(1, currentPage - 1))"
      :current-page="currentPage"
      :disabled="currentPage === 1"
    >
      <FontAwesomeIcon icon="arrow-left" />
    </Item>
    <Item
      :currentPage="currentPage"
      :index="page"
			:disabled="typeof page !== 'number'"
      v-for="page in pagination"
      :key="page"
      @click="$emit('update:currentPage', page as number)"
    >
      {{ page }}
    </Item>
    <Item
      @click="$emit('update:currentPage', Math.min(pages, currentPage + 1))"
      :currentPage="currentPage"
      :disabled="currentPage === pages"
    >
      <FontAwesomeIcon icon="arrow-right" />
    </Item>
  </div>
</template>
<script setup lang="ts">
import Item from "./Item.vue";

const props = defineProps<{
  pages: number;
}>();
const currentPage = defineModel<number>("currentPage", { default: 1 });
const getPagination = (
  currentPage: number,
  pages: number[],
  maxLength: number,
  ellipsis = "..."
): (number | string)[] => {
  const halfMaxLength = Math.floor((maxLength - 2) / 2);
  const firstPage = 1;
  const lastPage = pages.length;

  if (pages.length <= maxLength) return pages;

  if (currentPage <= halfMaxLength + 2) {
    const visiblePages = pages.slice(0, maxLength - 2);
    return [...visiblePages, ellipsis, lastPage];
  }

  if (currentPage >= lastPage - halfMaxLength - 1) {
    const visiblePages = pages.slice(lastPage - maxLength + 2);
    return [firstPage, ellipsis, ...visiblePages];
  }

  const visiblePages = pages.slice(
    currentPage - halfMaxLength + (maxLength % 2 ? 0 : -2),
    currentPage + halfMaxLength - (maxLength % 2 ? 1 : 1)
    //currentPage + halfMaxLength + (maxLength % 2 ? 0 : -1)
  );
  return [firstPage, ellipsis, ...visiblePages, ellipsis, lastPage];
};
const pagination = computed(() => {
	return getPagination(currentPage.value, Array.from({ length: props.pages }, (_, i) => i + 1), 9);
});
watch(() => props.pages, () => {
  if (!pagination.value.includes(currentPage.value)) {
    currentPage.value = closest(currentPage.value, pagination.value as number[])
  }
})
</script>
