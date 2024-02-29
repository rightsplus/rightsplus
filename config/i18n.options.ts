import { locales } from "./i18n";

export type LocaleObject = {
	code: string;
	name: string;
	file: string;
	iso: string;
}
const format = () => ({
	km: { style: 'unit', unit: 'kilometer', unitDisplay: 'narrow' },
	m: { style: 'unit', unit: 'meter', unitDisplay: 'narrow' },
	cm: { style: 'unit', unit: 'centimeter', unitDisplay: 'narrow' },
	mm: { style: 'unit', unit: 'millimeter', unitDisplay: 'narrow' },
	deg: { style: 'unit', unit: 'degree', unitDisplay: 'narrow' },
	celsius: { style: 'unit', unit: 'celsius', unitDisplay: 'narrow' },
	percent: { style: 'percent', maximumFractionDigits: 2 },
	currency: { style: 'currency', currency: 'EUR' },
})
export default defineI18nConfig(() => ({
	numberFormats: locales.reduce((a, { code }) => ({ ...a, [code]: format() }), {}),
}))