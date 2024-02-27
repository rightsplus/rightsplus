<template>
  <ETailwind>
    <EHtml>
      <EHead>
        <EFont
          font-family="Inter"
          fallback-font-family="Verdana"
          :web-font="{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCo3FwrK3iLTcviYwYZ8UA3.woff2',
            format: 'woff2',
          }"
          font-weight="normal"
          font-style="normal"
        />
      </EHead>
      <EPreview>Wir benötigen deine Unterschrift</EPreview>
      <EBody class="text-gray-500 bg-neutral-100">
        <EContainer class="bg-white rounded-t-lg p-12 max-w-3xl text-lg">
          <EImg
            width="32"
            height="32"
            src="rights-plus-logo.png"
            alt="RightsPlus"
          />
          <EText class="text-3xl font-bold text-gray-800">
            Wir übernehmen ab hier das Steuer
          </EText>
          <EText class="text-xl leading-relaxed">Hey {{ firstName }},</EText>
          <EText class="text-xl leading-relaxed">
            Um deinen Auftrag weiterzubearbeiten und alles glatt über die Bühne
            zu bringen, benötigen wir von dir eine Abtretungserklärung.
          </EText>
          <EText class="text-xl leading-relaxed">
            Eine Abtretungserklärung ist einfach eine schriftliche Bestätigung,
            dass du bestimmte Rechte oder Ansprüche an uns abtrittst. Nur so
            können wir in deinem Namen deine Rechte einfordern.
          </EText>
          <EText class="text-xl leading-relaxed">
            Bitte füll das beigefügte Formular aus und schicke es wieder so an
            uns zurück.
          </EText>
          <EText class="text-xl leading-relaxed">
            Falls du Fragen hast oder Hilfe benötigst, stehen wir dir natürlich
            zur Seite. Schreib uns einfach eine kurze Nachricht.
          </EText>
          <EText class="text-xl leading-relaxed"
            >Wir danken dir schon mal im Voraus für deine Unterstützung!</EText
          >
          <EText class="text-xl leading-relaxed">Mit besten Grüßen,</EText>
          <EText class="text-xl leading-relaxed">Dein RightsPlus Team</EText>
        </EContainer>
        <EContainer
          class="bg-neutral-200 text-sm rounded-b-lg p-12 max-w-3xl flex flex-col items-center justify-center text-center"
        >
          <EText>
            <ELink href="#">Support kontaktieren</ELink>
          </EText>
          <EText>RightsPlus GbR ・ Zülpicher Platz 18 ・ 50674 Köln</EText>
        </EContainer>
      </EBody>
    </EHtml>
  </ETailwind>
</template>
<script setup lang="ts">
defineProps<{
  firstName?: string;
}>();
</script>
