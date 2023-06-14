import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEuropeanUnion } from '@/assets/icons'
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
  faTimesCircle,
  faInfoCircle,
  faSun,
  faCloudRain,
  faCloudShowersHeavy,
  faBolt,
  faCloudSunRain,
  faSnowflake,
  faSmog,
  faWind,
  faCloud,
  faCloudSun,
  faCloudMoon,
  faTrain,
  faArrowsLeftRight,
  faArrowRightArrowLeft,
  faHand,
  faMemory,
  faCogs,
  faRoad,
  faPhone,
  faAt,
  faSearch,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons'
import { faApple, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
library.add(
  faCheck,
  faArrowDown,
  faArrowUp,
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
  faGithub,
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
  faPlaneSlash,
  faTimesCircle,
  faEuropeanUnion,
  faInfoCircle,
  faSun,
  faCloudRain,
  faCloudSunRain,
  faCloudShowersHeavy,
  faBolt,
  faSnowflake,
  faSmog,
  faWind,
  faCloud,
  faCloudSun,
  faCloudMoon,
  faSmog,
  faWind,
  faTrain,
  faArrowRightArrowLeft,
  faHand,
  faMemory,
  faCogs,
  faRoad,
  faPhone,
  faAt,
  faSearch
)

config.autoAddCss = false
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)

})