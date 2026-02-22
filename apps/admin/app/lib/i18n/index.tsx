import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  languages,
  SUPPORTED_LANGS,
  type Lang,
  type LangConfig,
} from "./languages";

type TFunction = (
  key: string,
  params?: Record<string, string | number>,
) => string;

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TFunction;
  locale: string;
  formatPrice: (amount: number) => string;
  pricing: LangConfig["pricing"];
}

const fallback = languages.ko;

const I18nContext = createContext<I18nContextValue>({
  lang: "ko",
  setLang: () => {},
  t: (key) => fallback.dict[key] ?? key,
  locale: fallback.locale,
  formatPrice: (n) => `₩${n.toLocaleString()}`,
  pricing: fallback.pricing,
});

const STORAGE_KEY = "promo-admin-lang";

function isValidLang(v: string): v is Lang {
  return v in languages;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ko");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidLang(stored)) {
      setLangState(stored);
      return;
    }
    const browserPrefix = (navigator.language ?? "").split("-")[0];
    if (isValidLang(browserPrefix) && browserPrefix !== "ko") {
      setLangState(browserPrefix);
      localStorage.setItem(STORAGE_KEY, browserPrefix);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  const config = languages[lang] ?? fallback;

  const t: TFunction = useCallback(
    (key, params) => {
      const template = config.dict[key] ?? key;
      if (!params) return template;
      return template.replace(/\{(\w+)\}/g, (match: string, k: string) =>
        k in params ? String(params[k]) : match,
      );
    },
    [config.dict],
  );

  const formatPrice = useCallback(
    (amount: number) => {
      const noDecimals = config.currency === "KRW" || config.currency === "JPY";
      return new Intl.NumberFormat(config.locale, {
        style: "currency",
        currency: config.currency,
        minimumFractionDigits: noDecimals ? 0 : 2,
        maximumFractionDigits: noDecimals ? 0 : 2,
      }).format(amount);
    },
    [config.locale, config.currency],
  );

  return (
    <I18nContext.Provider
      value={{
        lang,
        setLang,
        t,
        locale: config.locale,
        formatPrice,
        pricing: config.pricing,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}

export { SUPPORTED_LANGS, languages };
export type { Lang };
