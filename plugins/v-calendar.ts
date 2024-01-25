import { setupCalendar } from 'v-calendar';
import 'v-calendar/dist/style.css';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(setupCalendar, {});
// Use the components
  // nuxtApp.vueApp.component('Calendar', Calendar);
  // nuxtApp.vueApp.component('DatePicker', DatePicker);
});
