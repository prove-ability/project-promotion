import { layout, ADMIN_URL, type Lang } from "./layout";

const body = `
<style>
  .guide-hero { padding: 4rem 1.5rem 2rem; text-align: center; }
  .guide-hero h1 { font-size: 2.25rem; font-weight: 800; }
  .guide-hero p { color: #6b7280; margin-top: 0.75rem; }

  .steps { max-width: 720px; margin: 0 auto 5rem; padding: 0 1.5rem; }
  .step { display: flex; gap: 1.5rem; padding: 2rem 0; border-bottom: 1px solid #f3f4f6; }
  .step:last-child { border-bottom: none; }
  .step-num { flex-shrink: 0; width: 48px; height: 48px; background: #eff6ff; color: #2563eb; font-size: 1.25rem; font-weight: 700; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .step-content h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
  .step-content p { font-size: 0.875rem; color: #6b7280; }

  .guide-cta { text-align: center; padding: 3rem 1.5rem 5rem; }
  .guide-cta h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
  .guide-cta p { color: #6b7280; margin-bottom: 1.5rem; }
  .guide-cta a { display: inline-flex; padding: 0.875rem 2rem; background: #2563eb; color: #fff; border-radius: 12px; font-weight: 600; transition: background 0.15s; }
  .guide-cta a:hover { background: #1d4ed8; }
</style>

<section class="guide-hero">
  <h1>사용 가이드</h1>
  <p>5분이면 첫 프로모션 페이지를 만들 수 있습니다</p>
</section>

<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-content">
      <h3>회원가입</h3>
      <p>Google 계정으로 간편하게 가입하세요. 별도 비밀번호 설정 없이 바로 시작할 수 있습니다.</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">2</div>
    <div class="step-content">
      <h3>새 페이지 만들기</h3>
      <p>대시보드에서 "새 페이지 만들기" 버튼을 클릭하면 에디터가 열립니다.</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">3</div>
    <div class="step-content">
      <h3>컴포넌트 조합하기</h3>
      <p>왼쪽 패널에서 원하는 컴포넌트(이미지, 텍스트, 버튼, 캐러셀 등)를 드래그하여 캔버스에 배치하세요. 오른쪽 패널에서 상세 속성을 수정할 수 있습니다.</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">4</div>
    <div class="step-content">
      <h3>SEO 정보 입력</h3>
      <p>상단 툴바의 SEO 버튼을 클릭하여 페이지 제목, 설명, OG 이미지를 설정하세요. 검색 엔진과 SNS 공유 시 노출되는 정보입니다.</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">5</div>
    <div class="step-content">
      <h3>배포하기</h3>
      <p>"배포" 버튼을 누르면 고유 링크가 생성됩니다. 이 링크를 고객에게 공유하세요.</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">6</div>
    <div class="step-content">
      <h3>성과 분석</h3>
      <p>대시보드에서 각 페이지의 "분석" 링크를 클릭하면 페이지뷰, 클릭, 스크롤 깊이 등 방문자 행동을 확인할 수 있습니다.</p>
    </div>
  </div>
</div>

<section class="guide-cta">
  <h2>준비되셨나요?</h2>
  <p>지금 바로 첫 프로모션 페이지를 만들어보세요.</p>
  <a href="${ADMIN_URL}/login">무료로 시작하기</a>
</section>
`;

const guideJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Build a Promotion Page with PromoBuilder",
  description:
    "Step-by-step guide: sign up, choose components, customize design, and deploy your promotion page.",
  step: [
    { "@type": "HowToStep", name: "Sign Up", text: "Create a free account with Google login." },
    { "@type": "HowToStep", name: "Create Page", text: "Click 'New Page' and choose a layout." },
    { "@type": "HowToStep", name: "Add Components", text: "Drag and drop images, text, buttons, and carousels." },
    { "@type": "HowToStep", name: "Set SEO", text: "Configure title, description, and OG image for search engines." },
    { "@type": "HowToStep", name: "Deploy", text: "Click publish to deploy instantly to your custom URL." },
  ],
};

export const guideHtml = layout(
  "사용 가이드 — PromoBuilder",
  "PromoBuilder로 프로모션 페이지를 만드는 방법을 단계별로 안내합니다.",
  body,
  { path: "/guide", lang: "ko", jsonLd: guideJsonLd },
);
