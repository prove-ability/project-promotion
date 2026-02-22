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
  <h1>Simple Pricing</h1>
  <p>Pay only for what you need. Upgrade or cancel anytime.</p>
  <div class="billing-toggle">
    <button id="btn-monthly" class="active" onclick="setBilling('monthly')">Monthly</button>
    <button id="btn-yearly" onclick="setBilling('yearly')">Annual <span class="save-badge">Save 28%</span></button>
  </div>
</section>

<div class="pricing-grid">
  <div class="plan-card">
    <p class="plan-name">Free</p>
    <p class="plan-price">$0</p>
    <p class="plan-desc">Get started with your first promo page</p>
    <ul class="plan-features">
      <li>1 promotion page</li>
      <li>14-day analytics</li>
      <li>Pageview tracking</li>
      <li>SEO settings</li>
      <li>One-click deploy</li>
      <li class="disabled">Click/scroll analytics</li>
      <li class="disabled">Remove branding</li>
    </ul>
    <a href="${ADMIN_URL}/login" class="plan-btn plan-btn-outline">Start Free</a>
  </div>

  <div class="plan-card popular">
    <div class="plan-badge">Recommended</div>
    <p class="plan-name">Pro</p>
    <p class="plan-price" id="pro-price">₩2,900 <span>/ mo</span></p>
    <p class="plan-price-yearly-detail" id="pro-yearly-detail">
      <span class="original">₩34,800/yr</span>
      <span class="discount">₩24,900/yr (28% off)</span>
    </p>
    <p class="plan-desc">More pages and detailed analytics</p>
    <ul class="plan-features">
      <li>5 promotion pages</li>
      <li>1-year analytics history</li>
      <li>Pageview tracking</li>
      <li>SEO settings</li>
      <li>One-click deploy</li>
      <li>Click/scroll analytics</li>
      <li>Remove branding</li>
    </ul>
    <a href="${ADMIN_URL}/login" class="plan-btn plan-btn-primary" id="pro-cta">Start Pro</a>
    <p class="plan-cta-note" id="pro-cta-note">Save ₩9,900 with annual billing</p>
  </div>

  <div class="plan-card">
    <p class="plan-name">Business</p>
    <p class="plan-price" style="font-size:1.75rem;color:#9ca3af;">Coming Soon</p>
    <p class="plan-desc">For agencies and enterprises</p>
    <ul class="plan-features">
      <li>Unlimited pages</li>
      <li>Full analytics history</li>
      <li>Detailed reports + CSV export</li>
      <li>Custom domain</li>
      <li>Remove branding</li>
      <li>Priority support</li>
    </ul>
    <span class="plan-btn plan-btn-disabled">Coming Soon</span>
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
    price.innerHTML = '₩2,075 <span>/ mo</span>';
    detail.style.display = 'block';
    note.style.display = 'block';
  } else {
    btnM.className = 'active';
    btnY.className = '';
    price.innerHTML = '₩2,900 <span>/ mo</span>';
    detail.style.display = 'none';
    note.style.display = 'none';
  }
}
</script>
`;

export const pricingEnHtml = layout(
  "Pricing — PromoBuilder",
  "Start free, upgrade anytime. Pro plans from ₩2,075/mo with advanced analytics and more.",
  body,
  {
    path: "/en/pricing",
    lang: "en",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PromoBuilder",
      url: "https://promotion.ccoshong.top",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "KRW",
          description: "1 promotion page, 14-day analytics, pageview tracking",
        },
        {
          "@type": "Offer",
          name: "Pro Monthly",
          price: "2900",
          priceCurrency: "KRW",
          billingIncrement: 1,
          description: "5 promotion pages, 1-year analytics, click/scroll tracking, no branding",
        },
        {
          "@type": "Offer",
          name: "Pro Yearly",
          price: "24900",
          priceCurrency: "KRW",
          billingIncrement: 12,
          description: "5 promotion pages, 1-year analytics, click/scroll tracking, no branding — 28% discount",
        },
      ],
    },
  },
);
