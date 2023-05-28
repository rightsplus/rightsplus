<template>
  <div class="flex flex-col gap-5" v-if="$state">
    <h1 class="text-3xl font-bold">Passagiere</h1>

    <h3
      class="flex justify-between items-center text-lg sm:text-xl font-medium"
    >
      <span class="text-gray-500">Für wie viele Personen möchtest du eine Erstattung beantragen?</span>
    </h3>
    <div class="flex items-center bg-neutral-100 rounded-lg border border-neutral-200 overflow-hidden focus-within:border-primary-500">
      <button
      class="w-14 h-14 hover:bg-neutral-50 text-2xl"
        @click="
          modelValue.client.passengerCount = Math.max(
            (modelValue.client.passengerCount || 2) - 1,
            1
          )
        "
      >
        –
      </button>
      <input type="number" class="border-y-0 border-x border-neutral-200 focus:border-primary-500 !ring-0 h-14 grow justify-center flex items-center bg-neutral-50 font-bold text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" v-model="modelValue.client.passengerCount" />
      <button @click="modelValue.client.passengerCount++" class="w-14 h-14 hover:bg-neutral-50 text-2xl">+</button>
    </div>

    <h3
      class="flex justify-between items-center text-lg sm:text-xl font-medium"
    >
      <span class="text-gray-500">Wir benötigen noch ein paar Informationen, damit wir dich kontaktieren können.</span>
    </h3>
    <form class="flex flex-col" v-if="modelValue.client" autocomplete="on">
      <div class="grid grid-cols-2 gap-5">
        <FormKit
          v-model="modelValue.client.firstName"
          label="Vorname"
          autocomplete="given-name"
          name="firstName"
          :floatingLabel="true"
          :required="true"
        />
        <FormKit
          v-model="modelValue.client.lastName"
          label="Nachname"
          autocomplete="family-name"
          :floatingLabel="true"
          :required="true"
        />
      </div>
      <FormKit
        v-model="modelValue.client.email"
        label="Email"
        autocomplete="email"
        name="email"
        :floatingLabel="true"
        type="email"
        :required="true"
      />
      <!-- <InputIBAN
        v-model="modelValue.client.iban"
        label="IBAN"
        name="iban"
        :floatingLabel="true"
        :required="true"
      /> -->
      <FormKit
        v-model="modelValue.client.agreedToTerms"
        label="I have read and agree to the <a href='#'>terms and conditions</a>"
        type="checkbox"
        decorator-icon="check"
        :required="true"
      >
        <template #label
          ><span class="text-sm leading-none">
            Ich habe die
            <a
              href="/faq"
              class="text-primary-600 hover:underline"
              target="_blank"
              >Nutzungsbedingungen</a
            >
            gelesen und stimme diesen zu.</span
          ></template
        >
      </FormKit>
    </form>
    <NavigationButtons
      @previous="$emit('back')"
      @next="createAccount"
      :nextDisabled="!modelValue.client.agreedToTerms"
    />
  </div>
</template>

<script lang="ts" setup>
import InputIBAN from "~~/components/molecules/InputIBAN.vue";
import { Database, ClaimsForm } from "@/types";
import NavigationButtons from "./NavigationButtons.vue";

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const emit = defineEmits(["submit"]);

const { modelValue } = defineProps<{
  modelValue: ClaimsForm;
}>();

if (!modelValue.client)
  modelValue.client = {
    firstName: "",
    lastName: "",
    email: "",
    iban: "",
    passengerCount: 1,
    agreedToTerms: false,
  };

const createAccount = async () => {
  try {
    if (!modelValue.flight) return 
    const { data: signUpData, error: signUpError} = await client.auth.signInWithOtp({
        email: modelValue.client.email,
        options: {
          data: {
            first_name: modelValue.client.firstName,
            last_name: modelValue.client.lastName,
            // iban: modelValue.client.iban,
          },
        },
      });
      console.log(signUpData);
    if (signUpError) throw Error(signUpError.message)

    const preparedFlight = {
      number: modelValue.flight.flight.iata_number,
      status: modelValue.flight.status,
      airline_iata: modelValue.flight.airline.iata_code,
      airline: modelValue.flight.airline.name,
      codeshared: modelValue.flight.codeshared,
      scheduled_time_departure: modelValue.flight.departure.scheduled_time,
      actual_time_departure: modelValue.flight.departure.actual_time,
      delay_departure: getDelay(modelValue.flight.departure),
      airport_departure: modelValue.flight.departure.iata_code,
      scheduled_time_arrival: modelValue.flight.arrival.scheduled_time,
      actual_time_arrival: modelValue.flight.arrival.actual_time,
      delay_arrival: getDelay(modelValue.flight.arrival),
      airport_arrival: modelValue.flight.arrival.iata_code,
      data: modelValue.flight
      // arrival_delay: arrival_delay,
    }
    const { data: flightData, error: flightError } = await client
      .from("flights")
      .upsert([preparedFlight], { onConflict: 'number' })


      if (flightError) throw Error(flightError.message)
      console.log(flightData);

    const preparedCase = {
      email: modelValue.client.email,
      passenger_count: modelValue.client.passengerCount,
      flight_number: modelValue.flight.flight.iata_number,
    }
    const { data: caseData, error: caseError } = await client
      .from("cases")
      .insert([preparedCase])

      


    if (caseError) throw Error(caseError.message)
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
</script>

<style lang="scss" scoped></style>
