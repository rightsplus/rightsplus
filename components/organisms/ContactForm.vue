<template>
  <FormKit
    type="form"
    v-model="contact"
    class="flex-grow"
    style="--fk-max-width-input: 100%; --fk-margin-decorator: 0"
    @submit="send"
    :submit-label="
      sending
        ? 'Wird gesendet ...'
        : sent
        ? 'Erfolgreich gesendet'
        : error
        ? error
        : 'Senden'
    "
    :submit-attrs="{
      wrapperClass: sent ? 'success' : error ? 'alert' : '',
    }"

  >
    <FormKit
      type="text"
      name="name"
      validation="required"
      :placeholder="$t('your.name')"
      v-if="touched"
    />
    <FormKit
      type="email"
      name="email"
      validation="required"
      :placeholder="$t('your.email')"
      v-if="touched"
    />
    <FormKit
      type="textarea"
      name="nachricht"
      validation="required"
      :placeholder="$t('your.message')"
      @focus="touched = true"
    />
    <FormKit
      type="checkbox"
      name="confirm"
      validation="accepted"
      :label="$t('confirm.data')"
      label-class="!text-sm !leading-tight text-stone-400 !ml-5"
      v-if="touched"
      :validation-messages="{
        accepted: 'Bitte akzeptieren.'
      }"
    />
    <!-- <FormKit type="search" outer-class="invisible absolute" name="search" /> -->
  </FormKit>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    collapsed: {
      type: Boolean,
    },
  },
  data() {
    return {
      touched: !this.collapsed || false,
      contact: {
        name: "",
        email: "",
        nachricht: "",
        confirm: false,
        search: "",
      },
      sending: false,
      sent: false,
      error: false,
    };
  },
  methods: {
    async send() {
      console.log("clicked");
      this.error = false;
      if (
        !this.contact.email ||
        !this.contact.name ||
        !this.contact.nachricht ||
        !this.contact.confirm ||
        this.contact.search
      )
        return;
      console.log("sending ...");
      this.sending = true;
      this.$strapi
        .client("email", {
          to: useRuntimeConfig().public.email.to,
          from: this.contact.email,
          subject: this.contact.name + " hat dir eine Nachricht geschrieben!",
          replyTo: this.contact.email,
          text: this.contact.nachricht,
        })
        .then((res) => {
          this.sent = true;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          this.error = err.error.message;
        })
        .finally(() => {
          this.sending = false;
        });
    },
  },
});
</script>

<style scoped></style>
