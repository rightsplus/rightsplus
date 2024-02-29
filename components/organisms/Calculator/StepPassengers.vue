<template>
  <div class="flex flex-col gap-5" v-if="$state">
    <h1 class="text-3xl font-bold text-center text-balance m-12 flex flex-col gap-5"><FontAwesomeIcon icon="money-bill-1-wave" class="text-green-500"/><span>Du hast möglicherweise Anspruch auf <CellsClaimableAmount class="font-bold" full />!</span></h1>
    

    <span
      >Um deinen Anspruch zu prüfen und für dich einzufordern benötigen wir noch
      einige Angaben.</span
    >

    <!-- <PotentialClaims /> -->
    <div class="flex flex-col gap-2">
      <FormKit
        :label="$t('bookingNumber')"
        v-model="modelValue.client.bookingNumber"
        outer-class="col-span-2"
        placeholder="z.B. XY789"
        maxlength="20"
        v-maska:[bookingNumberMask]
      />
      <PassengerForm
        v-if="modelValue.client.passengers.length > 0"
        v-for="(p, i) in modelValue.client.passengers"
        :open="active"
        @setOpen="active = $event"
        :key="i"
        :index="i"
        :modelValue="p"
        :length="modelValue.client.passengers?.length"
        @remove="modelValue.client.passengers?.splice(i, 1)"
        @update:modelValue="modelValue.client.passengers[i] = $event"
      />
      <!-- <div v-if="passengerHasAccount" class="flex flex-col gap-2 text-xs">
        <div class="flex items-center gap-2">
          <FontAwesomeIcon icon="check-circle" class="text-green-500" /><span
            >You seem to already have an account with us.</span
          >
        </div>
      </div> -->
      <button
        class="border border-neutral-100 hover:bg-neutral-100 h-12 text-base rounded-lg flex gap-2 items-center justify-center"
        @click="() => addPassenger()"
      >
        <FontAwesomeIcon icon="plus" class="text-sm" />Passagier hinzufügen
      </button>
    </div>
    <!-- <h3
      class="flex justify-between items-center text-lg sm:text-xl font-medium"
    >
      <span class="text-gray-500"
        >Für wie viele Personen möchtest du eine Erstattung beantragen?</span
      >
      <InputStepper v-model="passengerCount" :min="1" :max="20" />
    </h3> -->
  </div>
</template>

<script lang="ts" setup>
import InputStepper from "~~/components/molecules/InputStepper.vue";
import type { Database, ClaimsForm } from "@/types";
import PassengerForm from "./Forms/PassengerForm.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { MaskInputOptions } from "maska";
import { vMaska } from "maska";

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const emit = defineEmits(["submit", "back"]);

const props = defineProps<{
  modelValue: ClaimsForm;
}>();

const active = ref<number[]>([0]);

const passengerCount = ref(1);

const addPassenger = (n = 1) => {
  if (!props.modelValue.client.passengers)
    props.modelValue.client.passengers = [];
  Array.from({ length: n }).forEach(() => {
    props.modelValue.client.passengers.push({
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
    });
  });
  if (n === 1) {
    active.value = [props.modelValue.client.passengers.length - 1];
  }
};
const removePassenger = (n = 1) => {
  if (!props.modelValue.client.passengers)
    props.modelValue.client.passengers = [];
  props.modelValue.client.passengers.splice(
    props.modelValue.client.passengers.length - n,
    n
  );
};
watch(
  () => passengerCount.value,
  () => {
    if (passengerCount.value > props.modelValue.client.passengers?.length) {
      addPassenger(
        passengerCount.value - props.modelValue.client.passengers?.length
      );
    } else if (
      passengerCount.value < props.modelValue.client.passengers?.length
    ) {
      removePassenger(
        props.modelValue.client.passengers?.length - passengerCount.value
      );
    }
  }
);
watch(
  () => props.modelValue.client.passengers?.length,
  () => {
    passengerCount.value = props.modelValue.client.passengers?.length || 1;
  },
  { immediate: true }
);
onMounted(() => {
  if (user.value?.email) {
    client
      .from("users")
      .select("*")
      .eq("email", user.value.email)
      .then(({ data, error }) => {
        if (error) throw error;
        if (data.length) {
          console.log(data);
          // props.modelValue.client = data[0];
          // passengerCount.value = props.modelValue.client.passengers?.length || 1;
        }
      });
  }
});

const bookingNumberMask: MaskInputOptions = reactive({
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
