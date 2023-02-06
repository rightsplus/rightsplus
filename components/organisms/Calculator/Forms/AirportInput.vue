<template>
  <div>
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
      @focus="focused = true"
      @blur="focused = false"
      @prefix-icon-click="$emit('prefix-icon-click')"
      @suffix-icon-click="$emit('suffix-icon-click')"
    />
    <ListAirport
      v-if="focused"
      class="w-1/2 -mt-2"
      :query="query"
      @input="handleInput"
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
      focused: false,
    };
  },
  watch: {
    modelValue: {
      handler: function (airport: Airport) {
        if (airport?.full) this.query = airport?.full;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleInput(airport: Airport) {
      this.query = airport.full;
      this.$emit("update:modelValue", airport);
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
