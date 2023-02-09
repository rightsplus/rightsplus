
const format = () => ({
  km: { style: 'unit', unit: 'kilometer', unitDisplay: 'narrow' },
  m: { style: 'unit', unit: 'meter', unitDisplay: 'narrow' },
  cm: { style: 'unit', unit: 'centimeter', unitDisplay: 'narrow' },
  mm: { style: 'unit', unit: 'millimeter', unitDisplay: 'narrow' },
  deg: { style: 'unit', unit: 'degree', unitDisplay: 'narrow' },
  percent: { style: 'percent', maximumFractionDigits: 2 },
  currency: { style: 'currency', currency: 'EUR' },
})

console.log(['de', 'en'].reduce((a, v) => ({ ...a, [v]: format()}), {}))

// adds the same formatting to each locale
export default {
  langDir: 'locales/',
  defaultLocale: 'de',
  locales: [
    {
      code: 'de',
      file: 'de.json'
    },
  ],
  vueI18n: {
    numberFormats: ['de', 'en'].reduce((a, v) => ({ ...a, [v]: format()}), {})
  }
}