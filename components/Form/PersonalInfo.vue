<template>
  <div
    class="grid [&>*]:m-0 gap-4 [&_.formkit-inner]:max-w-full @container grid-cols-3 @md:grid-cols-4"
  >
    <FormKit
      type="text"
      v-if="firstName"
      :label="$t('firstName')"
      v-model="firstName"
      @input="console.log"
      outer-class="col-span-full @sm:col-span-2"
    />
    <FormKit
      type="text"
      v-if="lastName"
      :label="$t('lastName')"
      v-model="lastName" 
      outer-class="col-span-full @sm:col-span-2"
    />
    <span
      class="formkit-help !-mt-3 text-xs text-neutral-500 leading-tight col-span-full"
      v-if="firstName || lastName"
      >Stelle sicher, dass die Angabe mit dem Namen auf deiner Bordkarte
      übereinstimmt.</span
    >
    <div
      class="flex items-center gap-1 col-span-full"
      v-if="isMinor"
    >
      <FormKit
        type="checkbox"
        name="isMinor"
        decorator-icon="check"
        id="isMinor"
      />
      <label tag="label" for="isMinor" class="text-base leading-none"
        >{{ $t("isMinor") }}
      </label>
    </div>
      <!-- @input="$emit('update:modelValue', { ...model, email: $event})" -->
    <FormKit
      type="email"
      :label="$t('email')"
      v-if="email !== undefined"
      v-model="email"
      outer-class="col-span-full"
      help="Keine Sorge, wir schicken dir nicht ungefragt Werbung."
    />
    <InputIBAN
      v-if="iban"
      :label="$t('iban')"
      :name="$t('iban')"
      v-model="iban"
      help="Damit wird dir deinen Anspruch an dich auszahlen können."
      outer-class="col-span-full"
    />
    <FormKit
      type="tel"
      :label="`${$t('phone')} (${$t('optional')})`"
      v-model="phone"
      outer-class="col-span-full"
    />
    <InputAddress
      name="address"
      label="Adresse"
      v-if="address"
      :placeholder="{
        street: $t('forExample', { value: 'Haupstraße 1' }),
        postalCode: $t('forExample', { value: '10115' }),
        city: $t('forExample', { value: 'Berlin' }),
      }"
      v-model="address"
      class="col-span-full"
    />
  </div>
</template>

<script setup lang="ts">
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
const isMinor = defineModel('isMinor')
const email = defineModel('email')
const phone = defineModel('phone')
const iban = defineModel('iban')
const address = defineModel('address')

// const model = defineModel<{
// const model = defineModel<{
// const model = defineModel<{
//   firstName?: string;
//   lastName?: string;
//   isMinor?: boolean;
//   email?: string;
//   phone?: string;
//   iban?: string;
//   address?: {
//     street: string;
//     postalCode: string;
//     city: string;
//     country?: string;
//   };
// }>({ required: true })
</script>