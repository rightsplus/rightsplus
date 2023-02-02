<template>
  <div class="bg-white rounded-3xl p-12">
    <FormKit
      type="form"
      :form-class="submitted ? 'hide' : 'show'"
      submit-label="Jetzt Entschädigung berechnen!"
      @submit="submitHandler"
      :actions="false"
      #default="{ value }"
    >
      <!-- :config="{
        classes: {
          inner: '!shadow-none',
          input: '!bg-neutral-100 placeholder-neutral-500 !rounded-lg',
          help: 'text-sm !text-neutral-500 !leading-0 !mt-3',
        },
      }" -->
      <h2 class="text-xl font-medium mb-8">
        Gib hier deine Flugdaten ein und sichere dir bis zu 450€* Entschädigung.
      </h2>
      <div class="double">
        <FormKit
          type="text"
          name="flightNumber"
          label="Flugnummer"
          validation="required|length:6|matches:/[a-zA-Z0-9]/"
          :validation-messages="{
            matches: 'Please include at least one symbol',
          }"
          placeholder="AG1234"
          maxlength="6"
          input-class="uppercase"
        />
        <FormKit
          type="date"
          name="flightDate"
          label="Flugdatum"
          validation="required|confirm"
          input-class="uppercase"
        />
      </div>

      <FormKit
        type="submit"
        label="Jetzt Entschädigung berechnen!"
        help="* die Entschädigungssumme hängt von Verspätungsdauer und Flugdistanz ab."
      />
    </FormKit>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";

export default defineComponent({
  components: {
    FormKit,
  },
  data() {
    return {
      submitted: false,
    };
  },
  methods: {
    submitHandler(data: any) {
      console.log(data);
    },
  },
});
</script>
<style scoped>
.double {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
}
</style>
