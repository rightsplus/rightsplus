<template>
  <section class="p-5 md:p-12 md:py-24 bg-stone-50">
    <div
      class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2"
      :class="{
        'md:grid-cols-1': layout === 'column',
      }"
    >
      <div
        class="col-span-1 md:col-span-2 text-stone-500 font-medium"
        :class="{
          'md:col-span-1': layout === 'column',
        }"
      >
        {{ data.preCopy }}
      </div>
      <div class="flex flex-col gap-3">
        <div class="text-2xl md:text-4xl mb-12">{{ data.copy }}</div>
      </div>
      <ContactForm :collapsed="true"/>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ContactForm from "./ContactForm.vue";
export default defineComponent({
  components: {
    ContactForm,
  },
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      touched: false,
      contact: {
        name: "",
        email: "",
        message: "",
      },
      sending: false,
      sent: false,
    };
  },
  methods: {
    async send() {
      if (!this.contact.email) return;
      console.log("sending ...");
      this.sending = true;
      this.$strapi
        .client("email", {
          to: "leonvogler@ok.de",
          from: this.contact.email,
          subject: this.contact.name + " hat dir eine Nachricht geschrieben!",
          text: this.contact.message,
        })
        .then((res) => {
          this.sent = true;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.sending = false;
        });
    },
  },
});
</script>

<style scoped></style>
