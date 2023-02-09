import countries from "i18n-iso-countries";
import de from "i18n-iso-countries/langs/de.json";
import en from "i18n-iso-countries/langs/en.json";
countries.registerLocale(de);
countries.registerLocale(en);

export { countries }
