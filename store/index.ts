import { reactive, onMounted } from 'vue'
import type { Flight, ClaimsForm, Review, Airport, Leg, Airline, RowClaim, RowAirline } from '@/types'
import nuxtStorage from 'nuxt-storage';


export interface State {
  flights: Flight[];
  // airports: Record<string, Airport>,
  reviews: {
    url?: string;
    entries?: Review[];
  };
  legs: Record<string, Leg>;
}
export interface AdminState {
  claims: RowClaim[];
  clients: any[];
}

export const defaultClaim = {
  airport: {
    departure: {} as Airport,
    arrival: {} as Airport,
    trip: {
      departure: {} as Airport,
      arrival: {} as Airport,
      layover: [{}] as Airport[],
    },
  },
  leg: null,
  flight: null,
  date: '',
  client: {
    passengers: [{
      firstName: '',
      lastName: '',
      email: '',
      address: {
        street: '',
        postalCode: '',
        city: '',
        country: '',
      },
      iban: '',
      boardingPass: undefined,
    }],
    bookingNumber: '',
    agreedToTerms: false,
  },
  disruption: {
    type: null,
    details: null,
    reason: null,
    comment: null,
  },
  replacement: {
    departure: {} as Airport,
    arrival: {} as Airport,
    date: '',
    number: '',
    flight: null,
  },
  connection: {
    departure: {} as Airport,
    arrival: {} as Airport,
    date: '',
    number: '',
    flight: null,
  },
} as ClaimsForm

export const claim: ClaimsForm = reactive(JSON.parse(JSON.stringify(defaultClaim)))

export const state = reactive({
  legs: {} as Record<string, Leg>,
  flights: [] as Flight[],
  reviews: {
    url: '',
    entries: [],
  },
} as State)

export const admin = reactive({
  claims: [],
  clients: [],
} as AdminState)

// watch(() => claim.value.airport.trip, (value) => {
//   if (value) state.legs = generateLegs?.(value);
//   console.log('trip', value)
//   console.log('state.legs',state.legs)
// }, { deep: true });
watch(claim, (value) => {
  if (!process.client || !value) return
  nuxtStorage.localStorage.setData('rights-plus-claims', value, 30);
}, { deep: true });
watch(() => { }, () => {
  if (process.client) {
    const value = nuxtStorage.localStorage.getData('rights-plus-claims')
    if (value) Object.assign(claim, value)
  }
}, { immediate: true });

export const airports = ref({} as Record<string, Airport>);

export const airlines = ref({} as Record<string, RowAirline>);

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $state: State;
  }
}