export interface CityEntry {
  key: string;
  hy: string;
  ru: string;
  en: string;
}

// NOTE: Armenian (hy) names should be verified by a native speaker.
export const ARMENIAN_CITIES: CityEntry[] = [
  { key: 'yerevan',      hy: 'Երևան',          ru: 'Ереван',       en: 'Yerevan' },
  { key: 'gyumri',       hy: 'Գյումրի',        ru: 'Гюмри',        en: 'Gyumri' },
  { key: 'vanadzor',     hy: 'Վանաձոր',        ru: 'Ванадзор',     en: 'Vanadzor' },
  { key: 'vagharshapat', hy: 'Վաղարշապատ',    ru: 'Вагаршапат',   en: 'Vagharshapat' },
  { key: 'abovyan',      hy: 'Աբովյան',        ru: 'Абовян',       en: 'Abovyan' },
  { key: 'hrazdan',      hy: 'Հրազդան',        ru: 'Раздан',       en: 'Hrazdan' },
  { key: 'ashtarak',     hy: 'Աշտարակ',        ru: 'Аштарак',      en: 'Ashtarak' },
  { key: 'aparan',       hy: 'Ապարան',         ru: 'Апаран',       en: 'Aparan' },
  { key: 'artashat',     hy: 'Արտաշատ',        ru: 'Арташат',      en: 'Artashat' },
  { key: 'ararat',       hy: 'Արարատ',         ru: 'Арарат',       en: 'Ararat' },
  { key: 'masis',        hy: 'Մասիս',          ru: 'Масис',        en: 'Masis' },
  { key: 'charentsavan', hy: 'Չարենցավան',    ru: 'Чаренцаван',   en: 'Charentsavan' },
  { key: 'sevan',        hy: 'Սևան',           ru: 'Севан',        en: 'Sevan' },
  { key: 'gavar',        hy: 'Գավառ',          ru: 'Гавар',        en: 'Gavar' },
  { key: 'martuni',      hy: 'Մարտունի',       ru: 'Мартуни',      en: 'Martuni' },
  { key: 'ijevan',       hy: 'Իջևան',          ru: 'Иджеван',      en: 'Ijevan' },
  { key: 'dilijan',      hy: 'Դիլիջան',        ru: 'Дилижан',      en: 'Dilijan' },
  { key: 'noyemberyan',  hy: 'Նոյեմբերյան',    ru: 'Ноемберян',    en: 'Noyemberyan' },
  { key: 'berd',         hy: 'Բերդ',           ru: 'Берд',         en: 'Berd' },
  { key: 'stepanavan',   hy: 'Ստեփանավան',     ru: 'Степанаван',   en: 'Stepanavan' },
  { key: 'alaverdi',     hy: 'Ալավերդի',       ru: 'Алаверди',     en: 'Alaverdi' },
  { key: 'spitak',       hy: 'Սպիտակ',         ru: 'Спитак',       en: 'Spitak' },
  { key: 'tashir',       hy: 'Տաշիր',          ru: 'Ташир',        en: 'Tashir' },
  { key: 'yeghegnadzor', hy: 'Եղեգնաձոր',      ru: 'Егегнадзор',   en: 'Yeghegnadzor' },
  { key: 'sisian',       hy: 'Սիսիան',         ru: 'Сисиан',       en: 'Sisian' },
  { key: 'goris',        hy: 'Գորիս',          ru: 'Горис',        en: 'Goris' },
  { key: 'kapan',        hy: 'Կապան',          ru: 'Капан',        en: 'Kapan' },
  { key: 'meghri',       hy: 'Մեղրի',          ru: 'Мегри',        en: 'Meghri' },
];

type Locale = 'hy' | 'ru' | 'en';

export function cityLabel(key: string | null | undefined, locale: string): string {
  if (!key) return '';
  const city = ARMENIAN_CITIES.find((c) => c.key === key);
  if (!city) return key;
  const lang = (['hy', 'ru', 'en'].includes(locale) ? locale : 'hy') as Locale;
  return city[lang];
}
