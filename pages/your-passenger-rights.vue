<template>
  <NuxtLayout name="generic">
    <template #before>
      <div class="flex items-center gap-2">
        <img :src="`/locales/en-EU.svg`" class="relative z-10 w-7 shrink-0" />
        <span class="font-bold uppercase text-neutral-500">EU-Fluggastrechtverordnung EC261</span>
      </div>
    </template>
    <div class="flex flex-col gap-5">
      <p class="">
        Wenn du eine Flugverspätung ab drei Stunden am Zielort, eine
        Flugannullierung oder eine unfreiwillige Umbuchung erlebt hast, hast du
        oft einen Anspruch auf eine pauschale Ausgleichszahlung von 250€ bis
        600€ - unabhängig von dem Ticketpreis und der gebuchten Klasse.
      </p>
      <div class="flex flex-col gap-2 bg-neutral-100 rounded-3xl p-5 my-5">
        <span class="uppercase tracking-wider text-sm font-medium text-gray-500"
          >Beispiel</span
        >
        <p class="font-bold text-xl">
          Eine 4-köpfige Familie kann bis zu 2400€ fordern
        </p>
        <p>
          Auch wenn dein Arbeitgeber den Flug bezahlt hat, hast du persönlich
          einen Anspruch auf Entschädigung. Es gibt jedoch Ausnahmen, wenn etwas
          anderes mit dem Arbeitgeber vertraglich vereinbart wurde.
        </p>
        <div class="flex gap-5 items-center">
          <span class="flex gap-2 items-center">4 Personen</span>
          <span class="flex gap-2 items-center"
            ><span
              ><FontAwesomeIcon
                icon="money-bill-1-wave"
                class="text-primary-500" /></span
            >bis zu 2400€</span
          >
        </div>
      </div>
      <p>
        Du hast auch das Recht auf Verpflegung, kostenlose Telefonate und
        E-Mails, und in besonderen Fällen, ein Hotel und Flughafentransfer. Du
        kannst deinen Anspruch auch für die letzten 3 Jahre geltend machen.
      </p>
      <p>
        Die Fluggastrechte-VO gilt für alle in der EU startenden und landenden
        Flüge und auch für Flüge in Norwegen, Island, Liechtenstein und der
        Schweiz, sofern die Fluggesellschaft ihren Sitz in der EU hat.
      </p>
      <img
        width="800"
        quality="70"
        format="webp"
        loading="lazy"
        src="/images/billow926-jah2Y1d-6Cc-unsplash.jpg"
        class="object-cover w-full h-96 rounded-2xl my-12"
      />
      <h2 class="text-2xl font-bold">
        Die Höhe der Ausgleichsleistung ist abhängig von der Flugstrecke zum
        letzten Zielort und beträgt:
      </h2>
      <div class="grid gap-5 md:grid-cols-2">
        <CellsIconCard
          v-for="{ icon, title, value } in [
            {
              icon: 'signs-post',
              title: 'Flugstrecke bis 1500 km',
              value: '250€',
            },
            {
              icon: 'signs-post',
              title: 'Über 1500 km innerhalb der EU',
              value: '400€',
            },
            {
              icon: 'signs-post',
              title: 'Andere Flüge zwischen 1500 und 3500 km',
              value: '400€',
            },
            {
              icon: 'signs-post',
              title: 'Über 3500 km und EU-grenzüberschreitend',
              value: '600€',
            },
          ]"
          :icon="icon"
          :title="title"
          :value="value"
          :key="title"
        />
      </div>
      <p>
        Die Höhe der Entschädigung hängt nicht vom Preis des Flugtickets und der
        gebuchten Klasse ab. Du hast einen Anspruch auf Entschädigung, sofern
        bestimmte Voraussetzungen erfüllt sind. Hierzu gehört, dass du eine
        bestätigte Buchung vorweisen kannst und pünktlich, also zu den
        vorgegebenen Flugzeiten, zur Abfertigung erschienen bist.
      </p>
      <p>
        In bestimmten Fällen kann dein Anspruch auf Entschädigung entfallen, zum
        Beispiel wenn die Fluggesellschaft belegen kann, dass die
        Flugannullierung oder Flugverspätung auf außergewöhnlichen Umständen wie
        z.B. Sperrungen des Flughafens, Vögel im Triebwerk oder heftigen
        Unwettern basiert und alle ihr zumutbaren Maßnahmen ergriffen hat, um
        die Annullierung oder Flugverspätung zu vermeiden. Dein Anspruch
        entfällt auch, wenn die Fluggesellschaft dich mindestens zwei Wochen vor
        der planmäßigen Abflugzeit über die Annullierung informiert hat oder bei
        kurzfristiger Information eine adäquate Ersatzbeförderung anbietet.
      </p>
      <p>
        Dein Entschädigungsanspruch kann rückwirkend für die letzten 3 Jahre
        geltend gemacht werden, gerechnet ab dem Ende des Jahres, in dem er
        entstanden ist. So verjähren Ansprüche aus dem Jahr 2022 und den
        Folgejahren erst am 31.12.2025.
      </p>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
  // layout: "generic",
  // category: "EU-Fluggastrechtverordnung EC261",
  title: "yourRights",
  lead: "Nach der Fluggastrechteverordnung hast Du unter verschiedenen Voraussetzungen ein Recht auf Entschädigung.",
});
</script>

<style scoped></style>
