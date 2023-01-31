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
      <h2 class="text-xl font-medium mb-12">
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
        />
        <FormKit
          type="date"
          name="flightDate"
          label="Flugdatum"
          validation="required|confirm"
        />
      </div>

      <FormKit type="submit" label="Jetzt Entschädigung berechnen!" />
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
