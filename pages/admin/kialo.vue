<template>
  <div class="flex flex-col gap-2 p-5 w-full">
    <div class="flex flex-col gap-2">
      <span>Debate</span>
      <div class="grid gap-2">
        <!-- <pre>{{ debate }}</pre> -->
        <FormKit
          v-model="debate.claim"
          label="Claim"
          placeholder="We need a solar panel!"
        />
        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-2">
            <Button
              prefix-icon="plus"
              class="text-white bg-red-500 hover:bg-red-600"
              @click="debate.cons?.push({ user: currentUser.id, claim: '' })"
              >Add Con</Button
            >
            <div v-for="con in debate.cons">
              <FormKit
                v-model="con.claim"
                :label="`Con (${users.find((e) => e.id === con.user)?.name})`"
                placeholder="Nah nah!"
                prefix-icon="trash"
              />
              <div class="grid grid-cols-2 gap-2">
                <div class="flex flex-col gap-2">
                  <Button
                    prefix-icon="plus"
                    class="text-white bg-red-500 hover:bg-red-600"
                    @click="
                      con.cons
                        ? con.cons?.push({ user: currentUser.id, claim: '' })
                        : (con.cons = [{ user: currentUser.id, claim: '' }])
                    "
                    >Add Con</Button
                  >
                  <div v-for="c in con.cons">
                    <FormKit
                      v-model="c.claim"
                      :label="`Con (${
                        users.find((e) => e.id === c.user)?.name
                      })`"
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
                      con.pros
                        ? con.pros?.push({ user: currentUser.id, claim: '' })
                        : (con.pros = [{ user: currentUser.id, claim: '' }])
                    "
                    >Add Pro</Button
                  >
                  <FormKit
                    v-for="p in con.pros"
                    v-model="p.claim"
                    :label="`Pro (${
                      users.find((e) => e.id === p.user)?.name
                    })`"
                    placeholder="All for it!"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <Button
              prefix-icon="plus"
              class="text-white !bg-green-500 hover:!bg-green-600"
              @click="debate.pros?.push({ user: currentUser.id, claim: '' })"
              >Add Pro</Button
            >
            <FormKit
              v-for="pro in debate.pros"
              v-model="pro.claim"
              :label="`Pro (${users.find((e) => e.id === pro.user)?.name})`"
              placeholder="All for it!"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 mt-48">
      <span>Current User</span>
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="user in users"
          @click="currentUser = user"
          :secondary="user.id !== currentUser.id"
          :primary="user.id === currentUser.id"
          class="h-8"
        >
          {{ user.name }}
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
const users = [
  {
    id: "1",
    name: "Olivier",
  },
  {
    id: "2",
    name: "Yasmina",
  },
  {
    id: "3",
    name: "Leon",
  },
];
const currentUser = ref(users[1]);
type Vote = {
  user: string;
  weight: 1 | 2 | 3 | 4 | 5;
};
type Argument = {
  claim: string;
  user: string;
  votes?: Vote[];
  pros?: Argument[];
  cons?: Argument[];
};
type Debate = {
  claim: string;
  pros?: Argument[];
  cons?: Argument[];
};
const debate = ref<Debate>({
  claim: "",
  pros: [],
  cons: [],
});
</script>
