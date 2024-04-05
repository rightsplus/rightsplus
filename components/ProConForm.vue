<template>
  <div class="grid grid-cols-2 gap-2">
    <div class="flex flex-col gap-2">
      <Button
        prefix-icon="plus"
        class="text-white bg-red-500 hover:bg-red-600"
        @click="
          argument.cons
            ? argument.cons?.push({ user: currentUser.id, claim: '' })
            : (argument.cons = [{ user: currentUser.id, claim: '' }])
        "
        >Add Con</Button
      >
      <div v-for="c in argument.cons">
        <FormKit
          v-model="c.claim"
          :label="`Con (${users.find((e) => e.id === c.user)?.name})`"
          placeholder="Nah nah!"
          prefix-icon="trash"
        />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <Button
        prefix-icon="plus"
        class="text-white !bg-green-500 hover:!bg-green-600"
        @click="
          argument.pros
            ? argument.pros?.push({ user: currentUser.id, claim: '' })
            : (argument.pros = [{ user: currentUser.id, claim: '' }])
        "
        >Add Pro</Button
      >
      <FormKit
        v-for="p in argument.pros"
        v-model="p.claim"
        :label="`Pro (${users.find((e) => e.id === p.user)?.name})`"
        placeholder="All for it!"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  argument: any;
  currentUser: string;
  users: { id: string; name: string }[];
}>();
</script>

<style scoped></style>
