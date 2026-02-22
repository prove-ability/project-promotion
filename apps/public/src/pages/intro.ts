import { layout, ADMIN_URL } from "./layout";

const body = `
<style>
  .hero { padding: 6rem 1.5rem 4rem; text-align: center; }
  .hero-badge { display: inline-block; padding: 0.25rem 0.75rem; background: #eff6ff; color: #2563eb; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; margin-bottom: 1.5rem; }
  .hero h1 { font-size: 3rem; font-weight: 800; letter-spacing: -0.025em; line-height: 1.15; max-width: 700px; margin: 0 auto; }
  .hero h1 span { color: #2563eb; }
  .hero p { font-size: 1.125rem; color: #6b7280; max-width: 520px; margin: 1.25rem auto 0; }
  .hero-actions { margin-top: 2.5rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn-primary { display: inline-flex; align-items: center; padding: 0.875rem 2rem; background: #2563eb; color: #fff; border-radius: 12px; font-size: 1rem; font-weight: 600; transition: background 0.15s; }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-secondary { display: inline-flex; align-items: center; padding: 0.875rem 2rem; background: #f9fafb; color: #374151; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 1rem; font-weight: 500; transition: all 0.15s; }
  .btn-secondary:hover { background: #f3f4f6; border-color: #d1d5db; }

  .features { padding: 4rem 1.5rem 5rem; background: #f9fafb; }
  .features-title { text-align: center; font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
  .features-sub { text-align: center; color: #6b7280; margin-bottom: 3rem; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 1080px; margin: 0 auto; }
  .feature-card { background: #fff; padding: 2rem; border-radius: 16px; border: 1px solid #f3f4f6; }
  .feature-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1rem; }
  .feature-card h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
  .feature-card p { font-size: 0.875rem; color: #6b7280; }

  .cta-section { padding: 5rem 1.5rem; text-align: center; }
  .cta-section h2 { font-size: 2rem; font-weight: 700; margin-bottom: 0.75rem; }
  .cta-section p { color: #6b7280; margin-bottom: 2rem; }
</style>

<section class="hero">
  <div class="hero-badge">CDD 기반 페이지 빌더</div>
  <h1>프로모션 페이지를<br><span>쉽고 빠르게</span> 만들어보세요</h1>
  <p>드래그 앤 드롭으로 이벤트 페이지를 제작하고, 배포 후 성과를 실시간으로 분석하세요.</p>
  <div class="hero-actions">
    <a href="${ADMIN_URL}/login" class="btn-primary">무료로 시작하기</a>
    <a href="/guide" class="btn-secondary">사용 가이드 보기</a>
  </div>
</section>

<section class="features">
  <h2 class="features-title">왜 PromoBuilder인가요?</h2>
  <p class="features-sub">프로모션 페이지에 필요한 모든 것을 하나에</p>
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon" style="background:#eff6ff;">🧩</div>
      <h3>컴포넌트 기반 에디터</h3>
      <p>이미지, 버튼, 캐러셀, 메뉴 등 다양한 컴포넌트를 드래그 앤 드롭으로 조합하세요.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#f0fdf4;">📊</div>
      <h3>실시간 성과 분석</h3>
      <p>페이지뷰, 클릭, 스크롤 깊이까지. 별도 도구 없이 바로 확인할 수 있습니다.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#fef3c7;">⚡</div>
      <h3>극한의 퍼포먼스</h3>
      <p>정적 HTML로 서빙되어 Lighthouse 100점에 가까운 성능을 제공합니다.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#fce7f3;">🔗</div>
      <h3>원클릭 배포</h3>
      <p>만든 페이지를 버튼 하나로 배포하고, 고유 링크를 바로 공유하세요.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#ede9fe;">🔍</div>
      <h3>SEO 최적화</h3>
      <p>타이틀, 설명, OG 이미지를 간편하게 설정하여 검색 엔진과 SNS 공유에 최적화하세요.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#ecfdf5;">💰</div>
      <h3>합리적인 요금</h3>
      <p>무료로 시작하고, 월 2,075원부터 Pro 기능을 사용하세요. 연간 결제 시 28% 할인!</p>
    </div>
  </div>
</section>

<section class="cta-section">
  <h2>지금 바로 시작하세요</h2>
  <p>무료 계정으로 프로모션 페이지를 만들어보세요. 신용카드 없이 바로 시작할 수 있습니다.</p>
  <a href="${ADMIN_URL}/login" class="btn-primary">무료로 시작하기</a>
</section>
`;

export const introHtml = layout(
  "PromoBuilder - 프로모션 페이지를 쉽고 빠르게",
  "드래그 앤 드롭으로 프로모션 페이지를 만들고, 배포 후 성과를 실시간으로 분석하세요.",
  body
);
