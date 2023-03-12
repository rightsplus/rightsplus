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
  faRoute,
  faFilePen,
  faMoneyBill1Wave,
  faPlaneCircleXmark,
  faClock,
  faGlobeEurope,
  faCalendar,
  faMeteor,
  faUserGroup,
  faSignsPost
} from '@fortawesome/free-solid-svg-icons'
import { faApple, faGoogle } from '@fortawesome/free-brands-svg-icons'
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
  faRoute,
  faFilePen,
  faMoneyBill1Wave,
  faPlaneCircleXmark,
  faClock,
  faGlobeEurope,
  faCalendar,
  faMeteor,
  faGoogle,
  faApple,
  faUserGroup,
  faSignsPost
)

config.autoAddCss = false
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)

})