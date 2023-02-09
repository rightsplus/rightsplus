import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faStar,
  faCheck,
  faArrowDown,
  faPlane,
  faPlaneDeparture,
  faPlaneArrival,
  faPlus,
  faPlusCircle,
  faCircleCheck,
  faRoute
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faCheck,
  faArrowDown,
  faPlus,
  faPlusCircle,
  faPlaneArrival,
  faPlaneDeparture,
  faPlane,
  faArrowLeft,
  faArrowRight,
  faStar,
  faCircleCheck,
  faRoute
)

config.autoAddCss = false
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)

})