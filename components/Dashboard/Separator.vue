<template>
  <div
    class="bg-transparent select-none relative z-50 group"
    :class="{
      'w-full h-px inset-x-0': !vertical,
      'w-px h-full inset-y-0': vertical,
    }"
  >
    <div
      class="bg-transparent select-none absolute z-50 group"
      :class="{
        'w-full h-2 -top-1 cursor-row-resize': !vertical,
        'w-2 h-full -left-1 cursor-col-resize': vertical,
      }"
      @mousedown="dragging = true"
    >
      <div
        class="bg-gray-100 group-hover:bg-gray-300 transition duration-200 absolute"
        :class="{
          'h-px w-full inset-y-0 my-auto': !vertical,
          'w-px h-full inset-x-0 mx-auto': vertical,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  vertical?: boolean;
}>();

const emit = defineEmits<{
  drag: [
    value: number
  ];
}>();
const dragging = ref(false);
const handleMouseUp = () => (dragging.value = false)
const handleMouseMove = (e: MouseEvent) =>
    dragging.value
      ? emit("drag", props.vertical ? e.clientX : e.clientY)
      : null
onMounted(() => {
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mousemove", handleMouseMove);
});
onBeforeUnmount(() => {
  window.removeEventListener("mouseup", handleMouseUp)
  window.removeEventListener("mousemove", handleMouseMove)
})
</script>
