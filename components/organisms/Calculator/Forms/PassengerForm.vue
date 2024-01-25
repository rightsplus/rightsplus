<template>
  <div class="p-5 pt-0 bg-neutral-50 rounded-xl w-full group">
    <div id="geocoder"></div>
    <pre id="result"></pre>
    <AccordionItem
      :index="index"
      :modelValue="open"
      @update:modelValue="emit('setOpen', $event)"
      :tag="{ outer: 'div', inner: 'div', title: 'h3' }"
      collapsible
      v-if="modelValue"
    >
      <template #title>
        <div class="w-full col-span-full flex justify-between items-center">
          <span class="flex flex-col justify-center h-11">
            <span
              :class="[
                'duration-200 origin-top-left absolute',
                name
                  ? 'scale-100 text-sm font-normal text-gray-500 -translate-y-3'
                  : 'text-xl -translate-y-1',
              ]"
              >{{ passenger(index) }}</span
            >
            <span
              :class="['duration-100', name ? 'translate-y-2.5' : 'opacity-0']"
              >{{ name || "-" }}</span
            ></span
          ><span v-if="length > 1"
            ><FontAwesomeIcon
              icon="trash"
              fixed-width
              class="text-sm hover-hover:opacity-100 opacity-0 group-hover:opacity-100 text-red-500 hover:!text-red-600 cursor-pointer"
              role="button"
              aria-labelledby="remove-passenger-label"
              @click="emit('remove')"
            /><span id="remove-passenger-label" class="sr-only"
              >Passagier entfernen</span
            ></span
          >
        </div>
      </template>
      <template #content>
        <div
          class="grid [&>*]:m-0 gap-4 grid-cols-4 [&_.formkit-inner]:max-w-full"
        >
          <FormKit
            type="text"
            :label="$t('firstName')"
            v-model="modelValue.firstName"
            outer-class="col-span-2"
          />
          <FormKit
            type="text"
            :label="$t('lastName')"
            v-model="modelValue.lastName"
            outer-class="col-span-2"
          />
          <AddressInput
            name="address"
            label="Adresse"
            placeholder="z.B. Haupstraße 1, 10115 Berlin"
            v-model="modelValue.address"
            class="col-span-full"
          />
          <FormKit
            type="email"
            :label="$t('email')"
            v-model="modelValue.email"
            @input="emit('update:modelValue', { ...modelValue, email: $event })"
            outer-class="col-span-2"
          />
          <FormKit
            type="tel"
            :label="$t('phone')"
            v-model="modelValue.phone"
            outer-class="col-span-2"
          />
          <InputIBAN
            :label="$t('iban')"
            :name="$t('iban')"
            v-model="modelValue.iban"
            outer-class="col-span-full"
          />
          <FormKit
            :label="$t('bookingNumber')"
            v-model="modelValue.bookingNumber"
            outer-class="col-span-2"
            placeholder="z.B. XY789"
            maxlength="20"
            v-maska:[options]
          />
          <FormKit
            type="file"
            accept="image/*, application/pdf"
            :label="$t('boardingPass')"
            v-model="modelValue.boardingPass"
            outer-class="col-span-2"
            placeholder="z.B. XY789"
            ref="fileInput"
            :fileIcon="'image'"
            fileRemoveIcon="xmark"
            suffix-icon="image"
          />
            <!-- :fileIcon="modelValue.boardingPass?.[0]?.file.type?.includes('image') ? 'image' : 'file'" -->
            <!-- @suffix-icon-click="
              (_, e) => {
                console.log(modelValue.boardingPass)
                if (!Object.keys(modelValue.boardingPass || {}).length) {
                  handleFormKitIconClick(e);
                } else {
                  modelValue.boardingPass = undefined;
                }
              }
            " -->
        </div>
      </template>
    </AccordionItem>
  </div>
</template>

<script setup lang="ts">
import InputIBAN from "~~/components/molecules/InputIBAN.vue";
import AccordionItem from "../../Accordion/AccordionItem.vue";
import AddressInput from "./AddressInput.vue";
import { PassengerDetails } from "@/types";
import { MaskInputOptions, vMaska } from "maska";
const props = defineProps<{
  modelValue: PassengerDetails;
  index: number;
  length: number;
  open: number[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: PassengerDetails];
  remove: [];
  setOpen: [indices: number[]];
}>();

onMounted(() => {
  if (!Object.keys(props.modelValue || {}).length) {
    emit("update:modelValue", {
      firstName: "",
      lastName: "",
      address: {
        street: "",
        postalCode: "",
        city: "",
      },
      email: "",
      iban: "",
      bookingNumber: "",
      phone: "",
    });
  }
});

const name = computed(() => {
  return [props.modelValue.firstName, props.modelValue.lastName]
    .filter(Boolean)
    .join(" ");
});
const passenger = (index: number) => {
  return index === 0 ? "Deine Angaben" : `${index + 1}. Passagier`;
};

const options: MaskInputOptions = reactive({
  tokens: {
    "@": {
      pattern: /[a-zA-Z0-9]/,
      transform: (chr: string) => chr.toUpperCase(),
      repeated: true,
    },
  },
  mask: () => "@",
});
</script>
