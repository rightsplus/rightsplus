const { orange, neutral, sky, emerald, yellow, red, black, white, transparent } = require('tailwindcss/colors')
const gray = {
  "50": "hsl(200deg 60% 98%)",
  "100": "hsl(200deg 44% 94%)",
  "200": "hsl(200deg 32% 88%)",
  "300": "hsl(200deg 25% 80%)",
  "400": "hsl(200deg 20% 64%)",
  "500": "hsl(200deg 16% 48%)",
  "600": "hsl(200deg 16% 32%)",
  "700": "hsl(200deg 17% 24%)",
  "800": "hsl(200deg 35% 16%)",
  "900": "hsl(200deg 45% 8%)",
  "950": "hsl(217deg 63% 5%)"
}


const colors = {
  primary: orange,
  neutral,
  blue: sky,
  green: emerald,
  yellow,
  orange,
  red,
  black,
  gray,
  white,
  transparent,
}

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./formkit.config.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  tailwindcss: {
    viewer: true,
  },
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    colors,
    extend: {
      animation: {
        revolve: `revolve 500ms infinite cubic-bezier(0.3, 0.3, 0.3, 0.5)`,
        tumble: `revolve 700ms infinite cubic-bezier(0.5, 0.3, 0.3, 0.7)`
      },
      keyframes: {
        revolve: {
          '0%': { transform: 'rotate(-40deg)' },
          '100%': { transform: 'rotate(320deg)' },
        }
      },

      boxShadow: {
        autofill: `inset 0 0 0 2em ${colors.blue['100']}`,
      },
      fontSize: {
        '3xs': '.5rem',
        '2xs': '.625rem',
        '10xl': '160px',
        '11xl': '176px',
        '12xl': '192px',
        '13xl': '208px',
        '14xl': '224px',
        '15xl': '240px',
        '16xl': '256px',
      },
    },
  },
  plugins: [
    require('@formkit/tailwindcss'),
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/forms'),
    require('tailwindcss-unimportant'),
    require('tailwindcss-touch'),
    require("tailwindcss-hyphens"),
    require('tailwind-css-variables')({
      screens: false,
      lineHeight: false,
      letterSpacing: false,
      backgroundSize: false,
      boxShadow: false,
      zIndex: false,
      transitionDuration: 'transition-duration',
      transitionProperty: 'transition-property',
      transitionDelay: 'transition-delay',
      transitionDuration: 'transition-duration',
      transitionTimingFunction: 'transition-timing-function',
      outlineStyle: 'outline-style',
      outlineWidth: 'outline-width',
      outlineOffset: 'outline-offset',
      outlineColor: 'outline-color',
    }),
  ],
  darkMode: 'class',
}
