import { layout, ADMIN_URL } from "../layout";

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
  <h1>简单定价</h1>
  <p>按需使用，随时升级或取消。</p>
  <div class="billing-toggle">
    <button id="btn-monthly" class="active" onclick="setBilling('monthly')">月付</button>
    <button id="btn-yearly" onclick="setBilling('yearly')">年付 <span class="save-badge">省 16%</span></button>
  </div>
</section>

<div class="pricing-grid">
  <div class="plan-card">
    <p class="plan-name">Free</p>
    <p class="plan-price">$0</p>
    <p class="plan-desc">创建您的第一个促销页面</p>
    <ul class="plan-features">
      <li>1 个促销页面</li>
      <li>14 天数据分析</li>
      <li>页面浏览分析</li>
      <li>SEO 设置</li>
      <li>一键部署</li>
      <li class="disabled">点击/滚动分析</li>
      <li class="disabled">去除品牌标识</li>
    </ul>
    <a href="${ADMIN_URL}/login" class="plan-btn plan-btn-outline">免费开始</a>
  </div>

  <div class="plan-card popular">
    <div class="plan-badge">推荐</div>
    <p class="plan-name">Pro</p>
    <p class="plan-price" id="pro-price">$1.99 <span>/ 月</span></p>
    <p class="plan-price-yearly-detail" id="pro-yearly-detail">
      <span class="original">$23.88/年</span>
      <span class="discount">$19.99/年（省 16%）</span>
    </p>
    <p class="plan-desc">更多页面与详细分析</p>
    <ul class="plan-features">
      <li>5 个促销页面</li>
      <li>1 年数据分析</li>
      <li>页面浏览分析</li>
      <li>SEO 设置</li>
      <li>一键部署</li>
      <li>点击/滚动分析</li>
      <li>去除品牌标识</li>
    </ul>
    <a href="${ADMIN_URL}/login" class="plan-btn plan-btn-primary" id="pro-cta">开始使用 Pro</a>
    <p class="plan-cta-note" id="pro-cta-note">年付可节省 $3.89</p>
  </div>

  <div class="plan-card">
    <p class="plan-name">Business</p>
    <p class="plan-price" style="font-size:1.75rem;color:#9ca3af;">即将推出</p>
    <p class="plan-desc">面向代理商和企业</p>
    <ul class="plan-features">
      <li>无限制页面</li>
      <li>全时段数据分析</li>
      <li>详细报告 + CSV 导出</li>
      <li>自定义域名</li>
      <li>去除品牌标识</li>
      <li>优先支持</li>
    </ul>
    <span class="plan-btn plan-btn-disabled">即将推出</span>
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
    price.innerHTML = '$1.67 <span>/ 月</span>';
    detail.style.display = 'block';
    note.style.display = 'block';
  } else {
    btnM.className = 'active';
    btnY.className = '';
    price.innerHTML = '$1.99 <span>/ 月</span>';
    detail.style.display = 'none';
    note.style.display = 'none';
  }
}
</script>
`;

export const pricingZhHtml = layout(
  "定价 — PromoBuilder",
  "免费开始，随时升级。Pro 套餐低至 $1.67/月，享受高级分析和更多功能。",
  body,
  {
    path: "/zh/pricing",
    lang: "zh",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PromoBuilder",
      url: "https://promotion.ccoshong.top",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", description: "1 promotion page, 14-day analytics, pageview tracking" },
        { "@type": "Offer", name: "Pro Monthly", price: "1.99", priceCurrency: "USD", description: "5 promotion pages, 1-year analytics, click/scroll tracking, no branding" },
        { "@type": "Offer", name: "Pro Yearly", price: "19.99", priceCurrency: "USD", description: "5 promotion pages, 1-year analytics, click/scroll tracking, no branding — 16% discount" },
      ],
    },
  },
);
