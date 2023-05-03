<template>
  <div class="relative sm:rounded-lg w-full">
    <!-- <div class="flex items-center justify-between pb-4">
      <label for="table-search" class="sr-only">Search</label>
      <div class="relative">
        <FormKit
          v-model="search"
          label="Search"
          prefix-icon="search"
          :floatingLabel="true"
          :required="true"
        />
      </div>
    </div> -->
    <div class="overflow-x-auto rounded-md">
      <table
        class="w-full text-sm text-left text-neutral-500 dark:text-neutral-400"
      >
        <thead
          class="text-xs text-neutral-700 uppercase bg-neutral-100 border-b-2 border-neutral-200 dark:bg-neutral-700 dark:text-neutral-400"
        >
          <tr>
            <th scope="col" class="px-4 h-14">
              <div class="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 dark:focus:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                />
                <label for="checkbox-all-search" class="sr-only"
                  >checkbox</label
                >
              </div>
            </th>
            <th
              scope="col"
              class="px-5 h-14"
              v-for="cell in Object.keys(data[0])"
            >
              {{ cell }}
            </th>
            <th class="px-5 h-14">
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="bg-white even:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 h-14"
            v-for="row in data"
          >
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 dark:focus:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                />
                <label for="checkbox-table-search-1" class="sr-only"
                  >checkbox</label
                >
              </div>
            </td>

            <th
              scope="col"
              class="px-6 py-3"
              :class="{
                'font-bold text-neutral-900 whitespace-nowrap dark:text-white':
                  i === 0,
                'font-medium':
                  i !== 0,
              }"
              v-for="(cell, i) in Object.values(row)"
            >
              {{ cell }}
            </th>
            <td class="px-6 py-4">
              <a
                href="#"
                class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >Edit</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  data: any;
}>();
const search = ref("");
</script>
