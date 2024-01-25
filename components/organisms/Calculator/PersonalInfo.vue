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
      <Button
        type="button"
        class="bg-white text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
        @click="() => addPassenger()"
        >Passagier hinzufügen</Button
      >
    </div>
    <NavigationButtons @previous="$emit('back')" @next="submitPassengers" />
  </div>

  <Popup
    :open="authOpen"
    @closeOutside="authOpen = false"
    class="max-h-[90vh] w-[initial]"
  >
    <Authentication
      inPopup
      @close="authOpen = false"
      @success="authOpen = false"
      @changeMode="signUpMode = $event"
      :initialMode="passengerHasAccount ? 'signIn' : 'signUp'"
      :initialEmail="modelValue.client.passengers[0]?.email"
    />
  </Popup>
</template>

<script lang="ts" setup>
import InputStepper from "~~/components/molecules/InputStepper.vue";
import PotentialClaims from "~~/components/cells/PotentialClaims.vue";
import { Database, ClaimsForm, PassengerDetails } from "@/types";
import NavigationButtons from "./NavigationButtons.vue";
import ProviderButton from "~/components/molecules/ProviderButton.vue";
import PassengerForm from "./Forms/PassengerForm.vue";
import { uuid } from "vue-uuid";
import { watchDebounced } from "@vueuse/core";
import auth from "~/middleware/auth";
import { generatePDF } from "~/composables/supabase";

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const password = ref("");
const emit = defineEmits(["submit", "back"]);
const authOpen = ref(false);
const passengerHasAccount = ref(false);
const signUpMode = ref<"signIn" | "signUp">();

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
  (email) => {
    if (!email) return;
    userExists({ client, email }).then((exists) => {
      passengerHasAccount.value = exists;
    });
  },
  {
    debounce: 300,
    immediate: true,
  }
);

const submitPassengers = async () => {
  try {
    if (!props.modelValue.flight) return;
    const result = await Promise.all(
      props.modelValue.client.passengers.map(async (e) => {
        if (!user.value) {
          authOpen.value = true;
          // client.auth.signInWithOtp({
          //   email: e.email,
          //   options: {
          //     data: {
          //       first_name: e.firstName,
          //       last_name: e.lastName,
          //     },
          //   },
          // });
        }
        // user
        // return await handleUploadFile(e.boardingPass?.[0].file);
        // client.auth.signInWithOtp({
        //   email: e.email,
        //   options: {
        //     data: {
        //       first_name: e.firstName,
        //       last_name: e.lastName,
        //     },
        //   },
        // });
      })
    );
    console.log(result);

    // const { data: signUpData, error: signUpError } =
    //   await client.auth.signInWithOtp({
    //     email: props.modelValue.client..email,
    //     options: {
    //       data: {
    //         first_name: props.modelValue.client..firstName,
    //         last_name: props.modelValue.client..lastName,

    //       },
    //     },
    //   });

    // console.log(signUpData, signUpError);
    // if (signUpError) throw Error(signUpError.message);
    if (!user.value) {
      console.warn("User not logged in");
      return;
    }

    const preparedFlight = {
      number: props.modelValue.flight.flight.iata,
      status: props.modelValue.flight.flight_status,
      airline_iata: props.modelValue.flight.airline.iata,
      airline: props.modelValue.flight.airline.name,
      codeshared: props.modelValue.flight.flight.codeshared,
      scheduled_departure: props.modelValue.flight.departure.scheduled,
      actual_departure: props.modelValue.flight.departure.actual,
      airport_departure: props.modelValue.flight.departure.iata,
      scheduled_arrival: props.modelValue.flight.arrival.scheduled,
      actual_arrival: props.modelValue.flight.arrival.actual,
      delay_arrival: props.modelValue.flight.arrival.delay,
      airport_arrival: props.modelValue.flight.arrival.iata,
      data: props.modelValue.flight,
      // arrival_delay: arrival_delay,
    };
    const { data: flightData, error: flightError } = await client
      .from("flights")
      .upsert([preparedFlight], { onConflict: "number" });

    if (flightError) throw Error(flightError.message);

    const preparedCase = {
      email: user.value?.email,
      passenger_count: props.modelValue.client.passengerCount,
      flight_number: props.modelValue.flight.flight.iata,
    };
    const { data: caseData, error: caseError } = await client
      .from("cases")
      .upsert([preparedCase])
      .select("*");

    if (caseError) throw Error(caseError.message);

    if (Object.keys(caseData).length) {
      useRouter().push("/status");
    }
    // console.log(flightData, flightError);
    // console.log(caseData, caseError);
    // // }

    // if (signUpError) throw signUpError;
    // console.log("Check your email for the login link!");
    // emit("submit");
  } catch (error) {
    console.log(error);
  } finally {
    // console.log("done!");
  }
};

async function sendEmail() {
  console.log("send-email");
  try {
    const { data, error } = await client.functions.invoke("send-email", {
      body: { to: "leonvogler@ok.de", name: "Leon Vogler" },
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
