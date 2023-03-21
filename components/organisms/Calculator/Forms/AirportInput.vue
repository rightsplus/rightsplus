<template>
  <div class="relative">
    <FormKit
      ref="input"
      type="text"
      :validation="validation"
      autocomplete="off"
      v-model="query"
      :name="name"
      :label="label"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      @focus="inputFocused = true"
      @blur="inputFocused = false"
      @prefix-icon-click="$emit('prefix-icon-click')"
      @suffix-icon-click="$emit('suffix-icon-click')"
      @keydown.down.up.prevent="keydown"
      @keydown.enter.prevent="enter"
      :floatingLabel="true"
      :classes="{
        inner: inputFocused && airports.length && query.length ? 'rounded-b-none max-w-full' : 'max-w-full',
      }"
    />
    <ListAirport
      v-if="inputFocused && query.length"
      class="w-full -mt-[15px]"
      :query="query"
      :limit="5"
      :selected="selectedInList"
      @airports="airports = $event"
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
      selectedInList: 0,
      query: "",
      inputFocused: false,
      airports: [],
    };
  },
  watch: {
    query() {
      this.selectedInList = 0;
    },
    modelValue: {
      handler(airport: Airport) {
        if (airport?.full) this.query = airport?.full;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    enter(e: KeyboardEvent) {
      if (this.airports.length) {
        const { iata, full, name, city, country, countryName, lat, lon } =
          this.airports[this.selectedInList];
        this.handleInput({
          iata,
          full,
          name,
          city,
          country,
          countryName,
          lat,
          lon,
        });
      } else {

      focusNext(true);
      }
    },
    keydown(e: KeyboardEvent) {
      if (e?.key === "ArrowDown") {
        this.selectedInList = this.selectedInList + 1;
        if (this.selectedInList > this.airports.length - 1)
          this.selectedInList = 0;
      }
      if (e?.key === "ArrowUp") {
        this.selectedInList = this.selectedInList - 1;
        if (this.selectedInList < 0)
          this.selectedInList = this.airports.length - 1;
      }
    },
    handleInput(airport: Airport) {
      this.query = airport.full;
      this.$emit("update:modelValue", airport);
      focusNext(true);
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
