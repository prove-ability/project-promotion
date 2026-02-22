import { ko } from "./ko";
import { en } from "./en";
import { ja } from "./ja";
import { zh } from "./zh";

export interface LangConfig {
  locale: string;
  name: string;
  currency: string;
  pricing: { monthly: number; yearly: number };
  dict: Record<string, string>;
}

export const languages = {
  ko: {
    locale: "ko-KR",
    name: "한국어",
    currency: "KRW",
    pricing: { monthly: 2_900, yearly: 24_900 },
    dict: ko,
  },
  en: {
    locale: "en-US",
    name: "English",
    currency: "USD",
    pricing: { monthly: 1.99, yearly: 19.99 },
    dict: en,
  },
  ja: {
    locale: "ja-JP",
    name: "日本語",
    currency: "JPY",
    pricing: { monthly: 300, yearly: 2_990 },
    dict: ja,
  },
  zh: {
    locale: "zh-CN",
    name: "中文",
    currency: "USD",
    pricing: { monthly: 1.99, yearly: 19.99 },
    dict: zh,
  },
} as const satisfies Record<string, LangConfig>;

export type Lang = keyof typeof languages;

export const SUPPORTED_LANGS = Object.keys(languages) as Lang[];
