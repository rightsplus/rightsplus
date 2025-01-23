<script setup lang="ts">
import type {
  CaseStatus,
  ClaimsForm,
  Database,
  RowClaimExtended,
} from "~/types";
import claimProcessing from "~/machines/claimProcessing";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  claim: RowClaimExtended;
  machine: ReturnType<typeof useMachine<CaseStatus, RowClaimExtended>>;
}>();

const emit = defineEmits(["update"]);
const { emails, sendStatusEmail, getParsedMarkdown } = useStatusEmail();
const { state, send, invoke } = props.machine;
const actions = computed(() => {
  return state.value.events.sort((e) => (e.includes("accept") ? 1 : -1));
});
const i18n = useI18n();
const { t } = i18n;

const acceptClaimClient = async () => {
  if (!props.claim) return;
  console.log("send acceptance email to client", props.claim?.client.email);
  if (!props.claim?.client.email) throw new Error("email address");

  // sendMail({
  //   to: props.claim?.client.email,
  //   subject: `Claim ${props.claim?.id}`,
  //   text: `Dear ${props.claim?.booking?.flight.airline.name},\n\nWe have a claim for you.\n\nBest regards,\n\nYour team`,
  // });
};
const acceptClaimAirline = async () => {
  if (!props.claim) return;
  console.log(
    "send claim email to airline",
    props.claim.booking.flight.airline.email
  );
  console.log(props.claim.booking.flight.airline.email);
  if (!props.claim.booking.flight.airline.email) {
    const newEmail = prompt("Please enter the email address");
    if (newEmail) {
      emit("update", {
        id: props.claim.id,
        booking: { flight: { airline: { email: newEmail } } },
      });
    } else {
      throw new Error("email address");
    }
  }

  // sendMail({
  //   to: props.claim?.client.email,
  //   subject: `Claim ${props.claim?.id}`,
  //   text: `Dear ${props.claim?.booking?.flight.airline.name},\n\nWe have a claim for you.\n\nBest regards,\n\nYour team`,
  // });
};

import letterHead from "~/plugins/pdfmake/pdf/documents/letterHead";
import useCreatePdf from "~/plugins/pdfmake/useCreatePdf";
import assignmentAgreement from "~/pdf/templates/assignmentAgreement";
import Popup from "../core/Popup.vue";
import StatusEmailPreview from "./StatusEmailPreview.vue";
const { generatePDF } = useCreatePdf();
const { handleUploadFile } = useSupabaseFunctions();
const supabase = useSupabaseClient<Database>();

const { queryLocaleContent } = useI18nContent("pdf");
const generateAssignmentAgreement = async () => {
  const storageFolderClaim = [
    formatClaimId(props.claim.id, false),
    props.claim.client.lastName,
  ].join("/");

  const { data: signatureData } = await supabase.storage
    .from("client-files")
    .download([storageFolderClaim, "signature", "signature.svg"].join("/"));

  const signatureSvg = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) resolve(e.target.result as string);
      else reject();
    };
    if (signatureData) reader.readAsText(signatureData);
    else reject();
  });

  const claim = { ...props.claim };
  claim.client.signature = {
    svg: signatureSvg,
  };

  const markdown = await queryLocaleContent(
    `/${claim.lang || "de"}/assignment-agreement`
  ).first();

  const document = letterHead({
    claim,
    i18n,
    content: (props) => [
      assignmentAgreement({
        ...props,
        content: markdownBodyToPdfMake(markdown.body.value, claim),
      }),
    ],
    info: {
      title: i18n.t("assignmentAgreement"),
      // subtitle: i18n.t("compensationClaim.subtitle"),
      author: "Joachim Bawa",
    },
  });
  const pdf = await generatePDF(document);
  await handleUploadFile(
    new File([pdf], "assignmentAgreement.pdf", { type: "application/pdf" }),
    [storageFolderClaim, "assignment-agreement"].join("/")
  );
  return pdf;
};

const protocol = {
  acceptClaim: [
    {
      label: "sendConfirmationToClient",
      handler: [generateAssignmentAgreement],
    },
  ],
};

const invokeProtocol = async (item: keyof typeof protocol) => {
  try {
    await Promise.all(
      protocol[item].map(({ handler }) => handler.forEach((e) => e()))
    );
  } catch (error) {
    invoke("back");
    console.log(error);
  }
};

props.machine.subscribe(({ origin, target, action, event }) => {
  nextTick(() => {
    console.log(state.value.value, action);
    supabase
      .rpc("append_to_protocol", {
        claim_id: props.claim.id,
        new_data: {
          timestamp: new Date().toISOString(),
          type: "status",
          value: t(`status.${state.value.value}`),
        },
      })
      .then(console.log);
  });
  if (origin === "dataReceived" && event === "accept") {
    invokeProtocol("acceptClaim");
  }
});
const labels: Partial<Record<CaseStatus, Record<string, string>>> = {
  dataReceived: {
    accept: "acceptCase",
    reject: "rejectCase",
  },
  awaitInitialAirlineResponse: {
    accept: "airlineAccepts",
    reject: "airlineRejects",
  },
  awaitLawyerResponse: {
    accept: "airlineAccepts",
    reject: "airlineRejects",
  },
};

const emailPreview = ref<Awaited<ReturnType<typeof sendStatusEmail>>[]>([]);

const handleClick = async (action: string) => {
  const attachments: Record<string, Blob> = {};
  if (state.value.matches("dataReceived") && action === "accept") {
    const assignmentAgreement = await generateAssignmentAgreement();
    if (assignmentAgreement)
      attachments["assignment-agreement.pdf"] = assignmentAgreement;
  }
  const target = send(action);
  if (!target) return;
  if (!emails[target]) return;
  emailPreview.value = await Promise.all(
    emails[target].map((e) => e.handler(props.claim, attachments))
  );
  console.log(emailPreview.value);
};
const closePreview = () => {
  invoke("back");
  emailPreview.value = [];
};
</script>
<template>
  <div class="grid gap-2 w-full">
    <Button
      v-for="action in actions"
      :key="action"
      :primary="action.includes('accept')"
      :tertiary="!action.includes('accept')"
      :success="action.includes('accept')"
      :alert="action.includes('reject')"
      class="w-full !h-12 !px-3"
      @click="() => handleClick(action)"
    >
      {{ t(`action.${labels[state.value]?.[action] || action}`) }}
    </Button>
  </div>
  <Popup
    :open="!!emailPreview.length"
    @closeOutside="closePreview"
    @close="closePreview"
    class="p-5 sm:p-8 @container w-[1200px]"
    :title="t('Emails überprüfen')"
    titleClass="!text-xl"
  >
    <StatusEmailPreview
      v-for="email in emailPreview"
      :key="email.id"
      :title="email.status"
      :emailData="email"
    />
  </Popup>
</template>
