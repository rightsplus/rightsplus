<template>
  <div class="p-5 pt-0 bg-neutral-50 rounded-xl w-full group @container">
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
              :class="[
                'duration-100 flex items-center gap-2',
                name ? 'translate-y-2.5' : 'opacity-0',
              ]"
              ><span>{{ name || "-" }}</span
              ><span
                v-if="modelValue.isMinor"
                class="text-xs bg-neutral-200 text-neutral-500 px-2 py-1 rounded font-medium"
                >minderjährig</span
              ></span
            ></span
          >
          <div class="flex items-center gap-2">
            <span v-if="index" class="flex items-center"
              ><FontAwesomeIcon
                icon="trash"
                fixed-width
                class="text-sm opacity-0 group-hover:opacity-100 text-red-500 hover:!text-red-600 cursor-pointer"
                role="button"
                aria-labelledby="remove-passenger-label"
                @click="emit('remove')"
              /><span
                id="remove-passenger-label"
                class="sr-only"
                role="label"
                >{{ $t("remove", { value: $t("passenger") }) }}</span
              ></span
            >

            <button
              class="flex items-center"
              v-if="getCurrentInstance()?.vnode.props?.onSave && pendingChanges"
              @click.stop="$emit('save')"
            >
              <FontAwesomeIcon
                :icon="loading ? 'circle-quarter' : 'cloud-arrow-up'"
                fixed-width
                class="text-lg"
                :class="loading ? 'animate-revolve' : ''"
                aria-labelledby="pendingChanges-label"
              /><span id="pendingChanges-label" class="sr-only">{{
                $t(loading ? "pendingChanges" : "missingFields")
              }}</span>
            </button>
            <button
              class="flex items-center"
              v-if="
                getCurrentInstance()?.vnode.props?.onRevert && pendingChanges
              "
              @click.stop="$emit('revert')"
            >
              <FontAwesomeIcon
                :icon="'arrow-rotate-left'"
                fixed-width
                class="text-lg"
                aria-labelledby="pendingChanges-label"
              /><span id="pendingChanges-label" class="sr-only">{{
                $t(loading ? "pendingChanges" : "missingFields")
              }}</span>
            </button>

            <span
              class="flex items-center"
              v-if="
                Object.values(touched).some(Boolean) || !open.includes(index)
              "
              ><FontAwesomeIcon
                :icon="completed ? 'circle-check' : 'triangle-exclamation'"
                fixed-width
                class="text-lg"
                :class="completed ? 'text-green-500' : 'text-yellow-500'"
                aria-labelledby="completed-label"
              /><span id="completed-label" class="sr-only">{{
                $t(completed ? "completed" : "missingFields")
              }}</span></span
            >
          </div>
        </div>
      </template>
      <template #content>
        <div
          class="grid [&>*]:m-0 gap-4 [&_.formkit-inner]:max-w-full @container grid-cols-3 @md:grid-cols-4"
        >
          <FormKit
            type="text"
            :label="$t('firstName')"
            v-model="modelValue.firstName"
            outer-class="col-span-full @md:col-span-2"
            :suffix-icon="icon('firstName')"
            :suffix-icon-class="iconClass('firstName')"
            @blur="touched.firstName = true"
          />
          <FormKit
            type="text"
            :label="$t('lastName')"
            v-model="modelValue.lastName"
            outer-class="col-span-full @md:col-span-2"
            :suffix-icon="icon('lastName')"
            :suffix-icon-class="iconClass('lastName')"
            @blur="touched.lastName = true"
          />
          <span
            class="formkit-help !-mt-3 text-xs text-neutral-500 leading-tight col-span-full"
            >Stelle sicher, dass die Angabe mit dem Namen auf der Bordkarte
            übereinstimmt.</span
          >
          <div class="flex items-center gap-1 col-span-2" v-if="index > 0">
            <FormKit
              type="checkbox"
              name="isMinor"
              v-model="modelValue.isMinor"
              decorator-icon="check"
              id="isMinor"
            />
            <label tag="label" for="isMinor" class="text-base leading-none"
              >{{ $t("isMinor") }}
            </label>
          </div>
          <div class="flex items-center gap-1 col-span-2" v-if="index > 0">
            <InputDate
              :label="$t('dateOfBirth')"
              v-model="modelValue.dateOfBirth"
              class="col-span-full @md:col-span-2"
              calendar
              popup
            />
          </div>
          <span v-if="modelValue.isMinor" class="col-span-full leading-0"
            >Angaben zu den Erziehungsberechtigten</span
          >

          <FormKit
            v-if="modelValue.isMinor"
            type="text"
            :label="$t('firstName')"
            v-model="modelValue.guardian.firstName"
            outer-class="col-span-full @md:col-span-2"
            :suffix-icon="icon('firstName')"
            :suffix-icon-class="iconClass('firstName')"
            @blur="touched.firstName = true"
          />
          <FormKit
            v-if="modelValue.isMinor"
            type="text"
            :label="$t('lastName')"
            v-model="modelValue.guardian.lastName"
            outer-class="col-span-full @md:col-span-2"
            :suffix-icon="icon('lastName')"
            :suffix-icon-class="iconClass('lastName')"
            @blur="touched.lastName = true"
          />
          <FormKit
            type="email"
            :label="$t('email')"
            v-model="modelValue.email"
            @input="emit('update:modelValue', { ...modelValue, email: $event })"
            help="Keine Sorge, wir schicken nicht ungefragt Werbung."
            @focus="emailFocus = true"
            @blur="
              () => {
                emailFocus = false;
                touched.email = true;
              }
            "
            outer-class="col-span-full"
            :inner-class="
              emailFocus && modelValue.email
                ? validEmail
                  ? '!ring-green-500'
                  : '!ring-red-500'
                : ''
            "
            :suffix-icon="validEmail ? 'circle-check' : 'circle-xmark'"
            :suffix-icon-class="
              !validEmail && modelValue.email
                ? '[&>svg]:fill-red-500'
                : emailFocus && modelValue.email
                ? '[&>svg]:!fill-green-500'
                : 'opacity-0'
            "
          />
          <AddressInput
            name="address"
            label="Adresse"
            :placeholder="{
              street: $t('forExample', { value: 'Haupstraße 1' }),
              postalCode: $t('forExample', { value: '10115' }),
              city: $t('forExample', { value: 'Berlin' }),
            }"
            :suffix-icon="{
              street: icon('address', 'street'),
              postalCode: icon('address', 'postalCode'),
              city: icon('address', 'city'),
            }"
            :suffix-icon-class="{
              street: iconClass('address', 'street'),
              postalCode: iconClass('address', 'postalCode'),
              city: iconClass('address', 'city'),
            }"
            @blur:street="
              touched.address = { ...touched.address!, street: true }
            "
            @blur:postalCode="
              touched.address = { ...touched.address!, postalCode: true }
            "
            @blur:city="touched.address = { ...touched.address!, city: true }"
            v-model="modelValue.address"
            class="col-span-full"
          />
          <InputIBAN
            :label="$t('iban')"
            :name="$t('iban')"
            v-model="modelValue.iban"
            help="Damit wird dir deinen Anspruch auszahlen können."
            outer-class="col-span-full"
            :touched="touched.iban"
            @blur="touched.iban = true"
          />
          <InputFile
            accept="image/*, application/pdf"
            :label="index > 0 ? $t(`Lade die Bordkarte von ${modelValue.firstName || 'diesem Passagier'} hoch`) : $t('Lade deine Bordkarte hoch')"
            v-model="modelValue.boardingPass"
            class="col-span-full"
            ref="fileInput"
            icon="ticket-airline"
            fileRemoveIcon="xmark"
            multiple
          />
          <!-- icon="ticket-airline" -->

          <!-- <div class="col-span-full  text-sm">Damit wir den Fall notfalls vor Gericht verteidigen können.</div> -->
          <!-- <div class="col-span-full  text-sm">Damit wird dir das Geld auszahlen können.</div> -->

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
import AccordionItem from "../../Accordion/AccordionItem.vue";
import AddressInput from "./AddressInput.vue";
import type { PassengerDetails } from "@/types";
import IBAN from "iban";

const props = defineProps<{
  modelValue: PassengerDetails;
  index: number;
  open: number[];
  length?: number;
  loading?: boolean;
  pendingChanges?: boolean;
}>();

const touched = ref<Partial<PassengerDetails<boolean>> & { form: boolean }>({
  firstName: false,
  lastName: false,
  address: {
    street: false,
    postalCode: false,
    city: false,
  },
  email: false,
  iban: false,
  form: false,
});
watch(
  () => props.open,
  (open) => {
    if (!open.includes(props.index)) {
      touched.value.form = true;
    }
  },
  { deep: true }
);
watch(
  () => props.modelValue.isMinor,
  (open) => {
    if (props.modelValue.isMinor && !props.modelValue.guardian) {
      props.modelValue.guardian = {
        firstName: "",
        lastName: "",
      };
    }
    if (props.modelValue.isMinor && !props.modelValue.dateOfBirth) {
      props.modelValue.dateOfBirth = new Date(
        new Date().getFullYear() - 18,
        new Date().getMonth(),
        new Date().getDate()
      )
        .toISOString()
        .slice(0, 10);
    }
  },
  { deep: true, immediate: true }
);

const emit = defineEmits<{
  "update:modelValue": [value: PassengerDetails];
  remove: [];
  save: [];
  revert: [];
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
    });
  }
});
const validEmail = computed(() => validateEmail(props.modelValue.email));
const emailFocus = ref(false);

const name = computed(() => {
  return [props.modelValue.firstName, props.modelValue.lastName]
    .filter(Boolean)
    .join(" ");
});
const completed = computed(() => {
  const complete = Object.values(props.modelValue).every(Boolean);
  const validEmail = validateEmail(props.modelValue.email);
  const validIBAN = IBAN.isValid(props.modelValue.iban);
  const validBoardingPass = !!props.modelValue.boardingPass?.length;
  return complete && validEmail && validIBAN && validBoardingPass;
});
const passenger = (index: number) => {
  return index === 0 ? "Deine Angaben" : `${index + 1}. Passagier`;
};
const hasValue = (prop: keyof PassengerDetails, subprop?: string) => {
  let value = props.modelValue[prop];
  if (subprop && value && subprop in value) return value[subprop];
  return value;
};
const wasTouched = (prop: keyof PassengerDetails, subprop?: string) => {
  let touch = touched.value[prop];
  if (subprop && touch && subprop in touch) return touch[subprop];
  return !!touch;
};
const icon = (prop: keyof PassengerDetails, subprop?: string) => {
  return !hasValue(prop, subprop) && !!wasTouched(prop, subprop)
    ? "triangle-exclamation"
    : "circle-check";
};
const iconClass = (prop: keyof PassengerDetails, subprop?: string) => {
  return !hasValue(prop, subprop) && !!wasTouched(prop, subprop)
    ? "[&>svg]:fill-yellow-500"
    : "opacity-0";
};
</script>
