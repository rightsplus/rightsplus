<template>
    <h2 class="text-xl font-medium mb-8 tracking-tight">
      Gib hier deine Flugdaten ein und sichere dir bis zu <strong>450€</strong> Entschädigung.
    </h2>
    <div class="double gap-4">
      <AirportInput
        name="departure"
        label="Startflughafen"
        placeholder="z.B. Berlin oder BER"
        prefix-icon="plane-departure"
        v-model="modelValue.airport.departure"
      />
      <AirportInput 
        name="arrival"
        label="Zielflughafen"
        placeholder="z.B. Tel Aviv oder TLV"
        prefix-icon="plane-arrival"
        v-model="modelValue.airport.arrival"
      />
    </div>

    <FormKit
      type="submit"
      @click.prevent="submitHandler"
      label="Jetzt Entschädigung berechnen!"
    />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import TrieSearch from "trie-search";
import ListAirport from "./ListAirport.vue";
import AirportInput from "./AirportInput.vue";
import { Airport } from "@/types";
import { countries } from '@/config/countries'
import { form } from "@formkit/inputs";


export default defineComponent({
  components: {
    FormKit,
    ListAirport,
    AirportInput,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      submitted: false,
      limit: 10,
      value: null,
      form: {
        departure: "",
        arrival: "",
      },
      focused: {
        departure: false,
        arrival: false,
      },
      airports: new TrieSearch(["iata", "name", "city", "country", "full"], { min: 2 }),
    };
  },

  mounted() {
    if (this.modelValue?.airport?.departure) {
      this.form.departure = this.modelValue.airport.departure.full;
    }
    if (this.modelValue?.airport?.arrival) {
      this.form.arrival = this.modelValue.airport.arrival.full;
    }
    fetch(
      "https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/mwgg/Airports/master/airports.json"
    )
      .then((response) => response.json())
      .then((data: Record<string, Airport>) => {
        const raw = Object.values(data).reduce(
          (acc: Airport[], { name, iata, city, country }: Airport) => {
            return iata ? [...acc, { full: `${name} (${iata})`, name, iata, city, countryCode: country, country: countries.getName(country || "", this.$i18n.locale) }] : acc;
          },
          []
        );
        this.airports.addAll(raw);
      })
      .catch((error) => {
        this.airports.add({
          name: "Error with Server Request",
          iata: "ERR",
          city: "Error",
          country: "Error",
        });
      });
  },
  // watch: {
  //   form: {
  //     handler(val) {
  //       this.$emit("update:modelValue", val);
  //     },
  //     deep: true
  //   },
  // },
  computed: {
    departures() {
      return this.airports.search(this.modelValue.airport.departure);
    },
    arrivals() {
      return this.airports.search(this.modelValue.airport.arrival);
    },
  },
  methods: {
    log(e) {
      console.log(e);
    },
    handleInput(name: 'arrival' | 'departure', airport: Airport) {
      this.modelValue.airport[name] = airport;
      this.form[name] = airport.full;
    },
    handleFocus(name: 'arrival' | 'departure', value: boolean) {
      this.focused[name] = value;
    },
    submitHandler() {
      fetch("api/aviationstack.json")
        .then((data) => data.json())
        .then(({ data }) => {
          this.$state.flights = data;
        })
        .catch((error) => {
          console.log(error);
        });
      this.$emit('submit')
      return;
      // const cors = "https://cors-anywhere.herokuapp.com/";
      // const aviationstack = useRuntimeConfig().public.flight.aviationstack;
      // const date = modelValue.flightDate.split("-");

      // const request = `https://cors-anywhere.herokuapp.com/https://api.flightstats.com/flex/flightstatus/historical/rest/v3/json/route/status/${modelValue.departure}/${modelValue.arrival}/arr/${date[0]}/${date[1]}/${date[2]}?appId=${appId}&appKey=${token}&utc=false&maxFlights=1`;
      // const request = `${cors}https://app.goflightlabs.com/historical/${modelValue.flightDate}?access_key=${flighlabs}&code=${modelValue.departure}&type=departure`

      const request = `${cors}http://api.aviationstack.com/v1/flights/?access_key=${aviationstack}`;
      fetch(request)
        .then((data) => {
          console.log(data);
          return data.json();
        })
        .then((data) => {
          console.log(data);
          // console.log(data.filter(({ arrival }) => arrival.iataCode?.toUpperCase() === modelValue.arrival.toUpperCase()));
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
</script>
<style scoped>
.double {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.triple {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
