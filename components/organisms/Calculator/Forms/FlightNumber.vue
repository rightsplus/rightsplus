<template>
  <FormKit
    type="form"
    :form-class="submitted ? 'hide' : 'show'"
    :actions="false"
    v-model="value"
  >
    <h2 class="text-xl font-medium mb-8">
      Gib hier deinen ersten geplanten Flug ein.
    </h2>
    <div class="double gap-3">
      <FormKit
        type="text"
        name="flightNumber"
        label="Flugnummer"
        validation="required|length:5|matches:/[a-zA-Z0-9]/"
        placeholder="AG124"
        maxlength="5"
        input-class="uppercase"
        value="LH695"
      />
      <FormKit
        type="date"
        name="flightDate"
        label="Flugdatum"
        validation="required|date"
        input-class="uppercase"
        value="2023-01-31"
      />
    </div>

    <FormKit
      type="submit"
      @click.prevent="submitHandler"
      label="Jetzt Entschädigung berechnen!"
      help="* die Entschädigungssumme hängt von Verspätungsdauer und Flugdistanz ab."
    />
  </FormKit>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import TrieSearch from "trie-search";
import ListAirport from "./ListAirport.vue";
import { Airport } from "@/types";
import { countries } from "@/config/countries";

export default defineComponent({
  components: {
    FormKit,
    ListAirport,
  },
  props: {
    modelValue: {
      type: Object,
    },
  },
  data() {
    return {
      submitted: false,
      limit: 10,
      value: this.modelValue,
      focused: {
        departure: false,
        arrival: false,
      },
    };
  },

  mounted() {
  },
  watch: {
    value: {
      handler(val) {
        this.$emit("update:modelValue", val);
      },
      deep: true,
    },
  },
  methods: {
    submitHandler() {
      fetch("api/aviationstack.json")
        .then((data) => data.json())
        .then(({ data }) => {
          this.$state.flights = data;
        })
        .catch((error) => {
          console.log(error);
        });
      this.$emit("submit");
      return;
    },
  },
});
</script>
<style scoped>
.double {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.triple {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
