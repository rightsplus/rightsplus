import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faEnvelope,
  faCompass,
  faSuitcaseMedical,
  faUserGear,
  faWandSparkles,
  faRoute,
  faBriefcase,
  faTree,
  faWind,
  faPersonHiking,
  faArrowLeft,
  faArrowRight,
  faCalendar,
  faCalendarPlus,
  faQuoteRight,
  faStar,
  faCertificate,
  faScaleBalanced,
  faBoltLightning,
  faRoadBarrier,
  faEyeLowVision,
  faCircleNotch,
  faBath,
  faPeopleGroup,
  faCircleNodes,
  faPersonWalkingArrowRight,
  faCouch,
  faLeaf,
  faSpa,
  faChessKnight,
  faCheck
} from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons'
library.add(
  faBath,
  faCheck,
  faEnvelope,
  faBriefcase,
  faTree,
  faWind,
  faCompass,
  faSuitcaseMedical,
  faUserGear,
  faWandSparkles,
  faRoute,
  faEyeLowVision,
  faCircleNotch,
  faRoadBarrier,
  faScaleBalanced,
  faBoltLightning,
  faPersonHiking,
  faBoltLightning,
  faArrowLeft,
  faArrowRight,
  faCalendar,
  faCalendarPlus,
  faQuoteRight,
  faStar,
  faInstagram,
  faFacebook,
  faCertificate,
  faPeopleGroup,
  faCircleNodes,
  faPersonWalkingArrowRight,
  faCouch,
  faLeaf,
  faSpa,
  faChessKnight
)

config.autoAddCss = false
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)

})