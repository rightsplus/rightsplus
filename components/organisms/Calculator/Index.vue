<template>
  <FormKit
    type="form"
    :form-class="submitted ? 'hide' : 'show'"
    submit-label="Jetzt Entschädigung berechnen!"
    :actions="false"
    v-model="value"
  >
    <h2 class="text-xl font-medium mb-8">
      Gib hier deine Flugdaten ein und sichere dir bis zu 450€* Entschädigung.
    </h2>
    <div class="triple gap-3">
      <div class="">
        <FormKit
          type="text"
          name="departure"
          label="Abflughafen"
          validation="required|matches:/[a-zA-Z0-9]/"
          placeholder="LHR"
          autocomplete="off"
          @focus="focused.departure = true"
          @blur="focused.departure = false"
        />
        <ListAirport
          v-if="focused.departure"
          class="w-2/3 -mt-2"
          :airports="airports"
          :query="modelValue.departure"
        />
      </div>
      <div class="">
        <FormKit
          type="text"
          name="arrival"
          label="Ankunftshafen"
          validation="required|matches:/[a-zA-Z0-9]/"
          placeholder="FRA"
          autocomplete="off"
          @focus="focused.arrival = true"
          @blur="focused.arrival = false"
        />
        <ListAirport
          v-if="focused.arrival"
          class="w-2/3"
          :airports="airports"
          :query="modelValue.arrival"
        />
      </div>
      <!-- <FormKit
          type="text"
          name="flightNumber"
          label="Flugnummer"
          validation="required|length:5|matches:/[a-zA-Z0-9]/"
          placeholder="AG124"
          maxlength="5"
          input-class="uppercase"
          value="LH695"
        /> -->
      <FormKit
        type="date"
        name="flightDate"
        label="Flugdatum"
        validation="required|date"
        input-class="uppercase"
        value="2023-01-31"
      />
    </div>

    <FormKit
      type="submit"
      @click.prevent="submitHandler"
      label="Jetzt Entschädigung berechnen!"
      help="* die Entschädigungssumme hängt von Verspätungsdauer und Flugdistanz ab."
    />
  </FormKit>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FormKit } from "@formkit/vue";
import TrieSearch from "trie-search";
import ListAirport from "./ListAirport.vue";
import { Airport } from "@/types";
import { countries } from '@/config/countries'

export default defineComponent({
  components: {
    FormKit,
    ListAirport,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        departure: "SFO",
        arrival: "DFW",
        flightDate: "2019-12-12",
      }),
    },
  },
  data() {
    return {
      submitted: false,
      limit: 10,
      value: this.modelValue,
      focused: {
        departure: false,
        arrival: false,
      },
      airports: new TrieSearch(["iata", "name", "city", "country"], { min: 2 }),
    };
  },

  mounted() {
    fetch(
      "https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/mwgg/Airports/master/airports.json"
    )
      .then((response) => response.json())
      .then((data: Record<string, Airport>) => {
        const raw = Object.values(data).reduce(
          (acc: Airport[], { name, iata, city, country }: Airport) => {
            return iata ? [...acc, { name, iata, city, countryCode: country, country: countries.getName(country || "", this.$i18n.locale) }] : acc;
          },
          []
        );
        this.airports.addAll(raw);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  watch: {
    value: {
      handler(val) {
        this.$emit("update:modelValue", val);
      },
      deep: true
    },
  },
  computed: {
    departures() {
      return this.airports.search(this.modelValue.departure);
    },
    arrivals() {
      return this.airports.search(this.modelValue.arrival);
    },
  },
  methods: {
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
