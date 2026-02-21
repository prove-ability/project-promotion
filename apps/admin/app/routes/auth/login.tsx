import { signIn } from "~/lib/auth.client";

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    title: "드래그 & 드롭 에디터",
    desc: "코드 없이 컴포넌트를 조합해 페이지 완성",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "방문자 분석",
    desc: "페이지뷰, 클릭, 스크롤 데이터 실시간 확인",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    title: "원클릭 배포",
    desc: "완성된 페이지를 즉시 고유 URL로 배포",
  },
];

export default function LoginPage() {
  function handleGoogleLogin() {
    signIn.social({ provider: "google", callbackURL: "/dashboard" });
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel — branding & features */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] shrink-0 flex-col justify-between bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-10 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-0 w-40 h-40 rounded-full bg-white/3" />

        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">
            Promo<span className="text-blue-200">Builder</span>
          </h1>
          <p className="mt-1 text-sm text-blue-200/80">프로모션 페이지 빌더</p>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-xl font-semibold leading-snug">
            프로모션 페이지를<br />
            코드 없이,<br />
            빠르게 만드세요.
          </h2>
          <div className="space-y-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-blue-100">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{f.title}</p>
                  <p className="text-xs text-blue-200/70 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-blue-300/50">
          &copy; {new Date().getFullYear()} PromoBuilder
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Mobile branding */}
        <div className="lg:hidden mb-10 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Promo<span className="text-blue-600">Builder</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">프로모션 페이지 빌더</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">시작하기</h2>
            <p className="text-sm text-gray-500 mt-2">
              Google 계정으로 간편하게 로그인하세요
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 active:scale-[0.98] transition-all"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-semibold text-gray-700">
              Google로 시작하기
            </span>
          </button>

          <p className="mt-6 text-center text-[11px] text-gray-400 leading-relaxed">
            로그인 시{" "}
            <a href="#" className="underline hover:text-gray-500">이용약관</a> 및{" "}
            <a href="#" className="underline hover:text-gray-500">개인정보처리방침</a>에
            동의하는 것으로 간주합니다.
          </p>
        </div>

        {/* Mobile features */}
        <div className="lg:hidden mt-16 w-full max-w-sm">
          <div className="grid grid-cols-3 gap-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center p-3 rounded-xl bg-white border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  {f.icon}
                </div>
                <p className="text-[11px] font-medium text-gray-700 leading-tight">{f.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
