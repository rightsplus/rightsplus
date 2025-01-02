<template>
  <DataTable
    :value="data"
    removableSort
    :pt="{}"
    paginator
    :rows="10"
    v-model:selection="selectedRow"
    selectionMode="multiple"
    @rowSelect="rowSelect"
    @rowUnselect="rowUnselect"
    sortField="createdAt"
    :sortOrder="-1"
  >
    <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
    <Column field="id" header="#" />
    <Column field="bookingNumber" header="Buchung" sortable />
    <!-- <Column field="flight.airportDeparture" header="Ab" sortable />
    <Column field="flight.airportArrival" header="An" sortable /> -->
    <Column header="Flug" field="flight" sortable sortField="flight.number">
      <template #body="{ data }: { data: RowClaimExtended }">
        <div class="flex items-center gap-2">
          <!-- <CellsAirlineLogo :airline="data.booking.flight.airline" /> -->
          <span>{{ data.booking.flight.iata }}</span>
        </div>
      </template>
    </Column>
    <Column header="Status" field="status" sortable sortField="status">
      <template #body="{ data }: { data: RowClaimExtended }">
        <span
          class="text-xs font-medium p-1 rounded"
          :class="
            getStatus(
              data.booking.flight.status,
              data.booking.flight.delayArrival
            ).class
          "
          >{{
            getStatus(
              data.booking.flight.status,
              data.booking.flight.delayArrival
            ).text
          }}</span
        >
      </template>
    </Column>
    <Column header="Verspätung" field="delay" sortable sortField="delay">
      <template #body="{ data }: { data: RowClaimExtended }">
        <span
          class="text-xs font-medium"
          :class="
            getStatus(
              data.booking.flight.status,
              data.booking.flight.delayArrival
            ).value === 'delayed'
              ? 'text-red-500'
              : ''
          "
          >{{ getDuration(data.booking.flight.delayArrival) }}</span
        >
      </template>
    </Column>
    <Column
      header="Erstellt"
      field="created_at"
      sortable
      sortField="created_at"
    >
      <template #body="{ data }: { data: RowClaimExtended }">
        {{
          formatRelative(new Date(data.createdAt), new Date(), {
            locale: de,
          })
        }}
      </template>
    </Column>
    <Column header="Aktion">
      <template #body="{ data }">
        <div class="flex gap-2 font-medium">
          <button
            @click="sendEmail(data)"
            class="text-neutral-600 bg-neutral-100 hover:bg-green-500 hover:text-white p-2 rounded"
          >
            {{ data.client_email }}
          </button>
          <!-- <button
          @click="initiatePayout(data.client_email)"
          class="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
        >
          Payout
        </button> -->
        </div>
      </template>
    </Column>
  </DataTable>
  <!-- <Popup
    :open="!!selectedRow && clickedRow"
    @closeOutside="clickedRow = false"
    @close="clickedRow = false"
    class="p-12"
    :title="`${selectedRow?.[0]?.flightairportDeparture} → ${selectedRow?.[0]?.airport_arrival}`"
    ><template #pretitle>
      <span
        class="text-xs font-medium p-1 rounded"
        :class="
          getStatus(selectedRow?.[0]?.status, selectedRow?.[0]?.delay).class
        "
        >{{
          getStatus(selectedRow?.[0]?.status, selectedRow?.[0]?.delay).text
        }}</span
      > </template
    ><span class="text-base mb-5 flex gap-1"
      ><span class="text-gray-500">Name</span
      ><span class="font-bold">{{ selectedRow?.[0].client_name }}</span></span
    >
    <div class="flex items-center gap-2">
      <img
        :alt="selectedRow?.[0]?.flight.airline"
        :src="selectedRow?.[0]?.flight.logo"
        class="rounded-full w-10 h-10 border border-neutral-200"
      />
      <span>{{ selectedRow?.[0]?.flight.number }}</span>
    </div>

    <span v-if="selectedRow?.[0].item.flights.codeshared"
      >Durchgeführt von
      {{
        JSON.parse(selectedRow?.[0].item.flights.codeshared || "").airline?.name
      }}</span
    >
  </Popup> -->
</template>

<script setup lang="ts">
import type { RowClaimExtended } from "~/types";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { de } from "date-fns/locale";

const props = defineProps<{
  data: RowClaimExtended[];
}>();
const { t, locale } = useI18n();

const getStatus = (status: string, delay: number) => {
  const classes = {
    cancelled: "bg-red-100 text-red-600",
    delayed: "bg-yellow-100 text-yellow-700",
    landed: "bg-green-100 text-green-600",
  };

  const newStatus =
    status === "cancelled" || delay < 180
      ? status in classes
        ? status
        : "landed"
      : "delayed";

  return {
    class: classes[newStatus as keyof typeof classes],
    text: t(newStatus),
    value: newStatus,
  };
};
const selectedRow = ref<RowClaimExtended[]>();
const clickedRow = ref(false);
const rowSelect = (e) => {
  if (e.type === "row") clickedRow.value = true;
};
const rowUnselect = (e) => {
  clickedRow.value = false;
};

async function initiatePayout(email: string) {
  console.log("initialing payout for", email);
  try {
    const response = await fetch("/api/payouts", {
      method: "POST",
      headers: useRequestHeaders(["cookie"]),
      body: JSON.stringify({
        amount: 10,
        currency: "usd",
        email,
      }),
    });

    if (response.ok) {
      console.log(response); // Handle the response from the server
      // const data = await response.json();
      // console.log(data); // Handle the response from the server
    } else {
      throw new Error("Payout request failed");
    }
  } catch (error) {
    console.error(error); // Handle the error
  }
}

const { send } = useSendMail();
const { getCities } = useGetCities();
const sendEmail = async (to: any) => {
  const [passenger] = to.item.client.passengers;
  const [departure, arrival] = await getCities([
    to.item.flights.airport_departure,
    to.item.flights.airport_arrival,
  ]);
  const data = {
    name: [passenger?.firstName, passenger?.lastName].join(" "),
    firstName: passenger?.firstName,
    address: passenger?.address.street,
    postalCode: passenger?.address.postalCode,
    city: passenger?.address.city,
    flightNumber: to.item.flight_number,
    flightDate: to.item.flights.scheduled_arrival,
    departure: `${departure} (${to.item.flights.airport_departure})`,
    arrival: `${arrival} (${to.item.flights.airport_arrival})`,
    date: new Date().toISOString(),
    claimId: formatClaimId(to.item.id, false),
    bookingNumber: to.item.booking_number,
    status: "paymentProcessed",
    // ...emails.paymentProcessed.handler(claim)
    // ...statusEmail("paymentProcessed", {
    //   name: passenger?.firstName,
    //   reimbursment: 300,
    // }),
  };

  try {
    send({
      to: to.client_email,
      subject: "Deine Anfrage wurde erfolgreich eingereicht",
      template: "Status.vue",
      // template: "AssignmentLetter.vue",
      pdf: {
        template: "assignmentLetter",
        fileName: [t("assignmentLetter"), passenger?.lastName || "test"].join(
          "-"
        ),
      },
      data,
    }).then((e) => e.json().then(console.log));
  } catch (error) {
    console.error(error);
  }
};
</script>
<style>
th {
  font-size: 0.875rem;
}
td {
  line-height: 1;
  font-size: 0.875rem;
}
</style>
