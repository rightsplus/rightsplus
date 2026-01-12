<template>
  <FormKit
    :label="$t('bookingNumber')"
    v-model="modelValue.client.bookingNumber"
    outer-class="col-span-2 mb-12"
    :placeholder="t('forExample', { value: dummyBookingNumber })"
    maxlength="20"
    prefix-icon="ticket-airline"
    v-maska:[allCaps]
    suffix-icon="info-circle"
    @suffix-icon-click="isOpen = true"
  />
  <Popup
    :open="isOpen"
    @closeOutside="isOpen = false"
    @close="isOpen = false"
    class="p-5 sm:p-8 @container"
    :title="t('bookingNumber.info.title')"
    titleClass="!text-xl"
  >
    <div class="grid grid-cols-1 gap-4">
      <i18n-t keypath="bookingNumber.info.description" tag="p">
        <template v-slot:bookingNumber
          ><strong>{{ dummyBookingNumber }}</strong></template
        >
      </i18n-t>
      <i18n-t
        keypath="bookingNumber.info.note"
        tag="p"
        class="text-sm text-gray-500"
      />
    </div>
  </Popup>
</template>

<script setup lang="ts">
import type { ClaimsForm } from "@/types";
import { vMaska } from "maska";
defineProps<{
  modelValue: ClaimsForm;
}>();
const { allCaps } = useMask();
const isOpen = ref(false);
const { t } = useI18n();
const dummyBookingNumber = ref("OZCS3U");
</script>
