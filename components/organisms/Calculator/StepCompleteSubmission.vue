<template>
  <div class="flex flex-col gap-5">
    <!-- <Callout type="info" icon="info-circle" key="" v-if="true">Wir haben dir eine</Callout> -->
    <h1 class="text-3xl font-bold" v-if="claim.value.id">
      Deine Referenz: {{ formatClaimId(claim.value.id) }}
    </h1>

    <div class="grid grid-cols-4">
      <div class="flex flex-col gap-2 col-span-full">
        <!-- <pre>{{ modelValue.flight }}</pre> -->
        <!-- {{ modelValue.flight }} -->
        <CellsFlightCard
          v-if="modelValue.flight"
          :flight="modelValue.flight"
          class="grid-span-full"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InputStepper from "~~/components/molecules/InputStepper.vue";
import type { Database, ClaimsForm } from "@/types";
import PassengerForm from "./Forms/PassengerForm.vue";
import { uuid } from "vue-uuid";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Callout from "~/components/core/Callout.vue";
import { claim } from "~/store";
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

const handleUploadFile = async (file: File) => {
  if (!file) {
    return "";
  }
  const options = {
    convertSize: 0.5,
    quality: 0.8,
    maxWidth: 1080,
    maxHeight: 1080,
  };
  console.log(file);
  const resizedFile = await compressImage(file, options);
  const fileExt = resizedFile.name.split(".").pop();
  const fileName = `${uuid.v4()}.${fileExt}`;
  const filePath = `${user.value?.id}/${fileName}`;
  const { data, error } = await client.storage
    .from("client-files")
    .upload(filePath, resizedFile, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    console.error(error);
    throw error;
  } else {
    console.log(data);
    return data.path;
  }
};
</script>
