<template>
  <div class="flex flex-col gap-5" v-if="$state">
    <h1 class="text-3xl font-bold">Personal</h1>
		{{ user }}
    <div class="flex flex-col gap-3" v-if="modelValue.client">
      <FormKit
				v-model="modelValue.client.firstName"
				label="Vorname"
				placeholder="z.B. Noa"
				:required="true"
			/>
      <FormKit
				v-model="modelValue.client.email"
				label="Email"
				type="email"
				placeholder="noa@mail.com"
				:required="true"
			/>
      <FormKit
				v-model="modelValue.client.agreedToTerms"
				label="I have read and agree to the terms and conditions."
				type="checkbox"
				:required="true"
			/>
    </div>
    <NavigationButtons
      @previous="$emit('back')"
      @next="createAccount"
      :nextDisabled="false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ClaimsForm } from '~~/types';
import NavigationButtons from './NavigationButtons.vue';
const client = useSupabaseClient();
const user = useSupabaseUser();
const { modelValue } = defineProps<{
	modelValue: ClaimsForm
}>();

if (!modelValue.client) modelValue.client = {
	firstName: '',
	email: '',
	agreedToTerms: false,
};

const createAccount = async () => {
  try {
    const response = await client.auth.signInWithOtp({ email: modelValue.client.email })
    if (response.error) throw response.error
    console.log(response)
    console.log('Check your email for the login link!')
  } catch (error) {
    console.log(error)
  } finally {
    console.log('done!')
  }
}
</script>

<style lang="scss" scoped>

</style>