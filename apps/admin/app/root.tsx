import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { I18nProvider } from "~/lib/i18n";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Outlet />
    </I18nProvider>
  );
}

const ERROR_MESSAGES: Record<string, { oops: string; unexpected: string; notFound: string; goHome: string }> = {
  ko: { oops: "오류 발생!", unexpected: "예상치 못한 오류가 발생했습니다.", notFound: "요청한 페이지를 찾을 수 없습니다.", goHome: "홈으로" },
  en: { oops: "Oops!", unexpected: "An unexpected error occurred.", notFound: "The requested page could not be found.", goHome: "Go Home" },
  ja: { oops: "エラー発生!", unexpected: "予期しないエラーが発生しました。", notFound: "ページが見つかりません。", goHome: "ホームへ" },
  zh: { oops: "出错了!", unexpected: "发生了意外错误。", notFound: "未找到请求的页面。", goHome: "回到首页" },
};

function getErrorLang(): string {
  try { return localStorage.getItem("promo-admin-lang") ?? "ko"; } catch { return "ko"; }
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const msgs = ERROR_MESSAGES[getErrorLang()] ?? ERROR_MESSAGES.ko;
  let message = msgs.oops;
  let details = msgs.unexpected;
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? msgs.notFound : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-2xl font-bold mb-2">{message}</h1>
      <p className="text-gray-600 mb-4">{details}</p>
      <a href="/dashboard" className="text-blue-600 hover:underline">{msgs.goHome}</a>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto mt-4 bg-gray-50 rounded-lg text-sm">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
