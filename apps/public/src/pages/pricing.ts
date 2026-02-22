import { layout, ADMIN_URL } from "./layout";

const body = `
<style>
  .pricing-hero { padding: 4rem 1.5rem 1rem; text-align: center; }
  .pricing-hero h1 { font-size: 2.25rem; font-weight: 800; }
  .pricing-hero p { color: #6b7280; margin-top: 0.75rem; }

  .billing-toggle { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
  .billing-toggle button { padding: 0.5rem 1.25rem; font-size: 0.875rem; font-weight: 600; border-radius: 9999px; border: none; cursor: pointer; transition: all 0.15s; }
  .billing-toggle button.active { background: #2563eb; color: #fff; }
  .billing-toggle button:not(.active) { background: #f3f4f6; color: #6b7280; }
  .billing-toggle button:not(.active):hover { background: #e5e7eb; }
  .billing-toggle .save-badge { font-size: 0.625rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 9999px; margin-left: 0.375rem; vertical-align: middle; }
  .billing-toggle button.active .save-badge { background: rgba(255,255,255,0.2); color: #fff; }
  .billing-toggle button:not(.active) .save-badge { background: #dcfce7; color: #16a34a; }

  .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; max-width: 980px; margin: 2.5rem auto 5rem; padding: 0 1.5rem; }

  .plan-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 2.5rem 2rem; position: relative; }
  .plan-card.popular { border-color: #2563eb; box-shadow: 0 0 0 1px #2563eb; }
  .plan-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #2563eb; color: #fff; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 1rem; border-radius: 9999px; }
  .plan-name { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; }
  .plan-price { font-size: 2.5rem; font-weight: 800; margin: 1rem 0 0.25rem; }
  .plan-price span { font-size: 1rem; font-weight: 400; color: #6b7280; }
  .plan-price-yearly-detail { font-size: 0.75rem; margin-top: 0.25rem; display: none; }
  .plan-price-yearly-detail .original { color: #9ca3af; text-decoration: line-through; }
  .plan-price-yearly-detail .discount { color: #16a34a; font-weight: 600; margin-left: 0.5rem; }
  .plan-desc { font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem; }

  .plan-features { list-style: none; margin-bottom: 2rem; }
  .plan-features li { padding: 0.5rem 0; font-size: 0.875rem; color: #374151; display: flex; align-items: center; gap: 0.5rem; }
  .plan-features li::before { content: '✓'; color: #10b981; font-weight: 700; }
  .plan-features li.disabled { color: #d1d5db; }
  .plan-features li.disabled::before { content: '—'; color: #d1d5db; }

  .plan-btn { display: block; width: 100%; text-align: center; padding: 0.875rem; border-radius: 12px; font-size: 0.9375rem; font-weight: 600; transition: all 0.15s; text-decoration: none; }
  .plan-btn-primary { background: #2563eb; color: #fff; }
  .plan-btn-primary:hover { background: #1d4ed8; }
  .plan-btn-outline { background: #fff; color: #374151; border: 1px solid #e5e7eb; }
  .plan-btn-outline:hover { background: #f9fafb; }
  .plan-btn-disabled { background: #f3f4f6; color: #9ca3af; cursor: default; }

  .plan-cta-note { text-align: center; font-size: 0.75rem; color: #16a34a; font-weight: 500; margin-top: 0.5rem; display: none; }
</style>

<section class="pricing-hero">
  <h1>심플한 요금제</h1>
  <p>필요한 만큼만 사용하세요. 언제든 업그레이드하거나 해지할 수 있습니다.</p>
  <div class="billing-toggle">
    <button id="btn-monthly" class="active" onclick="setBilling('monthly')">월간</button>
    <button id="btn-yearly" onclick="setBilling('yearly')">연간 <span class="save-badge">28% 할인</span></button>
  </div>
</section>

<div class="pricing-grid">
  <div class="plan-card">
    <p class="plan-name">Free</p>
    <p class="plan-price">0원</p>
    <p class="plan-desc">프로모션 페이지를 처음 만들어보세요</p>
    <ul class="plan-features">
      <li>프로모션 페이지 1개</li>
      <li>최근 14일 로깅 조회</li>
      <li>페이지뷰 분석</li>
      <li>SEO 설정</li>
      <li>원클릭 배포</li>
      <li class="disabled">클릭/스크롤 분석</li>
      <li class="disabled">브랜딩 제거</li>
    </ul>
    <a href="${ADMIN_URL}/login" class="plan-btn plan-btn-outline">무료로 시작하기</a>
  </div>

  <div class="plan-card popular">
    <div class="plan-badge">추천</div>
    <p class="plan-name">Pro</p>
    <p class="plan-price" id="pro-price">2,900원 <span>/ 월</span></p>
    <p class="plan-price-yearly-detail" id="pro-yearly-detail">
      <span class="original">34,800원/년</span>
      <span class="discount">24,900원/년 (28% 할인)</span>
    </p>
    <p class="plan-desc">더 많은 페이지와 상세한 분석</p>
    <ul class="plan-features">
      <li>프로모션 페이지 5개</li>
      <li>최근 1년 로깅 조회</li>
      <li>페이지뷰 분석</li>
      <li>SEO 설정</li>
      <li>원클릭 배포</li>
      <li>클릭/스크롤 분석</li>
      <li>브랜딩 제거</li>
    </ul>
    <a href="${ADMIN_URL}/login" class="plan-btn plan-btn-primary" id="pro-cta">Pro 시작하기</a>
    <p class="plan-cta-note" id="pro-cta-note">연간 결제 시 9,900원 절약</p>
  </div>

  <div class="plan-card">
    <p class="plan-name">Business</p>
    <p class="plan-price" style="font-size:1.75rem;color:#9ca3af;">준비 중</p>
    <p class="plan-desc">에이전시와 기업을 위한 플랜</p>
    <ul class="plan-features">
      <li>무제한 페이지</li>
      <li>전체 기간 로깅 조회</li>
      <li>상세 리포트 + CSV 내보내기</li>
      <li>커스텀 도메인 연결</li>
      <li>브랜딩 제거</li>
      <li>우선 지원</li>
    </ul>
    <span class="plan-btn plan-btn-disabled">곧 출시 예정</span>
  </div>
</div>

<script>
function setBilling(interval) {
  var btnM = document.getElementById('btn-monthly');
  var btnY = document.getElementById('btn-yearly');
  var price = document.getElementById('pro-price');
  var detail = document.getElementById('pro-yearly-detail');
  var note = document.getElementById('pro-cta-note');

  if (interval === 'yearly') {
    btnM.className = '';
    btnY.className = 'active';
    price.innerHTML = '2,075원 <span>/ 월</span>';
    detail.style.display = 'block';
    note.style.display = 'block';
  } else {
    btnM.className = 'active';
    btnY.className = '';
    price.innerHTML = '2,900원 <span>/ 월</span>';
    detail.style.display = 'none';
    note.style.display = 'none';
  }
}
</script>
`;

export const pricingHtml = layout(
  "요금제 - PromoBuilder",
  "무료로 시작하고, 필요할 때 업그레이드하세요. 월 2,075원부터 더 많은 기능을 사용할 수 있습니다.",
  body
);
