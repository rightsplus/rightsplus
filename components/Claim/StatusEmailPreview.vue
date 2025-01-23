<!-- components/Claim/StatusEmailPreview.vue -->
<script setup lang="ts">
import { FormKit } from "@formkit/vue"; // Ensure FormKit is installed and imported

import Button, { type ButtonProps } from "@/components/core/Button.vue";

const { sendStatusEmail } = useStatusEmail();
const props = defineProps<{
  title: string;
  emailData: Awaited<ReturnType<typeof sendStatusEmail>>;
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
  props.emailData.sendMail?.({
    content: emailContent.value.replaceAll("\n", "<br />"),
    attachments: attachments.value,
  });
  // Logic to send the email using props.emailData and emailContent.value
  console.log("Sending email with content:", emailContent.value);
  console.log("Attachments:", attachments.value);
};

const cancel = () => {
  // Logic to handle cancellation
  console.log("Email sending canceled");
};
</script>

<template>
  <div class="flex gap-5">
    <div class="flex flex-col">
      <h2 class="text-lg font-bold mb-4">An {{ emailData.recipientEmail }}</h2>
      <FormKit
        type="email"
        v-model="emailContent"
        label="Email"
        class="w-full mb-4"
      />
      <FormKit
        type="textarea"
        v-model="emailContent"
        label="Nachricht"
        placeholder="Write your email here..."
        class="w-full mb-4 min-h-96"
      />
    </div>
    <div class="mb-4">
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
      <Button @click="sendEmail" primary size="small"> Send </Button>
    </div>
  </div>
</template>
