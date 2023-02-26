<template>
  <div class="relative" ref="container">
    <FormKit
      type="text"
      :validation="validation"
      autocomplete="off"
      v-model="query"
      :name="name"
      :placeholder="placeholder"
      :label="label"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      @focus="inputFocused = true"
      @blur="blur"
      @prefix-icon-click="$emit('prefix-icon-click')"
      @suffix-icon-click="$emit('suffix-icon-click')"
      @keydown.down.prevent="keydown"
    />
    <ListAirport
      v-if="inputFocused || dropdownFocused"
      ref="list"
      class="w-full -mt-2"
      :query="query"
      @input="handleInput"
      @blur="blur"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import ListAirport from "./ListAirport.vue";
import { Airport } from "@/types";

export default defineComponent({
  components: {
    FormKit,
    ListAirport,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    placeholder: {
      type: String,
      required: true,
    },
    prefixIcon: {
      type: String,
    },
    suffixIcon: {
      type: String,
    },
    modelValue: {
      type: Object,
      required: true,
    },
    validation: {
      type: String,
    },
  },
  data() {
    return {
      query: "",
      inputFocused: false,
      dropdownFocused: false,
    };
  },
  watch: {
    modelValue: {
      handler(airport: Airport) {
        if (airport?.full) this.query = airport?.full;
      },
      deep: true,
      immediate: true,
    },
    inputFocused() {
      this.checkFocus()
    },
    dropdownFocused() {
      this.checkFocus()
    },
  },
  methods: {
    keydown(e: KeyboardEvent) {
      this.dropdownFocused = true;
      this.$refs.list.$el.children[0].focus()
    },
    blur(e: Event) {
      if (!e?.relatedTarget) {
        this.inputFocused = false
        this.dropdownFocused = false
      }
    },
    checkFocus() {
      if (this.inputFocused || this.dropdownFocused) return true
      this.inputFocused = false
      if (!this.modelValue?.full) this.query = "";
      if (this.query && this.modelValue?.full !== this.query) this.query = this.modelValue?.full;
      if (!this.query) this.$emit("update:modelValue", {});
    },
    handleInput(airport: Airport) {
      this.query = airport.full;
      this.$emit("update:modelValue", airport);
      this.dropdownFocused = false;
      this.inputFocused = false
    },
  },
});
</script>

<style>
.formkit-suffix-icon:hover {
  cursor: pointer;
}
.formkit-suffix-icon:hover svg {
  fill: var(--color-gray-800);
}
</style>
