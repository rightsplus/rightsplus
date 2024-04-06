import countries from "i18n-iso-countries";
import de from "i18n-iso-countries/langs/de.json";
import en from "i18n-iso-countries/langs/en.json";
import es from "i18n-iso-countries/langs/es.json";
import fr from "i18n-iso-countries/langs/fr.json";
countries.registerLocale(de);
countries.registerLocale(en);
countries.registerLocale(es);
countries.registerLocale(fr);

export { countries }
