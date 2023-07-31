import ConnectingFlights from "~/components/organisms/Calculator/ConnectingFlights.vue";
import PersonalInfo from "~/components/organisms/Calculator/PersonalInfo.vue";
import SelectFlight from "~/components/organisms/Calculator/SelectFlight.vue";
import SelectReason from "~/components/organisms/Calculator/SelectReason.vue";

export interface Step {
  label: string,
  title: string,
  component: Component,
  completed?: boolean,
}
export default () => [
  {
    label: "Strecke",
    title: "Wohin bist du geflogen?",
    component: ConnectingFlights,
  },
  {
    label: "Flug",
    title: "Welchen Flug hast du genommen?",
    component: SelectFlight,
  },
  {
    label: "Grund",
    title: "Was ist schief gelaufen?",
    component: SelectReason,
  },
  {
    label: "Passagiere",
    title: "Wer ist mitgeflogen?",
    component: PersonalInfo,
  },
  // {
  //   label: "Results",
  //   component: Results
  // },
] as Step[];