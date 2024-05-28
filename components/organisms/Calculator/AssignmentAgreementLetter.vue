<template>
  <div class="flex flex-col gap-[1em] leading-tight">
    <i18n-t
      keypath="assignmentLetter.main"
      tag="p"
      class="whitespace-pre-line"
    >
      <template v-slot:addressBlock
        ><span class="block m-[1em] font-bold">
          {{ [name, address, [postalCode, city].join(" ")].join("\n") }}
        </span></template
      >
      <template v-slot:flight
        ><span class="block m-[1em] mb-0">
          <strong>{{ flightNumber }}</strong> {{ t("on") }}
          <strong>{{
            new Date(flightDate as string).toLocaleDateString()
          }}</strong>
        </span></template
      >
      <template v-slot:airports
        ><span class="block m-[1em] mt-0">
          {{ t("from") }}
          <strong>{{ departure }}</strong> {{ t("to") }}
          <strong>{{ arrival }}</strong>
        </span></template
      >
      <template v-slot:rightsPlus><strong>RightsPlus GbR</strong></template>
    </i18n-t>
    <p>{{ t("assignmentLetter.compensation") }}</p>
    <p>{{ t("assignmentLetter.claimant") }}</p>
    <!-- <p>
      {{
        t("assignmentLetter.declaration", {
          rightsPlus: "RightsPlus GbR",
          partner: "Joachim Bawa",
        })
      }}
    </p> -->
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
defineProps<{
	name: string;
	address: string;
	postalCode: string;
	city: string;
	flightNumber: string;
	flightDate: string;
	departure: string;
	arrival: string;
}>();
</script>
