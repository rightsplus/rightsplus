const { orange, neutral, sky, emerald, yellow, red, black, white, transparent } = require('tailwindcss/colors')
const gray = {
	"50": "#d3e1e6",
	"100": "#c4d2d7",
	"200": "#b6c3c8",
	"300": "#a5b3ba",
	"400": "#94a4ab",
	"500": "#71838e",
	"600": "#516471",
	"700": "#374854",
	"800": "#222e37",
	"900": "#0f1519"
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
    require('tailwindcss-touch'),
    require('@tailwindcss/container-queries'),
    require('@formkit/tailwindcss'),
    require("tailwindcss-hyphens"),
    require('@tailwindcss/forms'),
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
