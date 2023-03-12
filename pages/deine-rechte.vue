<template>
  <section class="min-h-screen pt-48 pb-8 bg-neutral-200">
    <div class="max-w-5xl mx-auto px-12 h-full relative z-1">
      <div class="flex flex-col gap-12 leading-0 h-full">
        <div class="flex flex-col gap-5">
          <h1 class="text-6xl font-extrabold">Deine Rechte</h1>
          <p class="text-3xl font-medium text-gray-500">
            Nach der Fluggastrechteverordnung hast Du unter verschiedenen
            Voraussetzungen ein Recht auf Entschädigung
          </p>
          <p class="">
            Wenn du eine Flugverspätung ab drei Stunden am Zielort, eine
            Flugannullierung oder eine unfreiwillige Umbuchung erlebt hast, hast
            du oft einen Anspruch auf eine pauschale Ausgleichszahlung von 250€
            bis 600€ - unabhängig von dem Ticketpreis und der gebuchten Klasse.
          </p>
          <div class="flex flex-col gap-2 bg-neutral-100 rounded-3xl p-5 my-5">
            <span
              class="uppercase tracking-wider text-sm font-medium text-gray-500"
              >Beispiel</span
            >
            <p class="font-bold text-xl">
              Eine 4-köpfige Familie kann bis zu 2400€ fordern
            </p>
            <p>
              Auch wenn dein Arbeitgeber den Flug bezahlt hat, hast du
              persönlich einen Anspruch auf Entschädigung. Es gibt jedoch
              Ausnahmen, wenn etwas anderes mit dem Arbeitgeber vertraglich
              vereinbart wurde.
            </p>
            <div class="flex gap-5 items-center">
              <span class="flex gap-2 items-center"
                ><ClientOnly
                  ><svg
                    width="15"
                    height="16"
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="svg-inline--fa text-green-500"
                  >
                    <path
                      d="M8.95501 7.40751C9.02287 7.33756 9.09072 7.26856 9.15743 7.19861C9.49022 6.84924 9.68616 6.43087 9.7725 5.95971C9.81081 5.75024 9.82396 5.53772 9.8192 5.32482C9.81844 5.29222 9.82892 5.2745 9.85732 5.25772C10.1587 5.07875 10.4861 5.0006 10.8341 5.00022C11.1563 5.00003 11.4786 5.00022 11.8007 5.00022C12.1098 5.00022 12.4078 5.05511 12.6828 5.20016C12.9315 5.33111 13.1522 5.50017 13.3386 5.71307C13.55 5.95418 13.6676 6.24046 13.7538 6.5439C14.1457 7.92385 14.54 9.30304 14.9311 10.6832C15.0037 10.9392 15.0035 11.1944 14.8774 11.4376C14.7091 11.7618 14.4434 11.9539 14.0793 11.9859C13.8556 12.0056 13.6293 11.9953 13.404 11.9983C13.3771 11.9987 13.3503 11.9983 13.316 11.9983V12.0605C13.316 12.8574 13.3194 13.6541 13.3146 14.451C13.3122 14.8678 13.1766 15.2404 12.8879 15.546C12.723 15.7204 12.5166 15.8366 12.2886 15.9121C12.1003 15.9745 11.9061 15.9996 11.7081 15.999C11.4429 15.9981 11.178 15.9989 10.9129 15.9989C10.6544 15.9989 10.4045 15.9565 10.1682 15.8485C10.0212 15.7814 9.89067 15.6893 9.77498 15.5765C9.76602 15.5677 9.7603 15.5485 9.76297 15.5361C9.81596 15.2795 9.8211 15.0199 9.82034 14.7594C9.81882 14.2768 9.82034 13.7944 9.81901 13.3118C9.81901 13.2689 9.82968 13.2384 9.86189 13.2085C10.1215 12.9658 10.3373 12.6891 10.4966 12.3708C10.6279 12.1083 10.7225 11.8317 10.7632 11.5411C10.793 11.3295 10.8101 11.1155 10.8176 10.902C10.8254 10.6818 10.8231 10.4604 10.8099 10.2404C10.7918 9.93545 10.7314 9.63697 10.6293 9.34821C10.5389 9.09281 10.4148 8.85417 10.2688 8.62621C10.0757 8.32468 9.84684 8.05517 9.57237 7.82455C9.39683 7.67702 9.2087 7.54856 9.00705 7.43953C8.99047 7.43058 8.97407 7.42124 8.95768 7.41152C8.9552 7.41018 8.95406 7.40656 8.95482 7.4077L8.95501 7.40751Z"
                      fill="currentColor"
                    />
                    <path
                      d="M4.84333 5.15709C4.77834 5.58271 4.8378 5.99307 4.97809 6.39124C5.11932 6.79188 5.36424 7.12429 5.68865 7.40276C5.67855 7.40981 5.67188 7.41553 5.66425 7.41953C5.07644 7.72811 4.62738 8.17945 4.28964 8.74764C4.0409 9.16601 3.88632 9.61449 3.83906 10.099C3.80113 10.4869 3.80132 10.8759 3.83315 11.2638C3.86993 11.7119 3.99497 12.1356 4.22255 12.5259C4.37236 12.7828 4.5601 13.0095 4.77681 13.2123C4.80464 13.2384 4.8157 13.2647 4.8155 13.303C4.81436 13.811 4.8155 14.3189 4.81436 14.8269C4.81379 15.0638 4.82446 15.2992 4.87078 15.5323C4.87364 15.5464 4.86887 15.5675 4.85934 15.5774C4.6411 15.8069 4.3735 15.9468 4.05977 15.9773C3.83467 15.9992 3.60671 15.9943 3.38009 15.9981C3.21503 16.001 3.04997 16 2.88491 15.9983C2.52086 15.9947 2.18769 15.8942 1.8934 15.6756C1.70147 15.533 1.5669 15.3447 1.46779 15.1299C1.35972 14.8955 1.31817 14.6471 1.31836 14.39C1.31893 13.2361 1.31836 12.082 1.31969 10.9281C1.31969 10.8862 1.30635 10.8679 1.26823 10.8532C0.955835 10.7331 0.687278 10.549 0.471136 10.2925C0.222211 9.99683 0.0619159 9.66081 0.0136939 9.27446C-0.00994064 9.08576 0.00244843 8.89764 0.0175059 8.70933C0.038472 8.44687 0.0573415 8.18403 0.0807854 7.92176C0.106898 7.62805 0.125386 7.333 0.168462 7.04176C0.226595 6.64893 0.390703 6.29632 0.626667 5.97725C0.820127 5.71536 1.06181 5.50875 1.34523 5.34979C1.71119 5.14451 2.10287 5.01948 2.52219 5.01109C3.07417 5.00023 3.62654 5.00328 4.17871 5.01109C4.40609 5.01433 4.62681 5.07266 4.84409 5.15728L4.84333 5.15709Z"
                      fill="currentColor"
                    />
                    <path
                      d="M5.81999 13.9331C5.81999 13.5443 5.81942 13.1553 5.82095 12.7665C5.82095 12.7299 5.80932 12.7097 5.7792 12.691C5.53867 12.5421 5.33491 12.354 5.17405 12.1205C5.0309 11.9128 4.93294 11.684 4.88357 11.4378C4.85136 11.2769 4.82906 11.112 4.82296 10.9481C4.81495 10.7375 4.82105 10.5259 4.83306 10.3153C4.85117 9.99874 4.93389 9.69683 5.06598 9.40845C5.18205 9.15495 5.33777 8.92737 5.53142 8.7282C5.68581 8.56943 5.86478 8.43925 6.05882 8.33213C6.31765 8.18937 6.59364 8.09292 6.88545 8.0428C7.43667 7.94807 7.9614 8.03365 8.46363 8.27457C8.69921 8.38759 8.91192 8.53512 9.0949 8.71943C9.32038 8.94663 9.49154 9.2127 9.61352 9.51042C9.7498 9.84226 9.81308 10.188 9.81442 10.545C9.81518 10.7432 9.81918 10.9426 9.8005 11.1393C9.75343 11.637 9.57274 12.0776 9.19897 12.423C9.09814 12.5162 8.98588 12.5978 8.87361 12.6774C8.82958 12.7087 8.81357 12.7381 8.81376 12.7918C8.81567 13.514 8.8151 14.2362 8.8151 14.9584C8.8151 15.0922 8.80499 15.2241 8.75925 15.3518C8.6346 15.7008 8.38739 15.9066 8.02715 15.9777C7.94996 15.993 7.86953 15.9971 7.79062 15.9977C7.47479 15.9998 7.15896 15.9987 6.84314 15.9987C6.66969 15.9987 6.50196 15.9714 6.34529 15.8929C6.16517 15.8029 6.02832 15.6686 5.93454 15.4901C5.84915 15.3276 5.81885 15.1532 5.81961 14.971C5.82114 14.625 5.81999 14.2789 5.81999 13.9329V13.9331Z"
                      fill="currentColor"
                    />
                    <path
                      d="M3.31806 0C4.4447 0.0375484 5.30908 0.887057 5.30755 1.9994C5.30603 3.12624 4.4285 3.99042 3.31615 3.98909C2.19104 3.98775 1.32533 3.11156 1.32666 1.99769C1.328 0.872381 2.204 0.0350706 3.31806 0Z"
                      fill="currentColor"
                    />
                    <path
                      d="M13.3158 2.00036C13.2767 3.13367 12.4211 3.96336 11.3154 3.9969C10.1836 3.95802 9.35277 3.10375 9.31885 1.99635C9.35773 0.864757 10.2118 0.033927 11.3192 0C12.4525 0.0390732 13.282 0.894681 13.3158 2.00036Z"
                      fill="currentColor"
                    />
                    <path
                      d="M5.82031 5.49998C5.86282 4.6356 6.44415 4.04817 7.31729 4.00052C8.19253 4.04855 8.77177 4.63808 8.81389 5.50017C8.76967 6.36073 8.19406 6.94721 7.31939 6.99715C6.45997 6.95217 5.86529 6.3775 5.82031 5.49979V5.49998Z"
                      fill="currentColor"
                    />
                  </svg>
                </ClientOnly>
                Personen</span
              >
              <span class="flex gap-2 items-center"
                ><ClientOnly
                  ><FontAwesomeIcon
                    icon="money-bill-1-wave"
                    class="text-primary-500" /></ClientOnly
                >bis zu 2400€</span
              >
            </div>
          </div>
          <p>
            Du hast auch das Recht auf Verpflegung, kostenlose Telefonate und
            E-Mails, und in besonderen Fällen, ein Hotel und Flughafentransfer.
            Du kannst deinen Anspruch auch für die letzten 3 Jahre geltend
            machen.
          </p>
          <p>
            Die Fluggastrechte-VO gilt für alle in der EU startenden und
            landenden Flüge und auch für Flüge in Norwegen, Island,
            Liechtenstein und der Schweiz, sofern die Fluggesellschaft ihren
            Sitz in der EU hat.
          </p>
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
              ]
            "
            :icon="icon"
            :title="title"
            :value="value"
            :key="title"
          />
        </div>
          <p>
            Die Höhe der Entschädigung hängt nicht vom Preis des Flugtickets und
            der gebuchten Klasse ab. Du hast einen Anspruch auf Entschädigung,
            sofern bestimmte Voraussetzungen erfüllt sind. Hierzu gehört, dass
            du eine bestätigte Buchung vorweisen kannst und pünktlich, also zu
            den vorgegebenen Flugzeiten, zur Abfertigung erschienen bist.
          </p>
          <p>
            In bestimmten Fällen kann dein Anspruch auf Entschädigung entfallen,
            zum Beispiel wenn die Fluggesellschaft belegen kann, dass die
            Flugannullierung oder Flugverspätung auf außergewöhnlichen Umständen
            wie z.B. Sperrungen des Flughafens, Vögel im Triebwerk oder heftigen
            Unwettern basiert und alle ihr zumutbaren Maßnahmen ergriffen hat,
            um die Annullierung oder Flugverspätung zu vermeiden. Dein Anspruch
            entfällt auch, wenn die Fluggesellschaft dich mindestens zwei Wochen
            vor der planmäßigen Abflugzeit über die Annullierung informiert hat
            oder bei kurzfristiger Information eine adäquate Ersatzbeförderung
            anbietet.
          </p>
          <p>
            Dein Entschädigungsanspruch kann rückwirkend für die letzten 3 Jahre
            geltend gemacht werden, gerechnet ab dem Ende des Jahres, in dem er
            entstanden ist. So verjähren Ansprüche aus dem Jahr 2022 und den
            Folgejahren erst am 31.12.2025.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Button from "~/components/molecules/Button.vue";
export default defineComponent({
  components: {
    Button,
  },
  setup() {
    definePageMeta({
      title: "Angebote",
      description:
        "Hier wirst du deinen Weg finden und kannst im Wald oder mit den Pferden einen Prozess der Heilung zu beginnen.",
    });

    return {};
  },
  data() {
    return {
      featured: [],
    };
  },
  async mounted() {
    this.$state.headerColor = "dark";
  },
  unmounted() {
    this.$state.headerColor = null;
  },
  methods: {
    ucFirstAll(string: string) {
      return string
        .replaceAll("-", " ")
        .replaceAll("faq", "FAQ")
        .replaceAll("ue", "ü")
        .replaceAll("ae", "ä")
        .replaceAll("oe", "ö")
        .split(" ")
        .map((word) => this.ucfirst(word))
        .join(" ")
        .replaceAll("Rights Plus", "RightsPlus");
    },
    ucfirst(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
});
</script>

<style scoped></style>
