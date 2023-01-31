<template>
  <div>
    <div class="grid md:grid-cols-2 xl:grid-cols-3">
      <div class="p-5 md:p-12">
        <div class="col-span-1 md:col-span-2 text-stone-500 font-medium">
          {{ $t("get.in.touch") }}
        </div>
        <div class="flex flex-col gap-3">
          <div class="text-4xl mb-12">{{ $t("get.in.touch.description") }}</div>
        </div>
        <ContactForm />
        <div class="grid gap-12 my-12">
          <div>
            <p>{{ $t("find.me") }}</p>
            <p
              class="font-bold text-2xl"
              v-html="geolocation?.place_name?.replace(/,/g, '<br>')"
            ></p>
          </div>

          <div>
            <p>{{ $t("contact.me") }}</p>
            <p class="font-bold text-2xl">
              +49 (0) 1763 - 1763 624<br />hallo@heidivogler.de
            </p>
          </div>
        </div>
      </div>
      <div ref="map" class="h-[50vh] md:h-full xl:col-span-2" />
    </div>
  </div>
</template>

<script lang="ts">
import ContactForm from "@/components/organisms/ContactForm.vue";
export default defineComponent({
  components: {
    ContactForm,
  },
  head() {
    return {
      title: "Kontakt",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("get.in.touch.description"),
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css",
        },
      ],
    };
  },
  setup() {
    definePageMeta({
      title: "Kontakt",
    });

    return {};
  },
  data() {
    return {
      contact: {
        name: "",
        email: "",
        message: "",
        location: "",
      },
      token: useRuntimeConfig().public.mapbox.token,
      location: "Gailhöfe 6, 88699 Frickingen",
      geolocation: { center: [0, 0], place_name: "" },
      debounce: null,
    };
  },
  methods: {
    async geocoding(search: string): Promise<[number, number]> {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        search
      )}.json?access_token=${this.token}&types=address&limit=1&language=de`;

      return fetch(url)
        .then((res) => res.json())
        .then(({ features }) => {
          return (this.geolocation = features[0]);
        })
        .catch((error) => console.error(error));
    },
    async initMap() {
      if (!this.$refs.map) return;

      const mapboxgl = await import("mapbox-gl");
      const map = new mapboxgl.Map({
        accessToken: this.token,
        attributionControl: true,
        container: this.$refs.map,
        style: "mapbox://styles/mapbox/streets-v11",
        center: this.geolocation?.center,
        language: "de",
        // scrollZoom: false,
        cooperativeGestures: true,
        zoom: 10,
        pitch: 45,
      });
      const marker = new mapboxgl.Marker()
        .setLngLat(this.geolocation?.center)
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<p>${this.geolocation?.place_name?.replace(/,/g, "<br>")}</p>`
          )
        )
        .addTo(map);
    },
  },
  watch: {
    location: {
      handler(newValue: string) {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          this.geocoding(newValue);
        }, 1000);
      },
      immediate: true,
    },
    geolocation(newLocation, oldLocation) {
      if (
        newLocation?.center &&
        newLocation?.center.map((e: number) => e.toFixed(3)) !==
          oldLocation?.center.map((e: number) => e.toFixed(3))
      ) {
        this.initMap();
      }
    },
  },
  mounted() {
    this.$state.headerColor = "dark";
  },
  unmounted() {
    this.$state.headerColor = null;
  },
});
</script>

<style lang="scss">
.mapboxgl-popup-content {
  padding: var(--p-5);
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
}
.mapboxgl-popup-close-button {
  padding: var(--p-2);
  &:focus {
    outline: none;
  }
}
.mapboxgl-canvas-container {
  top: 0;
  z-index: 1;
  position: relative;
}
.mapboxgl-canvas {
  position: absolute;
  inset: 0;
  z-index: -1;
}
.mapboxgl-marker {
  position: absolute;
  z-index: 99;
}
.mapboxgl-touch-pan-blocker,
.mapboxgl-scroll-zoom-blocker,
.mapboxgl-control-container {
  display: none;
}
</style>
<style scoped>
:root {
  --header-blur: 20px;
}
</style>
