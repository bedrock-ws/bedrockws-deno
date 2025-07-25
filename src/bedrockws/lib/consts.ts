/** Name displayed for commands executed originating from the server. */
export const names = {
  "nl_NL": "Extern",
  "fr_CA": "Externe",
  "it_IT": "Esterno",
  "nb_NO": "Ekstern",
  "fi_FI": "Ulkoinen",
  "en_US": "Extern",
  "es_ES": "Externo",
  "ru_RU": "Внешний",
  "zh_CN": "外部",
  "cs_CZ": "Externí",
  "da_DK": "Ekstern",
  "es_MX": "Externo",
  "th_TW": "外部",
  "bg_BG": "Външен",
  "uk_UA": "Зовнішні",
  "sk_SK": "Externý",
  "pt_PT": "Exterior",
  "en_GB": "External",
  "pl_PL": "Zewnętrzny",
  "sv_SE": "Extern",
  "tr_TR": "Harici",
  "id_ID": "Eksternal",
  "pt_BR": "Externo",
  "hu_HU": "Külső",
  "ko_KR": "외부",
  "fr_FR": "Externe",
  "el_GR": "Εξωτερικό",
  "de_DE": "Extern",
  "ja_JP": "外部",
} as const;

/** 
 * Translation key for name displayed for commands executed originating from
 * the server.
 */
export const nameTranslationKey = "commands.origin.external";

/**
 * The maximum amount of commands the client can handle at once without
 * responding.
 *
 * When the server requested this amount of commands and has not got any
 * response back, the server needs to wait until one response is received
 * before it can send the next request.
 */
export const maxCommandProcessing = 100;
