<script setup lang="ts">
import type { CaseStatus, RowClaimExtended } from "~/types";
import claimProcessing from "~/machines/claimProcessing";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  claim: RowClaimExtended;
  machine: ReturnType<typeof useMachine<CaseStatus, RowClaimExtended>>;
}>();

const emit = defineEmits(["update"]);
const { emails } = useStatusEmail()
const { state, send, invoke } = props.machine;
const actions = computed(() => {
  return state.value.events.sort((e) => (e.includes("accept") ? 1 : -1));
});
const { t } = useI18n();

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
const rejectClaim = () => {
  if (!props.claim) return;
  console.log("rejectClaim", props.claim?.client.email);
  // sendMail({
  //   to: props.claim?.client.email,
  //   subject: `Claim ${props.claim?.id}`,
  //   text: `Dear ${props.claim?.booking?.flight.airline.name},\n\nWe have a claim for you.\n\nBest regards,\n\nYour team`,
  // });
};
// const sendEmailToAirline = () => {
//   if (!props.claim) return;
//   sendMail({
//     to: props.claim?.booking?.flight.airline.email,
//     subject: `Claim ${props.claim?.id}`,
//     text: `Dear ${props.claim?.booking?.flight.airline.name},\n\nWe have a claim for you.\n\nBest regards,\n\nYour team`,
//   });
// };

const protocol = {
  acceptClaim: [
    {
      label: "sendConfirmationToClient",
      handler: [acceptClaimClient, acceptClaimAirline],
    },
  ],
  rejectClaim: [
    {
      label: "sendConfirmationToClient",
      handler: [rejectClaim],
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
  // console.log(origin, target, event);
  if (origin === "dataReceived" && event === "accept") {
    invokeProtocol("acceptClaim");
  }
});
const labels: Partial<Record<CaseStatus, Record<string, string>>> = {
  dataReceived: {
    accept: 'acceptCase',
    reject: 'rejectCase',
  },
  awaitInitialAirlineResponse: {
    accept: 'airlineAccepts',
    reject: 'airlineRejects',
  },
  awaitLawyerResponse: {
    accept: 'airlineAccepts',
    reject: 'airlineRejects',
  },
};

const handleClick = (action: string) => {
  const target = send(action)
  if (!target) return
  console.log(target)
  emails[target]?.forEach(e => e.handler(props.claim));
}
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
</template>
