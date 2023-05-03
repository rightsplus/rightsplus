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
  faSignsPost,
  faHeartbeat,
  faUsers,
  faPassport,
  faBeer,
  faShieldAlt,
  faBan,
  faWrench,
  faGun,
  faMapMarkedAlt,
  faSmoking,
  faSmokingBan,
  faMapMarkerAlt,
  faAngleDown,
  faTimes,
  faQuestion,
  faBell,
  faClipboardCheck,
  faExclamationTriangle,
  faPlaneSlash,
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
  faSignsPost,
  faCalendar,
  faPassport,
  faUsers,
  faHeartbeat,
  faBeer,
  faShieldAlt,
  faBan,
  faSmoking,
  faSmokingBan,
  faWrench,
  faGun,
  faMapMarkerAlt,
  faAngleDown,
  faClock,
  faTimes,
  faBan,
  faQuestion,
  faBell,
  faClipboardCheck,
  faExclamationTriangle,
  faPlaneSlash
)

config.autoAddCss = false
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)

})