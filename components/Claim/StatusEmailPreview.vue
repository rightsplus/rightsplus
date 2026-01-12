<script setup lang="ts">
import { FormKit } from "@formkit/vue";
import Button from "@/components/core/Button.vue";

const { sendStatusEmail } = useStatusEmail();
const props = defineProps<{
  title: string;
  emailData: Awaited<ReturnType<typeof sendStatusEmail>>;
  index: number;
  total: number;
}>();

const emailContent = ref(
  props.emailData.markdown?.content.replaceAll("<br />", "\n") || ""
);
const recipientEmail = ref(props.emailData.recipientEmail || "");
const attachments = ref<Record<string, Blob>>(
  props.emailData?.attachments || {}
);

const addAttachment = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    for (let i = 0; i < target.files.length; i++) {
      attachments.value[target.files[i].name] = target.files[i];
    }
  }
};

const removeAttachment = (name: string) => {
  delete attachments.value[name];
};

const sendEmail = () => {
  props.emailData
    .sendMail?.({
      content: emailContent.value.replaceAll("\n", "<br />"),
      attachments: attachments.value,
    })
    .then(() => {
      success.value = true;
    })
    .catch(() => {
      success.value = false;
    });
  // Logic to send the email using props.emailData and emailContent.value
  console.log("Sending email with content:", emailContent.value);
  console.log("Attachments:", attachments.value);
};

const emit = defineEmits<{
  (e: "success"): void;
  (e: "error"): void;
}>();

onMounted(() => {
  emit(
    "success",
    new Promise((resolve, reject) => {
      props.emailData
        .sendMail?.({
          content: emailContent.value.replaceAll("\n", "<br />"),
          attachments: attachments.value,
        })
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(false);
        });
    })
  );
});
</script>

<template>
  <div
    class="grid grid-rows-[auto_auto] gap-5"
    :class="{ 'opacity-50 pointer-events-none cursor-not-allowed': success }"
  >
    <div class="grid grid-cols-[1fr_auto] gap-5">
      <div class="flex flex-col gap-3">
        <div class="flex flex-col">
          <span class="text-sm text-neutral-500">
            Email {{ index + 1 }} von {{ total }}
          </span>
          <h2 class="text-lg font-bold">An {{ emailData.recipientEmail }}</h2>
        </div>
        <FormKit
          type="email"
          v-model="recipientEmail"
          label="Email"
          class="w-full"
        />
        <FormKit
          type="textarea"
          v-model="emailContent"
          label="Nachricht"
          placeholder="Write your email here..."
          class="w-full max-h-[200px] grow"
        />
      </div>
      <div class="mb-4">
        <h3 class="text-lg font-bold">Anhänge</h3>
        <div
          v-for="[key, attachment] in Object.entries(attachments)"
          :key="key"
          class="attachment-preview flex items-center justify-between mb-2"
        >
          <span class="text-gray-700">{{ key }}</span>
          <Button
            @click="removeAttachment(key)"
            class="text-red-500 hover:underline"
          >
            Remove
          </Button>
        </div>
        <input type="file" @change="addAttachment" class="border rounded p-2" />
      </div>
    </div>
    <Button @click="sendEmail" primary> Send </Button>
  </div>
</template>
