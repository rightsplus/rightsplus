const defaultColors = require('tailwindcss/colors')
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
  primary: defaultColors.orange,
  neutral: defaultColors.neutral,
  info: defaultColors.blue,
  success: defaultColors.emerald,
  warning: defaultColors.amber,
  alert: defaultColors.red,
  black: defaultColors.black,
  gray,
  white: defaultColors.white,
}

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  safelist: [
    ...['1', '2', '3', '4', '5', '6'].map((e) => `col-span-${e}`),
    ...['1', '2', '3', '4', '5', '6'].map((e) => `lg:col-span-${e}`),
    ...['1', '2', '3', '4', '5', '6'].map((e) => `col-start-${e}`),
    ...['1', '2', '3', '4', '5', '6'].map((e) => `lg:col-start-${e}`),
    ...['1', '2', '3', '4', '5', '6'].map((e) => `row-start-${e}`),
    ...['1', '2', '3', '4', '5', '6'].map((e) => `order-${e}`),
  ],
  tailwindcss: {
    viewer: true,
  },
  theme: {
    fontFamily: {
      sans: ['Inter', 'Gramatika', 'sans-serif'],
      display: ['Noe Display', 'serif'],
    },
    colors,
    extend: {
      fontSize: {
        '10xl': '160px',
        '11xl': '176px',
        '12xl': '192px',
        '13xl': '208px',
        '14xl': '224px',
        '15xl': '240px',
        '16xl': '256px',
      },
      gridTemplateRows: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].reduce((acc, curr) => {
        return { ...acc, [curr]: `repeat(${curr}, minmax(0, 1fr))` }
      }, {}),
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
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
