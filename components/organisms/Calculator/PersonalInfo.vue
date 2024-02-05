<template>
  <div class="flex flex-col gap-5" v-if="$state">
    <h1 class="text-3xl font-bold">Passagiere</h1>

    <h3
      class="flex justify-between items-center text-lg sm:text-xl font-medium"
    >
      <span class="text-gray-500"
        >Für wie viele Personen möchtest du eine Erstattung beantragen?</span
      >
      <InputStepper v-model="passengerCount" :min="1" :max="20" />
    </h3>
    <!-- <PotentialClaims /> -->
    <div class="flex flex-col gap-2">
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
  </div>
</template>

<script lang="ts" setup>
import InputStepper from "~~/components/molecules/InputStepper.vue";
import PotentialClaims from "~~/components/cells/PotentialClaims.vue";
import type { Database, ClaimsForm, PassengerDetails } from "@/types";
import PassengerForm from "./Forms/PassengerForm.vue";
import { uuid } from "vue-uuid";
import { watchDebounced } from "@vueuse/core";
import auth from "~/middleware/auth";
import { defaultClaim } from "@/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const { userExists, submitFlight, submitClaim } = useSupabaseFunctions();
const emit = defineEmits(["submit", "back"]);
const authOpen = ref(false);
const passengerHasAccount = ref(false);
const signUpMode = ref<"signIn" | "signUp">();

const props = defineProps<{
  modelValue: ClaimsForm;
}>();

const active = ref<number[]>([0]);

const passengerCount = ref(1);
const router = useRouter();
const successfulSignUp = () => {
  authOpen.value = false;
  router.push("/status");
  Object.assign(props.modelValue, defaultClaim);
};
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
        city: ""
      },
      email: "",
      iban: "",
      bookingNumber: ""
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
    console.log(
      passengerCount.value,
      props.modelValue.client.passengers?.length
    );
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
  // if (!user.value) authOpen.value = true;
  // if (!props.modelValue.client) addPassenger()
});
watchDebounced(
  () => props.modelValue.client.passengers[0]?.email,
  email => {
    if (!email) return;
    userExists({ email }).then(exists => {
      passengerHasAccount.value = exists;
    });
  },
  {
    debounce: 300,
    immediate: true
  }
);

async function sendEmail() {
  console.log("send-email");
  try {
    const { data, error } = await client.functions.invoke("send-email", {
      body: { to: "leonvogler@ok.de", name: "Leon Vogler" }
    });
    if (error) {
      console.error(error);
      // Handle error in sending email
    } else {
      console.log(data);
      // Email sent successfully
    }
  } catch (error) {
    console.error(error);
  }
}
const handleUploadFile = async (file: File) => {
  if (!file) {
    return "";
  }
  const options = {
    convertSize: 0.5,
    quality: 0.8,
    maxWidth: 1080,
    maxHeight: 1080
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
      upsert: false
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
