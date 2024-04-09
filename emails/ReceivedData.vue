<template>
  <EmailFrame>
    <EmailCard>
      <EmailPreTitle>{{ preTitle }}</EmailPreTitle>
      <EmailTitle is="h1">{{ title }}</EmailTitle>
      <EText class="leading-snug my-3">Hej {{ firstName }},</EText>
      <EText
        v-for="paragraph in paragraphs"
        :key="paragraph"
        class="leading-snug my-3"
        >{{ paragraph }}</EText
      >
      <EText>Danke für dein Vertrauen in RightsPlus.</EText>
      <EText
        >Mit den folgenden Daten kannst du immer den Stand der Bearbeitung
        einsehen:</EText
      >
      <ESection>
        <EColumn>
          <EText class="leading-none my-0"
            ><span class="text-gray-400">Fallnummer</span><br /><span
              class="text-base font-bold"
              >#2890123</span
            ></EText
          >
        </EColumn>
        <EColumn>
          <EText class="leading-none my-0"
            ><span class="text-gray-400">Buchungsnummer</span><br /><span
              class="text-base font-bold"
              >BD1238</span
            ></EText
          >
        </EColumn>
      </ESection>
      <EmailButton class="mt-10" href="https://vuejs.org">Stand der Bearbeitung</EmailButton>
      <EHr class="my-8" />
      <EmailTitle is="h3" class="leading-snug my-3"
        >Wie gehts weiter?</EmailTitle
      >
      <EmailList
        :items="[
          {
            title:
              'Wir prüfen deine Anfrage',
            body:
              '... und melden uns bei dir, falls wir noch Informationen benötigen.',
          },
          {
            title:
              'Wir kontaktieren die Fluggesellschaft',
            body:
              'Sobald wir die Prüfung beendet haben, erhältst Du von uns eine weitere E-Mail, in der wir Dir mitteilen, ob wir ein Vorgehen gegen die Fluggesellschaft als sinnvoll erachten.',
          },
        ]"
      />

      <EText class="leading-snug my-3 mt-8"
        >Für Rückfragen stehen wir Dir gerne zur Verfügung.</EText><EText class="leading-snug my-3"
        >Dein <b>RightsPlus</b> Team</EText
      >
    </EmailCard>
  </EmailFrame>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{
  firstName?: string;
  paragraphs: string[];
  title: string;
  preTitle: string;
}>();

</script>
