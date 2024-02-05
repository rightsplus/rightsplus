<template>
  <ETailwind>
    <EHtml>
      <EHead />
      <EPreview>
        A fine-grained personal access token has been added to your account
      </EPreview>
      <EBody class="bg-white text-neytral-500">
        <EContainer :style="container">
          <EImg
            width="32"
            height="32"
            src="/rights-plus-logo.png"
            alt="RightsPlus"
          />
          <EText class="text-3xl font-bold">
            Wir übernehmen ab hier das Steuer
          </EText>
          <ESection class="p-5 border border-neutral-200 rounded">
            <EText>
              Hey <strong>{{name}}</strong>,
            </EText>
            <EText>
              Um deinen Auftrag weiterzubearbeiten und alles glatt über die Bühne zu bringen, benötigen wir von dir eine Abtretungserklärung.
            </EText>
            <EText>
              Eine Abtretungserklärung ist einfach eine schriftliche Bestätigung, dass du bestimmte Rechte oder Ansprüche an uns abtrittst. Nur so können wir in deinem Namen deine Rechte einfordern.
            </EText>
            <EText>
              Bitte füll das beigefügte Formular aus und schicke es wieder so an uns zurück.
            </EText>
            <EText>
              Falls du Fragen hast oder Hilfe benötigst, stehen wir dir natürlich zur Seite. Schreib uns einfach eine kurze Nachricht.
            </EText>
            <EText>
  Wir danken dir schon mal im Voraus für deine Unterstützung!
            </EText>
            <EText>
  
Mit besten Grüßen,
            </EText>
            <EText>
  

 
              Dein RightsPlus Team
            </EText>

 



 



          <EText :style="links">
            <ELink href="#" :style="link"> Your security audit log </ELink>
            ・
            <ELink href="#" :style="link"> Contact support </ELink>
          </EText>

          <EText :style="footer">
            GitHub, Inc. ・88 Colin P Kelly Jr Street ・San Francisco, CA 94107
          </EText>
        </EContainer>
      </EBody>
    </EHtml>
  </ETailwind>
</template>
<script setup lang="ts">
import type { CSSProperties } from "vue";

defineProps({
  username: {
    type: String,
    default: "John Doe",
  },
});

const container = {
  width: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
} as CSSProperties;

const text = {
  margin: "0 0 10px 0",
  textAlign: "left",
} as CSSProperties;

const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  borderRadius: "0.5em",
  padding: "0.3em 0.6em",
  textTransform: "uppercase",
} as CSSProperties;

const links = {
  textAlign: "center",
} as CSSProperties;

const link = {
  color: "#0366d6",
  fontSize: "12px",
} as CSSProperties;

const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center",
  marginTop: "60px",
} as CSSProperties;
</script>
