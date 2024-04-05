import { state, claim, airports, airlines, admin } from '@/store'
import IBAN from 'iban';
import { euMember } from 'is-european';
import type { Airline, Airport } from '@/types';


export const useAppState = () => state
export const useAdminState = () => admin
export const useClaim = () => claim
export const useAirports = () =>{
  async function query (iata: string): Promise<Airport>
  async function query (iata: string[]): Promise<Record<string, Airport>>
  async function query (iata: string | string[]) {
    const algolia = useAlgoliaSearch("AIRPORTS")
    const iatas = Array.isArray(iata) ? iata : [iata]
    await Promise.all(iatas.map(async (iata) => {
      if (airports.value[iata]) return
      await queryAirports(algolia, iata)
    }))
    return Array.isArray(iata) ? airports.value : airports.value[iata]
  }
  return {
    airports,
    query
  }
}
export async function useAirlines(iata: string): Promise<Airline>
export async function useAirlines(iata?: string[]): Promise<Record<string, Airline>>
export async function useAirlines(iata?: string | string[]) {
  if (!iata?.length) {
    await queryAirlines()
    return airlines.value
  }
  const iatas = Array.isArray(iata) ? iata : [iata]
  await Promise.all(iatas.map(async (iata) => {
    if (airlines.value[iata]) return
    return await queryAirlines(iata)
  }))
  return Array.isArray(iata) ? airlines.value : airlines.value[iata]
}

type ProcessClaimResponse = {
  eligible: boolean | null;
  message: string | null;
  completed: number;
  sectionComplete: number;
}
const initialResults: ProcessClaimResponse = {
  eligible: null,
  message: null,
  completed: -1,
  sectionComplete: 0
}
export const useProcessClaim = () => {
  const { noBoardingReasons } = useDisruption()
  const airline = ref<Airline>()

  const result = ref<ProcessClaimResponse>(initialResults)
  const assign = () => {
    result.value.completed = processClaim().completed
    result.value.sectionComplete = processClaim().sectionComplete
    result.value.message = processClaim().message
    result.value.eligible = processClaim().eligible
  }


  const processClaim = () => {
    const { airport, route, flight, disruption, client } = claim.value || {}
    const response: ProcessClaimResponse = {
      eligible: null,
      message: null,
      completed: -1,
      sectionComplete: 0
    }

    if (!claim) {
      return response
    }

    // TRIP
    if (!airport?.departure || !airport?.arrival) {
      return response
    }
    if (airport?.departure.iata === airport?.arrival.iata) {
      response.message = "Die Flughäfen sind identisch."
      return response
    }
    if (!euMember(airport.departure.country_code) && !euMember(airport.arrival.country_code)) {
      response.eligible = false
      response.message = "Keiner der Flughäfen liegt in der EU."
      return response
    }
    const routes = generateRoutes(airport.trip)

    if (!route || !routes[route]) {
      response.message = "Wähle eine Route."
      return response
    }

    // FLIGHT
    if (!flight) {
      response.message = "Wähle einen Flug."
      return response
    }
    if (!airlines.value[flight.airline.iata]) {
      response.message = "Es gibt einen Fehler mit der Fluggesellschaft."
      return response
    }

    if (!euMember(airport.departure.country_code) && !airlines.value[flight.airline.iata].isEuMember) {
      response.eligible = false
      response.message = "Sowohl der Startflughafen als auch der Sitz der Fluggesellschaft befinden sich außerhalb der EU."
      return response
    }
    response.completed = 0

    // DISRUPTION
    if (!disruption || !disruption.type) {
      response.message = "Wähle eine Störung."
      return response
    }
    if (disruption.type === "delayed") {
      if (!disruption.details) {
        response.message = "Verspätungsdauer angeben."
        return response
      }
      if (disruption.details === "<3") {
        if (disruption.replacement) {
          // @todo
          response.message = "Anschlussverbindung angeben."
          return response
        } else if (disruption.replacement === false) {
          response.eligible = false
          response.message = "Die Verspätung ist zu gering."
          return response
        } else {
          response.message = "Angeben ob es Ersatzflug gab."
          return response
        }
      }
      response.sectionComplete = 1
    } else if (disruption.type === "cancelled") {
      if (!disruption.details) {
        response.message = "Bitte angeben, wie weit im Voraus dich die Airline über die Annullierung informiert hat."
        return response
      }
      if (disruption.details === '>14') {
        response.eligible = false
        response.message = "Wenn du mehr als 14 Tage im Voraus über die Annulierung informiert wurdest, hast du laut geltendem EU-Recht keinen Anspruch auf Entschädigung."
        return response
      }
      if (disruption.replacement) {
        // @todo
        response.message = "Anschlussverbindung angeben."
        return response
      } else if (disruption.replacement === null) {
        response.message = "Angeben ob es Ersatzflug gab."
        return response
      }
      response.sectionComplete = 1
    } else if (disruption.type === "noBoarding") {
      if (noBoardingReasons.find(e => e.value === disruption.reason)?.selfInflicted) {
        response.eligible = false
        response.message = "Die Nichtbeförderung wurde selbst verschuldet."
        return response
      }
      response.sectionComplete = 1
    }
    if (disruption.type !== "other" && !disruption.reason) {
      response.message = "Ursache angeben."
      response.sectionComplete = 1
      return response
    }
    response.eligible = true
    if (disruption.reason === 'other' && !disruption.other) {
      response.message = "Bitte erläutern."
      response.sectionComplete = 1
      return response
    }
    response.completed = 1

    if ((client.bookingNumber?.length || 0) < 3) {
      response.message = "Bitte die Buchungsnummer angeben!"
      return response
    }
    if (client.passengers.some(passenger => !IBAN.isValid(passenger.iban))) {
      response.message = "Bitte eine gültige IBAN eingeben."
      return response
    }
    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    if (client.passengers.some(passenger => !validateEmail(passenger.email))) {
      response.message = "Bitte eine gültige E-Mail eingeben."
      return response
    }
    if (!client.passengers.every(passenger => Object.values(passenger).every(Boolean) && Object.values(passenger.address).every(Boolean))) {
      response.message = "Bitte alle Felder ausfüllen."
      return response
    }
    // if (!client.agreedToTerms) {
    //   response.message = "Bitte stimme unseren Nutzungsbedingungen zu."
    //   return response
    // }
    response.completed = 2
    return response
  }
  onMounted(() => useAirlines().then(processClaim))
  watch(() => claim.value, assign, { immediate: true, deep: true })
  return result
}