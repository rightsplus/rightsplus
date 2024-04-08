<template>
  <section class="py-24 bg-grey-200 relative">
    <div
      class="grid gap-12 max-w-7xl mx-auto px-5 sm:px-12 h-full relative z-1"
    >
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div v-for="(section, i) in sections" class="flex flex-col gap-4">
          <span
            class="text-xl sm:text-2xl text-primary-600 font-bold uppercase tracking-wide"
          >
            {{ String(i + 1).padStart(2, "0") }}
          </span>
          <h2 class="text-3xl sm:text-5xl font-bold">
            {{ section.title }}
          </h2>
          <p class="text-lg text-gray-600 font-medium">
            {{ section.description }}
          </p>
        </div>
        <Button
          class="text-white !bg-gray-800 hover:!bg-gray-900 mr-auto"
          to="claim-new"
          >{{ $t('checkCompensationNow')}}</Button
        >
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
const sections = [
  {
    title: "Fachliche Expertise",
    description: `Sie profitieren von unserer fachlichen Expertise und Erfahrung auf diesem Gebiet. Wir bieten Ihnen einen kompetenten Service an und legen dabei großen Wert auf effiziente und transparente Arbeit.
Unsere Erfolgsquote liegt bei 98 % bei den von uns geltend gemachten Ansprüchen. Zur effektiven und erfolgreichen Durchsetzung der Ansprüche arbeiten wir eng mit einer auf das Reiserecht spezialisierten Rechtsanwaltskanzlei zusammen.`
  },
  {
    color: "text-green-600",
    title: "Gesamte Abwicklung",
    description: `Wir übernehmen die gesamte Abwicklung in Eigenverantwortung. Sie müssen hierfür lediglich den jeweiligen Anspruch an uns übertragen. Selbstverständlich halten wir Sie über den aktuellen Status stets auf dem Laufenden.
Durch unsere Beauftragung ersparen Sie sich nicht nur frustrierende und zeitintensive Schriftwechsel mit den Fluggesellschaften, die häufig nicht zum gewünschten Erfolg führen, sondern auch gegebenenfalls anfallende Rechtsanwalts- bzw. Prozesskosten und das damit einhergehende Prozessrisiko.`
  },
  {
    color: "text-green-600",
    title: "Kein Kosten- & Prozessrisiko",
    description: `Du trägst keinerlei Kosten- bzw. Prozessrisiko. Es bestehen keine versteckten Kosten oder Risiken.
Lediglich im Falle der erfolgreichen Durchsetzung des Anspruchs erhalten wir eine anteilige Vergütung in Höhe von 25% (inkl. MwSt.). Insoweit verweisen wir auf unser Preis- und Leistungsverzeichnis.`
  }
];
</script>
